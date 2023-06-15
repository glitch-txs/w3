import { EIP1193Provider, URL } from "../../types";
import { BaseWallet } from "./base";

export type InjectedOpts = {
  id?: string | number
  name?: string
  icon?: any
  getProvider?: ()=> any
  install?: URL
  deeplink?: URL
}

export class Injected extends BaseWallet {
  readonly id: string
  readonly name: string
  readonly install?: URL
  readonly deeplink?: URL
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined
  icon: any

  constructor({ id, name, icon, getProvider, install, deeplink }: InjectedOpts  = {}){

    super()
    this.id = String(id) ?? window.crypto.randomUUID()
    this.name = name ?? 'Injected'
    this.icon = icon
    this.getProvider = getProvider ?? (()=>window?.ethereum)
    this.install = install
    this.deeplink = deeplink
  }
}