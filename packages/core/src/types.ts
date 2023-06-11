import { BaseWallet } from "./actions/classes/base"

export type URL = `https://${string}`

export type Address = `0x${string}`

export type W3Props = {
  wallets: BaseWallet[]
  chains: Chain[]
  EIP6963?: boolean
  onboard?: boolean
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

/*<--------EIP-6963-------->*/

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
}

/* Type EIP1193Provider is documented at EIP-1193 */
// export interface EIP1193Provider {
//   isStatus?: boolean;
//   host?: string;
//   path?: string;
//   sendAsync?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
//   send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
//   request: (request: { method: string, params?: Array<any> }) => Promise<any>
//   on: (event: string , listener: (event: any) => void)=>void
//   addListener: (event: string , listener: (event: any) => void)=>void
//   removeAllListeners:()=>void
//   removeListener:(event: string , listener: (event: any) => void)=>void
//   off:(event: string , listener: (event: any) => void)=>void
// }

export type EIP1193Provider = any

export type EIP6963AnnounceProviderEvent = {
  detail:{
    info: EIP6963ProviderInfo,
    provider: EIP1193Provider
  }
}