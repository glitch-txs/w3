import { URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class TrustWallet extends Connector {
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any

  constructor(){
    const getProvider = ()=>{
      if (typeof window === 'undefined') return

      const isTrustWallet = (ethereum: any)=>!!ethereum?.isTrust

      if (isTrustWallet(window.ethereum))
      return window.ethereum
    
      if ((window.ethereum as any)?.providers)
      return (window.ethereum as any).providers.find(isTrustWallet) ?? null

      return window["trustwallet"] ?? null
    }

    super(getProvider)

    this.name = 'Trust Wallet'
    this.install = 'https://trustwallet.com/browser-extension/'
    this.deeplink = `https://link.trustwallet.com/open_url?coin_id=60&url=${isWindow()}`
  }
}