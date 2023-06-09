import { web3Store } from "../../store/web3store";
import { EIP1193Provider, EIP6963ProviderDetail, URL } from "../../types";
import { KEY_WALLET } from "../../utils/constants";
import { Connector } from "./base";

export class EIP6963 extends Connector {
  readonly name: string
  readonly install?: URL
  readonly deeplink?: URL
  private provider: EIP1193Provider
  icon: any

  constructor({ info, provider }: EIP6963ProviderDetail){

    const getProvider = ()=>this.provider

    super(getProvider)
    
    this.provider = provider
    this.name = info.name
    this.icon = info.icon
  }

  async init(){
    if(window.localStorage.getItem(KEY_WALLET) === this.name){
      const { setState } = web3Store
      setState((state)=> ({isLoading: true}))
      const connected = await this.setAccountAndChainId(this.provider)
      if(connected){
        this.addEvents(this.provider)
        setState((state)=>({childProvider: this.provider}))
      }else{
        window?.localStorage.removeItem(KEY_WALLET)
      }
      setState((state)=> ({isLoading: false}))
    }
    this.ready = true
  }
}