export type URL = `https://${string}`

export type Address = `0x${string}`

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

/* Type EIP1193Provider is documented on EIP-1193 */
export interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
  send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
  request: (request: { method: string, params?: Array<any> }) => Promise<any>
  on: (event: string , listener: (event: any) => void)=>void
  addListener: (event: string , listener: (event: any) => void)=>void //from Trust Wallet
  removeAllListeners:()=>void
  removeListener:(event: string , listener: (event: any) => void)=>void
  off:(event: string , listener: (event: any) => void)=>void
  connect:()=> Promise<unknown> // WalletConnect
  disconnect: ()=> unknown // WalletConnect
  providers: EIP1193Provider[]
  [key: string]: boolean | undefined | EIP1193Provider[] | string | ((...args: any)=>any) //this type allows for extentions like isPhantom, isMetaMask, etc.
}

export type EIP6963AnnounceProviderEvent = {
  detail:{
    info: EIP6963ProviderInfo,
    provider: EIP1193Provider
  }
}