import { web3Store } from "../../store/w3store"
import { EIP1193Provider, URL, WalletNames } from "../../types"
import { KEY_WALLET } from "../../utils/constants"
import { isWindow } from "../../utils/isWindow"
import { BaseWallet } from "./base"

export class Coinbase extends BaseWallet {
  readonly id: string
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any
  getProvider:()=>Promise<EIP1193Provider> | EIP1193Provider | undefined

  constructor({icon}:{icon?: any} | undefined = {}){
    const getProvider = async()=>{
      if (typeof window === 'undefined') return

      let CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default
      if (
        typeof CoinbaseWalletSDK !== 'function' &&
        // @ts-expect-error This import error is not visible to TypeScript
        typeof CoinbaseWalletSDK.default === 'function'
      )
      CoinbaseWalletSDK = (
        CoinbaseWalletSDK as unknown as { default: typeof CoinbaseWalletSDK }
      ).default

      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: document?.title,
        appLogoUrl: `${isWindow()}favicon.ico`,
        darkMode: false
      })
      const { getState } = web3Store
 
      return coinbaseWallet.makeWeb3Provider?.(getState().chains[0]?.rpcUrls[0], Number(getState().chains[0]?.chainId))
    }
    
    super()

    this.id = "coinbase"
    this.name = 'Coinbase'
    this.icon = icon
    this.install = 'https://www.coinbase.com/wallet/downloads'
    this.deeplink = `https://go.cb-w.com/dapp?cb_url=${isWindow()}`
    // @ts-ignore Coinbase Provider follows EIP1193
    this.getProvider = getProvider
  }

  async disconnect(): Promise<void> {
    web3Store.setState((state)=>({ wait: { state: true, reason: 'Disconnecting' } }))
    const provider = await this.getProvider()
    //@ts-ignore coinbase provider adds disconnect function
    await provider?.disconnect()
    window?.localStorage.removeItem(KEY_WALLET)
    web3Store.setState((state)=>({ userAccount: '', chainId: null, childProvider: null, wait:{ state: false, reason: '' } }))
  }
}