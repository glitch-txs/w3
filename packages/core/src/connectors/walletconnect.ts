import { QrModalOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider"
import { Provider } from "../types"
import {  KEY_WALLET } from "../constants"
import { WindowEthereum } from "./windowEthereum"
import { getW3, setW3 } from "../store/w3store"

type WalletConnectOptions = {
  showQrModal?: boolean, qrModalOptions?: QrModalOptions, projectId: string, icon?: any
}
export class WalletConnect extends WindowEthereum {
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
    this.icon = options.icon
    this.options = options
    this.getProvider = getProvider
  }

  async init(){
    const { EthereumProvider, OPTIONAL_METHODS, OPTIONAL_EVENTS } = await import("@walletconnect/ethereum-provider")

    const { showQrModal, qrModalOptions, projectId } = this.options
  
    const provider = await EthereumProvider.init({
      projectId,
      chains: [Number(getW3.chains()[0]?.chainId)],
      optionalChains: getW3.chains().map(chain => Number(chain.chainId)),
      showQrModal:showQrModal ?? false,
      qrModalOptions,
      optionalMethods:OPTIONAL_METHODS,
      optionalEvents:OPTIONAL_EVENTS,
    }).catch(setW3.error)
  
    if(!provider){
      if(window?.localStorage.getItem(KEY_WALLET) === this.id) setW3.wait(undefined)
      return
    }
    
    provider.on("disconnect", () => {
      if(localStorage.getItem(KEY_WALLET) === this.id) localStorage.removeItem(KEY_WALLET)
      setW3.address(undefined), setW3.chainId(undefined), setW3.walletProvider(undefined)
    });

    provider.on('display_uri', setW3.uri)
  
    if(provider.session){    
      const connected = await this.setAccountAndChainId(provider as Provider)
      if(connected) {
        if(localStorage.getItem(KEY_WALLET) !== this.id) localStorage.setItem(KEY_WALLET, this.id)
        setW3.walletProvider(provider as Provider), setW3.wait(undefined)
      return
      }
    }
    this.provider = provider as Provider
    window?.dispatchEvent(new Event('WalletConnect#ready', {bubbles: true}))
  }

  async connect(){
    const provider = await this.getProvider()
    if(!provider){
      window.addEventListener('WalletConnect#ready', this.connect)
      return
    }
    window.removeEventListener('WalletConnect#ready', this.connect)
    
    setW3.wait('Connecting')
    
    await provider.connect?.().catch(setW3.error)

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
    await provider?.disconnect?.()
    localStorage.removeItem(KEY_WALLET)
    setW3.address(undefined), setW3.chainId(undefined)
    setW3.walletProvider(undefined), setW3.wait(undefined)
  }
}