import { Coinbase } from "./coinbase"
import { MetaMask } from "./metamask"
import { Phantom } from "./phantom"
import { TrustWallet } from "./trustwallet"
import { WalletConnect } from "./walletconnect"

const connectors=()=>[
  new MetaMask(), 
  new Coinbase(), 
  new TrustWallet(), 
  new WalletConnect(), 
  new Phantom()
]

export {
  Coinbase,
  MetaMask,
  Phantom,
  TrustWallet,
  WalletConnect,
  connectors
}

declare global{
  interface Window {
    trustwallet?: any
    phantom?: any
  }
}