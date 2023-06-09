import { web3Store } from "../../store/web3store"
import { URL, WalletNames } from "../../types"
import { KEY_WALLET } from "../../utils/constants"
import { isWindow } from "../../utils/isWindow"
import { Connector } from "./base"

export class Coinbase extends Connector {
  readonly name: WalletNames
  readonly install: URL
  readonly deeplink: URL
  readonly icon?: any
  protected getProvider: any

  constructor(){
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

    this.name = 'Coinbase'
    this.install = 'https://www.coinbase.com/wallet/downloads'
    this.deeplink = `https://go.cb-w.com/dapp?cb_url=${isWindow()}`
    this.getProvider = getProvider
  }

  async disconnect(): Promise<void> {
    web3Store.setState((state)=>({isLoading: true}))
    const provider = await this.getProvider()
    //@ts-ignore coinbase provider adds disconnect function
    await provider?.disconnect()
    window?.localStorage.removeItem(KEY_WALLET)
    web3Store.setState((state)=>({ userAccount: '', chainId: null, childProvider: null, isLoading:false }))
  }
}