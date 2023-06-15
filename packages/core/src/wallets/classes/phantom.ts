import { EIP1193Provider, URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { BaseWallet } from "./base"

export class Phantom extends BaseWallet {
  readonly id: string
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined

  constructor({icon}:{icon?: any} = {}){
    const getProvider = ()=>{
      function getReady(ethereum?: any) {
        const isPhantom = !!ethereum?.isPhantom
        if (!isPhantom) return
        return ethereum
      }
      if (typeof window === "undefined") return
      const ethereum = window?.phantom?.ethereum
      if (ethereum?.providers) return ethereum.providers.find(getReady)
      return getReady(ethereum)
    }

    super()

    this.id = "phantom"
    this.name = 'Phantom'
    this.icon = icon
    this.install = 'https://phantom.app/'
    this.deeplink = `https://phantom.app/ul/browse/${isWindow()}`
    this.getProvider = getProvider
  }
}