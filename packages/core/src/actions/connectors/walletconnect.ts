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

  constructor(){
    const getProvider = ()=>{
      return this.provider
    }

    super(getProvider)

    this.name = 'WalletConnect'
    this.init()
  }

  async init(){
    if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
      throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
    }
    const { getState, setState } = web3Store
  
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
      setState({WCInitFailed: true})
    });
  
    if(getState().WCInitFailed)
    return
    
    this.provider = provider
    
    provider?.on("disconnect", () => {
      DEBUG && console.log(`${this.name}: session ended`)
      if(window?.localStorage.getItem(KEY_WALLET) === this.name) window?.localStorage.removeItem(KEY_WALLET)
      setState((state)=>({ userAccount: '', chainId: null, childProvider: null }))
    });
    
    console.log('Walletconnect has initialized')
    
    if(provider?.session && window.localStorage.getItem(KEY_WALLET) === this.name){
      const connected = await this.setAccountAndChainId(provider)
      if(connected) setState({childProvider: provider})
      this.ready = true
      return
    }
    this.ready = true
    const eventReady = new Event('WalletConnect#ready', {bubbles: true})
    window?.dispatchEvent(eventReady)
  }

  async connect() {
    const { setState } = web3Store
    setState((state)=>({isLoading: true}))
    
    if(!this.ready){
      window?.addEventListener('WalletConnect#ready', ()=>this.connect())
      return
    }

    await this.provider.connect().then(async(provider: any)=> {
      const connected = await this.setAccountAndChainId(provider)
      window?.localStorage.setItem(KEY_WALLET,this.name)
      if(connected) setState((state)=>({childProvider: provider}))

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