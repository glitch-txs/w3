// @ts-nocheck – ignore @coinbase/wallet-sdk window.ethereum.
import { EIP1193Provider } from "../../types"
import { Coinbase } from "./coinbase"
import { MetaMask } from "./metamask"
import { Phantom } from "./phantom"
import { TrustWallet } from "./trustwallet"
import { WalletConnect } from "./walletconnect"

const initWallets = ({ metamask, coinbase, trustwallet, walletconnect, phantom }:
  { metamask?: any, coinbase?: any, trustwallet?: any, walletconnect?: any, phantom?: any } = { })=>[
  new MetaMask({ icon: metamask }), 
  new Coinbase({ icon: coinbase }), 
  new TrustWallet({ icon: trustwallet }), 
  new WalletConnect({ icon: walletconnect }), 
  new Phantom({ icon: phantom })
]

export {
  Coinbase,
  MetaMask,
  Phantom,
  TrustWallet,
  WalletConnect,
  initWallets
}

export { Injected, InjectedOpts } from './injected'

declare global{
  interface Window {
    trustwallet?: EIP1193Provider
    phantom?: EIP1193Provider
    ethereum?: EIP1193Provider
  }
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}