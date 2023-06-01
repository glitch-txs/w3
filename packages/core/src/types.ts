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

export type WalletNames = 'Coinbase' | 'MetaMask' | 'Phantom' | 'Trust Wallet' | 'WalletConnect'

export type Connector = {
  walletName: WalletNames
  deeplink?:`https://${string}`
  install?:`https://${string}`
  getProvider:()=> Promise<any> | any
}