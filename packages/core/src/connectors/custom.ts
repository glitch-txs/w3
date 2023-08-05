import { EIP1193Provider } from "../types";
import { WindowEthereum } from "./windowEthereum";

export type CustomOpts = {
  id?: string | number
  name: string
  icon?: any
  getProvider: ()=>Promise<EIP1193Provider> | EIP1193Provider | undefined
}

export class Custom extends WindowEthereum {
  readonly id: string
  readonly name: string
  icon: any

  constructor({ id, name, icon, getProvider }: CustomOpts){

    super()
    this.id = String(id) ?? 'custom'
    this.name = name
    this.icon = icon
    this.getProvider = getProvider
  }
}