import { setW3, getW3 } from "../store/w3store"
import { Provider } from "../types"
import { KEY_WALLET } from "../constants"

type InjectedOpts = {
    /** Wallet uuid */
    uuid?: string
    /** Wallet id */
    id?: string
    /** Wallet name */
    name?:  string
    /**Wallet icon */
    icon?: any
    /**function that returns the injected wallet provider or undefined */
    getProvider?: ()=>Promise<Provider> | Provider | undefined
}

export class Injected {
  /** Wallet uuid */
  readonly uuid: string = ''
  /** Wallet id */
  readonly id: string
  /** Wallet name */
  readonly name:  string
  /**Wallet icon */
  readonly icon?: any
  
  getProvider:()=>Promise<Provider> | Provider | undefined

  constructor({ icon, name, id, uuid, getProvider }:InjectedOpts = {}){
    this.uuid = uuid ?? ''
    this.id = id ?? 'browserWallet'
    this.name = name ?? 'Browser Wallet'
    this.icon = icon
    this.getProvider = getProvider ?? (()=>{
      if(typeof window === 'undefined') return
      return window.ethereum
    })
  }

  async init(){
    if(window.localStorage.getItem(KEY_WALLET) === this.id){
      // injection delay - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1
      await new Promise(r => setTimeout(r, 100))
      const provider = await this.getProvider()
      if(!provider){
        window.localStorage.removeItem(KEY_WALLET)
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
  }

  async connect(){
    setW3.wait('Connecting')
    const provider = await this.getProvider()
    
    if(!provider){
      setW3.wait(undefined), setW3.error(new Error('Provider not found'))
      return
    }  
    await provider.request<string[]>({ method: 'eth_requestAccounts' })
    .then(async(accounts: string[])=> {
      /* Once connected */

      /* Save to localStorage */
      window?.localStorage.setItem(KEY_WALLET, this.id)

      /* Save address, chain and provider - initialize event listeners */
      setW3.address(accounts[0]), setW3.walletProvider(provider)
      await this.setChainId(provider), this.addEvents(provider)
  
      /** If the dapp supports more than one chain we won't ask the user to switch to a default one */
      const chains = getW3.chains()
      if(chains.length > 1){
        setW3.wait(undefined)
        return
      }
  
      /* Request to switch to a default chain */
      if(getW3.chainId() !== Number(chains[0]?.chainId)){
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[0]?.chainId }],
        }).catch(async (er: any)=>{
          if(er.code === 4902 || er?.data?.originalError?.code == 4902){
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [chains[0]],
              })
              .catch(setW3.error)
          }
        })
      } 
    })
    .catch(setW3.error)

    setW3.wait(undefined)
  }

  async disconnect(){
    const walletProvider = getW3.walletProvider()
    if(!walletProvider) return
    this.removeEvents(walletProvider)
    window?.localStorage.removeItem(KEY_WALLET)
    setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
  }

  protected async setAccountAndChainId(provider: Provider | undefined){
    if(!provider) return
    let connected: boolean = false
  
    await provider.request<string[]>({ method: 'eth_accounts' })
    .then(async (accounts)=>{
      if(accounts?.length > 0){
        setW3.address(accounts[0])

        await provider.request<string | number>({ method: 'eth_chainId' }).then((chainId)=> {
          setW3.chainId(Number(chainId))

        }).catch(setW3.error)
    
        connected = true
  
      }else{
        setW3.address(undefined)
      }
  
    }).catch(setW3.error)
  
    return connected
  }

  protected async setChainId(provider: Provider){
    await provider.request<string | number>({ method: 'eth_chainId' }).then((chainId)=> {
      setW3.chainId(Number(chainId))
    }).catch(console.error)
  }

  protected addEvents(provider: Provider){
    provider.on("accountsChanged", this.onAccountChange)
    provider.on("chainChanged",this.onChainChange)
    provider.on('connect',this.onConnect)
    provider.on('disconnect',this.onDisconnect)
  }

  protected removeEvents(provider: Provider){
    provider.removeListener("accountsChanged", this.onAccountChange)
    provider.removeListener("chainChanged",this.onChainChange)
    provider.removeListener('connect',this.onConnect)
    provider.removeListener('disconnect',this.onDisconnect)
  }

  protected onAccountChange = (accounts: string[])=>{
    if(typeof accounts[0] !== 'undefined'){
      setW3.address(accounts[0])
    }else{
      window?.localStorage.removeItem(KEY_WALLET)
      const walletProvider = getW3.walletProvider()
      if(walletProvider) this.removeEvents(walletProvider)
      setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
    }
  }

  protected onChainChange = (chainId: string | number)=>{
    setW3.chainId(Number(chainId))
  }

  protected onDisconnect = (error: Error)=>{
    setW3.error(error)
  }

  protected onConnect = async()=>{
    const provider = await this.getProvider()
    await this.setAccountAndChainId(provider)
  }
}