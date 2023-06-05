import { web3Store } from "../../store/web3store"
import { URL, WalletNames } from "../../types"
import { DEBUG, KEY_WALLET } from "../../utils/constants"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class WalletConnect extends Connector {
  readonly name: WalletNames
  readonly install?: URL
  readonly deeplink?: URL
  private provider: any
  private initFailed: boolean

  constructor(){
    const getProvider = ()=>{
      return this.provider
    }

    super(getProvider)

    this.name = 'WalletConnect'
    this.initFailed = false
  }

  async init(){
    if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
      throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
    }
    const { setState } = web3Store

    /**If last connection was WalletConnect let's wait to init and catch the user session */
    if(window.localStorage.getItem(KEY_WALLET) === this.name)
    setState((state)=>({ isLoading:true }))
  
    const { EthereumProvider, OPTIONAL_METHODS, OPTIONAL_EVENTS } = await import("@walletconnect/ethereum-provider")
  
    const provider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      chains: web3Store.getState().chains.map(chain => Number(chain.chainId)),
      showQrModal:true,
      optionalMethods:OPTIONAL_METHODS,
      optionalEvents:OPTIONAL_EVENTS,
      qrModalOptions:{
        themeMode: "light",
        themeVariables:{
          '--w3m-background-color': '#202020',
          '--w3m-accent-color': '#202020',
        }
      },
      metadata: {
        name: document?.title,
        description: document?.querySelector('meta[name="description"]')?.textContent ?? "",
        url: `${isWindow()}`,
        icons: [`${isWindow()}favicon.ico`],
      },
    }).catch(e=> {
      console.error("WC Init error: ", e)
      this.initFailed = true
    });
  
    if(this.initFailed){
      if(window?.localStorage.getItem(KEY_WALLET) === this.name) setState((state)=>({ isLoading: false }))
      return
    }
    
    this.provider = provider
    
    provider?.on("disconnect", () => {
      DEBUG && console.log(`${this.name}: session ended`)
      if(window?.localStorage.getItem(KEY_WALLET) === this.name) window?.localStorage.removeItem(KEY_WALLET)
      setState((state)=>({ userAccount: '', chainId: null, childProvider: null }))
    });
    
    DEBUG && console.log('Walletconnect has initialized')
    
    if(provider?.session && window?.localStorage.getItem(KEY_WALLET) === this.name){
      const connected = await this.setAccountAndChainId(provider)
      if(connected) {
        window.removeEventListener('WalletConnect#ready', this.connect)
        setState({childProvider: provider, isLoading: false})
        this.ready = true
        return
      }
      window?.localStorage.removeItem(KEY_WALLET)
    }

    this.ready = true
    if(window?.localStorage.getItem(KEY_WALLET) === this.name) setState((state)=>({ isLoading: false }))
    
    const eventReady = new Event('WalletConnect#ready', {bubbles: true})
    window?.dispatchEvent(eventReady)
  }

  async connect() {
    const { setState } = web3Store

    if(this.initFailed){
      setState((state)=>({ errorMessage: 'WalletConnect failed to initialize' }))
      return
    }
    if(!this.ready){
      window?.addEventListener('WalletConnect#ready', this.connect)
      return
    }
    setState((state)=>({isLoading: true}))
    window.removeEventListener('WalletConnect#ready', this.connect)

    await this.provider.connect().then(async(provider: any)=> {
      const connected = await this.setAccountAndChainId(provider)
      if(connected) {
        setState((state)=>({childProvider: provider}))
        window?.localStorage.setItem(KEY_WALLET,this.name)
      }
    }).catch(console.error)

    setState((state)=>({isLoading: false}))
  }

  async disconnect() {
    web3Store.setState((state)=>({isLoading: true}))
    await this.provider.disconnect()
    window?.localStorage.removeItem(KEY_WALLET)
    web3Store.setState((state)=>({ userAccount: '', chainId: null, childProvider: null, isLoading: false }))
  }
}