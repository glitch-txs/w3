// @ts-nocheck – ignore @coinbase/wallet-sdk window.ethereum.
import { web3Store } from "../../store/web3store";
import { EIP1193Provider, EIP6963ProviderDetail, URL } from "../../types";
import { KEY_WALLET } from "../../utils/constants";
import { BaseWallet } from "./base";

export class EIP6963 extends BaseWallet {
  readonly id: string
  readonly name: string
  readonly install?: URL
  readonly deeplink?: URL
  icon: any
  provider: any
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined

  constructor({ info, provider }: EIP6963ProviderDetail){

    super()
    this.provider = provider
    this.id = info.uuid
    this.name = info.name
    this.icon = info.icon
    this.getProvider = ()=>this.provider
    this.init()
  }

  async init(){
    if(window.localStorage.getItem(KEY_WALLET) === this.id){
      const { setState } = web3Store
      setState((state)=> ({wait: {state: true, reason: 'Initializing'}}))
      const connected = await this.setAccountAndChainId(this.getProvider())
      if(connected){
        this.addEvents(this.getProvider())
        setState((state)=>({w3Provider: this.getProvider()}))
      }else{
        window?.localStorage.removeItem(KEY_WALLET)
      }
      setState((state)=> ({wait: {state: false, reason: ''}}))
    }
    this.ready = true
  }
}