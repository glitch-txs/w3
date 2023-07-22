import { setW3, states } from "../../store/w3store"
import { Address, EIP1193Provider, URL } from "../../types"
import { DEBUG, KEY_WALLET } from "../../utils/constants"
import { filter_disconnect } from "../../utils/disconnect"
import { isOnMobile } from "../../utils/handleMobile"

const mobile = isOnMobile()

/*Important: Only use isLoading in Init function if the current wallet is on localStorage,
it only needs to be triggered once */

export abstract class BaseWallet {
  /** Wallet id */
  abstract readonly id: string
  /** Wallet name */
  abstract readonly name:  string
  /** Whether Wallet is usable */
  protected ready: boolean
  /**Installation website */
  abstract readonly install?: URL
  /**Wallet is installed */
  installed?: boolean
  /**Deeplink to open explorer on mobile */
  abstract readonly deeplink?: URL
  /**Wallet icon */
  abstract readonly icon?: any
  
  protected abstract getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined
  
  constructor() {
    this.ready = false
    this.installed = true
  }

  async init(){
    if(window.localStorage.getItem(KEY_WALLET) === this.id){
      // injection delay - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1
      await new Promise(r => setTimeout(r, 100))
      const provider = await this.getProvider()
      if(!provider){
        window.localStorage.removeItem(KEY_WALLET)
        this.installed = false
        setW3.wait(undefined)
        return
      }
      const connected = await this.setAccountAndChainId(provider)
      if(connected){
        this.addEvents(provider)
        setW3.walletProvider(provider)
      }else{
        window?.localStorage.removeItem(KEY_WALLET)
      }
      setW3.wait(undefined)
    }
    this.ready = true
  }

  async connect(){
    setW3.wait('Connecting')
    const provider = await this.getProvider()
    
    if(!provider){
      setW3.wait(undefined)
      if(mobile && this.deeplink){
        //If user is on mobile and provider is not injected it will open the wallets browser.
        window.open(this.deeplink)
        return
      }else{
        //If the wallet is not installed then it will open this link to install the extention.
        DEBUG && console.warn(`${this.name} provider is not injected`)
        //TODO check ErrorSystem code before assigning.
        setW3.error(`${this.name} wallet is not installed!`)
        this.installed = false
        return
      }
    }

    await provider.request({ method: 'eth_requestAccounts' })
    .then(async(accounts: Address[])=> {
      window?.localStorage.setItem(KEY_WALLET, this.id)

      setW3.address(accounts[0]), setW3.walletProvider(provider)
      await this.setChainId(provider)
      this.addEvents(provider)
  
      /** If the dapp supports more than one chain we won't ask the user to switch to a default one */
      const chains = states.chains()
      if(chains.length > 1){
        setW3.wait(undefined)
        return
      }
  
      /**Request to switch to a default chain */
      if(states.chainId() !== Number(chains[0]?.chainId)){
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[0]?.chainId }],
        }).catch(async (er: any)=>{
          if(er.code === 4902 || er?.data?.originalError?.code == 4902){
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [chains[0]],
              })
              .catch((er: any)=>{
                console.error(`${this.name}: user rejected the add new chain request`, er)
              })
          }
        })
      } 
    })
    .catch((err: any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.error(`${this.name}: user rejected the connection request`)
      } else {
        console.error(`${this.name}: request connection error`,err)
      }
    })
    setW3.wait(undefined)
  }

  async disconnect(){
    const walletProvider = states.walletProvider()
    if(!walletProvider) return
    this.removeEvents(walletProvider)
    window?.localStorage.removeItem(KEY_WALLET)
    setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
  }

  protected async setAccountAndChainId(provider: EIP1193Provider | undefined){

    if(!provider) return

    let connected: boolean = false
  
    await provider.request({ method: 'eth_accounts' })
    .then(async (accounts: `0x${string}`[])=>{
      if(accounts?.length > 0){
        setW3.address(accounts[0])
        DEBUG && console.log(`${this.name}: user is connected as: ${accounts[0]}`)
  
        await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
          setW3.chainId(Number(chainId))
          DEBUG && console.log(`${this.name}: chain id - ${chainId}`)
        }).catch(console.error)
    
        connected = true
  
      }else{
        //is clearing needed here?
        setW3.address(undefined)
        DEBUG && console.log(`${this.name}: user is not connected`)
      }
  
    }).catch(console.error)
  
    return connected
  }

  protected async setChainId(provider: EIP1193Provider){
    await provider.request({ method: 'eth_chainId' }).then((chainId: string | number)=> {
      setW3.chainId(Number(chainId))
      DEBUG && console.log(`${this.name}: chain id - ${chainId}`)
    }).catch(console.error)
  }

  protected addEvents(provider: EIP1193Provider){
    if(provider.on){
      provider.on("accountsChanged", this.onAccountChange)
      provider.on("chainChanged",this.onChainChange)
      provider.on('connect',this.onConncent)
      provider.on('disconnect',this.onDisconnect)
    }else if (provider.addListener){
      //suggested by Trust Wallet
      provider.addListener("accountsChanged", this.onAccountChange)
      provider.addListener("chainChanged",this.onChainChange)
      provider.addListener('connect',this.onConncent)
      provider.addListener('disconnect',this.onDisconnect)
    } else {
      console.error("Event Listeners couldn't initialize.")
    }
  }

  protected removeEvents(provider: EIP1193Provider){
    provider.removeAllListeners?.()
  
    if(provider.removeListener){
      provider.removeListener("accountsChanged", this.onAccountChange)
      provider.removeListener("chainChanged",this.onChainChange)
      provider.removeListener('connect',this.onConncent)
      provider.removeListener('disconnect',this.onDisconnect)
    }
    if(provider.off){
      provider.off("accountsChanged", this.onAccountChange)
      provider.off("chainChanged",this.onChainChange)
      provider.off('connect',this.onConncent)
      provider.off('disconnect',this.onDisconnect)
    }
  }

  protected onAccountChange = (accounts: string[])=>{
    if(typeof accounts[0] !== 'undefined'){
      setW3.address(accounts[0])
      DEBUG && console.log(`${this.name}: user changed address to: `, accounts[0])
    }else{
      window?.localStorage.removeItem(KEY_WALLET)
      if(filter_disconnect(states.walletProvider())){
        /* EVM Phantom wallet breaks when running restartWeb3 - infinite loop
        reason: eth_account method triggers accountChange listener */
        window?.location.reload()
      }
      const walletProvider = states.walletProvider()
      if(!walletProvider) return
      this.removeEvents(walletProvider)
      setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
  
      DEBUG && console.log(`${this.name}: user has disconnect`)
    }
  }

  protected onChainChange = (chainId: string | number)=>{
    setW3.chainId(Number(chainId))
    DEBUG && console.log(`${this.name}: chain id - `, chainId)
  }

  protected onDisconnect = (err:Error)=>{
    setW3.error('Wallet connection lost')
    DEBUG && console.error(`${this.name} provider lost the blockchain connection`)
    console.error(err)
  }

  protected onConncent = async()=>{
    const provider = await this.getProvider()
    await this.setAccountAndChainId(provider)
    DEBUG && console.log(`${this.name} provider is connected`)
  }
}