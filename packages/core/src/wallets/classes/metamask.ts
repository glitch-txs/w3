// @ts-nocheck – ignore @coinbase/wallet-sdk window.ethereum.
import { EIP1193Provider, URL, WalletNames } from "../../types"
import { isWindow } from "../../utils/isWindow"
import { BaseWallet } from "./base"

export class MetaMask extends BaseWallet {
  readonly id: string
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined

  constructor({icon}:{icon?: any} | undefined = {}){
    //@ts-ignore coinbase SDK overrides window.ethereum type to unknown
    const getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider = ()=>{
      if (typeof window === 'undefined') return
      //Check it's not coinbase wallet provider:
      let provider = window.ethereum;
      // edge case if MM and CBW are both installed
      if (window.ethereum?.providers?.length) {
        window.ethereum.providers.forEach(async (p: any) => {
          if (p.isMetaMask) provider = p;
        });
      }
      return provider
    }

    super()

    this.id = "metamask"
    this.name = 'MetaMask'
    this.icon = icon
    this.install = 'https://metamask.io/download/'
    this.deeplink =`https://metamask.app.link/dapp/${isWindow()}`
    this.getProvider = getProvider
  }
}