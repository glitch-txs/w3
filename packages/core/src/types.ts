import { Connector } from "./actions/connectors/base"

export type URL = `https://${string}`

export type Address = `0x${string}`

export type Init = {
  connectors: Connector[]
  chains: Chain[]
}

export type Chain = {
  chainId:`0x${string}`
  chainName:string
  nativeCurrency?:{
    name:string
    symbol:string
    decimals:number
  }
  rpcUrls: string[]
  blockExplorerUrls?:string[]
  iconUrls?:string[]
}

export type WalletNames = 'Coinbase' | 'MetaMask' | 'Phantom' | 'Trust Wallet' | 'WalletConnect' | 'Injected'

export type EIP1193Provider = any