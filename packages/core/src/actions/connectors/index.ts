import { coinbase } from './coinbase'
import { metamask } from './metamask'
import { phantom } from './phantom'
import { trustwallet } from './trustwallet'
import { walletconnect } from './walletconnect'

const connectors = [
  coinbase,
  metamask,
  phantom,
  trustwallet,
  walletconnect
]

export {
  coinbase,
  metamask,
  phantom,
  trustwallet,
  connectors,
  walletconnect
}

declare global{
  interface Window {
    trustwallet?: any
    phantom?: any
  }
}