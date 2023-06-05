import { URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class Phantom extends Connector {
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL

  constructor(){
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

    super(getProvider)

    this.name = 'Phantom'
    this.install = 'https://phantom.app/'
    this.deeplink = `https://phantom.app/ul/browse/${isWindow()}`
  }
}