import { web3Store } from "../../store/web3store"
import { Address, EIP1193Provider, URL, WalletNames } from "../../types"
import { DEBUG, KEY_WALLET } from "../../utils/constants"
import { filter_disconnect } from "../../utils/disconnect"
import { fitler_eth_accounts } from "../../utils/eth_accounts"
import { isOnMobile } from "../../utils/handleMobile"

const mobile = isOnMobile()

/*Important: Only use isLoading in Init function if the current wallet is on localStorage,
it only needs to be triggered once */

export abstract class Connector{
  /** Connector id */
  abstract readonly id: string
  /** Connector name */
  abstract readonly name:  WalletNames | Omit<string,WalletNames>
  /** Whether connector is usable */
  protected ready: boolean
  /**Installation website */
  abstract readonly install?: URL
  /**Wallet is installed */
  installed?: boolean
  /**Deeplink to open explorer on mobile */
  abstract readonly deeplink?: URL
  /**Wallet icon */
  abstract readonly icon?: any
  
  protected getProvider:Promise<EIP1193Provider> | EIP1193Provider
  
  constructor() {
    this.ready = false
    this.installed = true
  }

  async init(){
    // injection delay - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1
    // await new Promise(r => setTimeout(r, 100))
    if(window.localStorage.getItem(KEY_WALLET) === this.name){
      const { setState } = web3Store
      setState((state)=> ({isLoading: true}))
      const provider = await this.getProvider()
      if(!provider){
        this.installed = false
      }
      if(!provider || fitler_eth_accounts(provider)) return
      const connected = await this.setAccountAndChainId(provider)
      if(connected){
        this.addEvents(provider)
        setState((state)=>({childProvider: provider}))
      }else{
        window?.localStorage.removeItem(KEY_WALLET)
      }
      setState((state)=> ({isLoading: false}))
    }
    this.ready = true
  }

  async connect(): Promise<any>{
    const { setState, getState } = web3Store
    setState((state)=>({isLoading: true}))
    const provider = await this.getProvider()
    
    if(!provider){
      setState((state)=>({isLoading: false}))
      if(mobile && this.deeplink){
        //If user is on mobile and provider is not injected it will open the wallets browser.
        window.open(this.deeplink)
        return
      }else{
        //If the wallet is not installed then it will open this link to install the extention.
        DEBUG && console.warn(`${this.name} provider is not injected`)
        setState((state)=>({ error: `${this.name} wallet is not installed!` }))
        this.installed = false
        getState().onboard && window.open(this.install, '_blank')
      }
    }

    await provider.request({ method: 'eth_requestAccounts' })
    .then(async(accounts: Address[])=> {
      window?.localStorage.setItem(KEY_WALLET, this.name as string)

      setState((state)=>({userAccount: accounts[0], childProvider: provider}))
      await this.setChainId(provider)
      this.addEvents(provider)
  
      /** If the dapp supports more than one chain we won't ask the user to switch to a default one */
      const chains = getState().chains
      if(chains.length > 1){
        setState((state)=>({isLoading: false}))
        return
      }
  
      /**Request to switch to a default chain */
      if(getState().chainId !== Number(chains[0]?.chainId)){
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
    setState((state)=>({isLoading: false}))
  }

  async disconnect(){
    const { setState }  = web3Store
    this.removeEvents(web3Store.getState().childProvider)
    window?.localStorage.removeItem(KEY_WALLET)
    setState({ userAccount: '', chainId: null, childProvider: null })
  }

  protected async setAccountAndChainId(provider: EIP1193Provider | undefined){

    if(!provider) return

    const { setState } = web3Store

    let connected: boolean = false
  
    await provider.request({ method: 'eth_accounts' })
    .then(async (accounts: `0x${string}`[])=>{
      if(accounts?.length > 0){
  
        setState((state)=>({ userAccount: accounts[0] as `0x${string}`}))
        DEBUG && console.log(`${this.name}: user is connected as: ${accounts[0]}`)
  
        await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
          setState((state)=>({ chainId: Number(chainId) }))
          DEBUG && console.log(`${this.name}: chain id - ${chainId}`)
        }).catch(console.error)
    
        connected = true
  
      }else{
        //is clearing needed here?
        setState((state)=>({ userAccount: ''}))
        DEBUG && console.log(`${this.name}: user is not connected`)
      }
  
    }).catch(console.error)
  
    return connected
  }

  protected async setChainId(provider: EIP1193Provider){
    const { setState } = web3Store

    await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
      setState((state)=>({ chainId: Number(chainId) }))
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

  protected onAccountChange(accounts: string[]){
    if(typeof accounts[0] !== 'undefined'){
      web3Store.setState((state)=>({ userAccount: accounts[0] as `0x${string}`}))
      DEBUG && console.log(`${this.name}: user changed address to: `, accounts[0])
    }else{
      window?.localStorage.removeItem(KEY_WALLET)
      if(filter_disconnect(web3Store.getState().childProvider)){
        /* EVM Phantom wallet breaks when running restartWeb3 - infinite loop
        reason: eth_account method triggers accountChange listener */
        window?.location.reload()
      }
      this.removeEvents(web3Store.getState().childProvider)
      web3Store.setState((state)=>({ userAccount: '', chainId: 0, childProvider: null }))
  
      DEBUG && console.log(`${this.name}: user has disconnect`)
    }
  }

  protected onChainChange(chainId: string | number){
    web3Store.setState((state)=>({ chainId: Number(chainId) }))
    DEBUG && console.log(`${this.name}: chain id - `, chainId)
  }

  protected onDisconnect(err:any){
    web3Store.setState((state)=>({ isProvider: false }))
    DEBUG && console.error(`${this.name} provider lost the blockchain connection`)
    console.error(err)
  }

  protected async onConncent(){
    const provider = await this.getProvider()
    await this.setAccountAndChainId(provider)
    web3Store.setState((state)=>({ isProvider: true }))
    DEBUG && console.log(`${this.name} provider is connected`)
  }
}