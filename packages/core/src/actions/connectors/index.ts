import { Coinbase } from "./coinbase"
import { MetaMask } from "./metamask"
import { Phantom } from "./phantom"
import { TrustWallet } from "./trustwallet"
import { WalletConnect } from "./walletconnect"

const allConnectors=()=>[
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
  allConnectors
}

declare global{
  interface Window {
    trustwallet?: any
    phantom?: any
  }
}