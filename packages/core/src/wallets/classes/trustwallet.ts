// @ts-nocheck – ignore @coinbase/wallet-sdk window.ethereum.
import { EIP1193Provider, URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { BaseWallet } from "./base"

export class TrustWallet extends BaseWallet {
  readonly id: string
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined

  constructor({icon}:{icon?: any} = {}){
    const getProvider = ()=>{
      if (typeof window === 'undefined') return

      const isTrustWallet = (ethereum: EIP1193Provider)=>!!ethereum?.isTrust

      if (isTrustWallet(window.ethereum))
      return window.ethereum
    
      if (window.ethereum?.providers)
      return window.ethereum.providers.find(isTrustWallet) ?? null

      return window["trustwallet"] ?? null
    }

    super()

    this.id = "trustwallet"
    this.name = 'Trust Wallet'
    this.icon = icon
    this.install = 'https://trustwallet.com/browser-extension/'
    this.deeplink = `https://link.trustwallet.com/open_url?coin_id=60&url=${isWindow()}`
    this.getProvider = getProvider
  }
}