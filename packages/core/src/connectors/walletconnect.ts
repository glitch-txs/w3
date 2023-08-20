import { QrModalOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider"
import { Provider } from "../types"
import {  KEY_WALLET } from "../constants"
import { Injected } from "./injected"
import { getW3, setW3 } from "../store/w3store"
import { catchError } from "../utils"

type WalletConnectOptions = {
  showQrModal?: boolean, qrModalOptions?: QrModalOptions, icon?: any, projectId: string
}
export class WalletConnect extends Injected {
  readonly id: string
  readonly name: string
  readonly icon?: any
  private provider?: Provider
  private options: WalletConnectOptions
  getProvider:()=>Promise<Provider> | Provider | undefined

  constructor(options: WalletConnectOptions){
    const getProvider = ()=>{
      return this.provider
    }

    super()

    this.id = "walletConnect"
    this.name = 'WalletConnect'
    this.icon = options?.icon
    this.options = options
    this.getProvider = getProvider
  }

  async init(){
    const { EthereumProvider } = await import("@walletconnect/ethereum-provider")

    const { showQrModal, qrModalOptions, projectId } = this.options
  
    if(projectId === 'YOUR_PROJECT_ID') throw new Error('Invalid Project Id')

    const chains = getW3.chains().map(chain => {
      if(typeof chain === 'number') return chain 
      return Number(chain.chainId)
    })

    //@ts-ignore - strict type on chains vs optionalChains
    const provider = await EthereumProvider.init({
      projectId,
      chains: chains.length === 1 ? chains : undefined,
      optionalChains: chains,
      showQrModal:showQrModal ?? false,
      qrModalOptions,
    }).catch(catchError)
  
    if(!provider) throw new Error('Failed to initialize WalletConnect - Error not caught')

    this.provider = provider as Provider
    
    provider.on("disconnect", () => {
      if(localStorage.getItem(KEY_WALLET) === this.id) localStorage.removeItem(KEY_WALLET)
      setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
    });

    provider.on('display_uri', setW3.uri)
  
    if(provider.session){    
      const connected = await this.setAccountAndChainId(provider as Provider)
      if(connected) {
        console.log("hello", connected)
        if(localStorage.getItem(KEY_WALLET) !== this.id) localStorage.setItem(KEY_WALLET, this.id)
        setW3.walletProvider(provider as Provider), setW3.wait(undefined)
      return
      }
    }
    window?.dispatchEvent(new Event('WalletConnect#ready', {bubbles: true}))
  }

  async connect(){
    const provider = await this.getProvider()
    if(!provider){
      window.addEventListener('WalletConnect#ready', this.connect, { once: true })
      return
    }
    
    setW3.wait('Connecting')
    
    await provider.connect?.()
    .catch(catchError)
    
    const connected = await this.setAccountAndChainId(this.provider)
    if(connected) {
      setW3.walletProvider(provider as Provider)
      localStorage.setItem(KEY_WALLET,this.id)
    }

    setW3.wait(undefined)
  }

  async disconnect() {
    setW3.wait('Disconnecting')
    const provider = await this.getProvider()
    console.log(provider)
    await provider?.disconnect?.()
    localStorage.removeItem(KEY_WALLET)
    setW3.address(undefined), setW3.chainId(undefined)
    setW3.walletProvider(undefined), setW3.wait(undefined)
  }
}