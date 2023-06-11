import { QrModalOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider"
import { web3Store } from "../../store/web3store"
import { EIP1193Provider, URL, WalletNames } from "../../types"
import { DEBUG, KEY_WALLET } from "../../utils/constants"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class WalletConnect extends Connector {
  readonly id: string
  readonly name: WalletNames
  readonly install?: URL
  readonly deeplink?: URL
  readonly icon?: any
  private provider: EIP1193Provider
  private initFailed: boolean
  private options: { showQrModal?: boolean, qrModalOptions?: QrModalOptions, projectID?: string, icon?: any }

  constructor(options?: any){
    const getProvider = ()=>{
      return this.provider
    }

    super()

    this.id = "walletconnect"
    this.name = 'WalletConnect'
    this.icon = options.icon
    this.options = options ?? {}
    this.initFailed = false
    this.getProvider = getProvider
  }

  async init(){
    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
      throw new Error('You need to provide NEXT_PUBLIC_WALLETCONNECT_ID env variable')
    }
    const { setState } = web3Store

    /**If last connection was WalletConnect let's wait to init and catch the user session */
    if(window.localStorage.getItem(KEY_WALLET) === this.name)
    setState((state)=>({ isLoading:true }))
  
    const { EthereumProvider, OPTIONAL_METHODS, OPTIONAL_EVENTS } = await import("@walletconnect/ethereum-provider")

    const { showQrModal, qrModalOptions, projectID } = this.options
  
    const provider = await EthereumProvider.init({
      projectId: projectID ?? process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
      chains: [Number(web3Store.getState().chains[0])],
      optionalChains: web3Store.getState().chains.map(chain => Number(chain.chainId)),
      showQrModal:showQrModal ?? true,
      optionalMethods:OPTIONAL_METHODS,
      optionalEvents:OPTIONAL_EVENTS,
      qrModalOptions: qrModalOptions ?? {
        themeMode: "light",
        chainImages: [],
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

    provider?.on('display_uri', (uri)=>{
      const eventUri = new CustomEvent("walletconnect#uri",{ detail: { uri } })
      window.dispatchEvent(eventUri)
    })
    
    DEBUG && console.log('Walletconnect has initialized')
    
    if(provider?.session && window?.localStorage.getItem(KEY_WALLET) === this.name){
      //@ts-ignore EthereumProvider satisfies EIP1193
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
    
    window?.dispatchEvent(new Event('WalletConnect#ready', {bubbles: true}))
  }

  async connect() {
    const { setState } = web3Store

    if(this.initFailed){
      setState((state)=>({ error: 'WalletConnect failed to initialize' }))
      return
    }
    if(!this.ready){
      window?.addEventListener('WalletConnect#ready', this.connect)
      return
    }
    setState((state)=>({isLoading: true}))
    window.removeEventListener('WalletConnect#ready', this.connect)

    await this.provider.connect().catch(console.error)

    const connected = await this.setAccountAndChainId(this.provider)
    if(connected) {
      setState((state)=>({childProvider: this.provider}))
      window?.localStorage.setItem(KEY_WALLET,this.name)
    }

    setState((state)=>({isLoading: false}))
  }

  async disconnect() {
    web3Store.setState((state)=>({isLoading: true}))
    await this.provider.disconnect()
    window?.localStorage.removeItem(KEY_WALLET)
    web3Store.setState((state)=>({ userAccount: '', chainId: null, childProvider: null, isLoading: false }))
  }
}