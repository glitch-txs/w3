import { BaseWallet, Chain } from "w3-evm"

export type W3Props = {
  wallets: BaseWallet[]
  chains: Chain[]
  EIP6963?: boolean
  onboard?: boolean
  hydration?: boolean
}

export type ReturnW3Props = {
  /**
   * Allow for EIP-6963 compatible wallets
   */
  EIP6963: boolean,
  /**
   * Prevent hydration errors on SSR applications
   */
  hydration: boolean,
  wallets?: BaseWallet[]
}