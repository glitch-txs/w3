import { BaseWallet, Chain } from "w3-evm"

export type W3Props = {
  wallets: BaseWallet[]
  chains: Chain[]
  EIP6963?: boolean
  onboard?: boolean
  cache?: boolean
}

export type ReturnW3Props = { EIP6963: boolean, cache: boolean, wallets?: BaseWallet[] }