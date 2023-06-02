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

export type Connector<custom = 'Injected'> = {
  walletName: WalletNames | custom
  deeplink?:`https://${string}`
  install?:`https://${string}`
  getProvider:()=> Promise<any> | any
}