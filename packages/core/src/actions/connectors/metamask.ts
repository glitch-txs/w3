import { URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class MetaMask extends Connector {
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL

  constructor(){
    const getProvider = ()=>{
      if (typeof window === 'undefined') return
      //Check it's not coinbase wallet provider:
      let provider = window.ethereum;
      // edge case if MM and CBW are both installed
      if ((window.ethereum as any).providers?.length) {
        (window.ethereum as any).providers.forEach(async (p: any) => {
          if (p.isMetaMask) provider = p;
        });
      }
      return provider
    }

    super(getProvider)

    this.name = 'MetaMask'
    this.install = 'https://metamask.io/download/'
    this.deeplink =`https://metamask.app.link/dapp/${isWindow()}`
    this.init()
  }
}