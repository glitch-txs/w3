import { Chain } from "../types";

export const bearNetworkChainMainnet: Chain = {
  chainName: 'Bear Network Chain Mainnet',
  chainId:'0x9C8CE',
  nativeCurrency:{
    name: 'BearNetworkChain',
    symbol: 'BRNKC',
    decimals: 18,
  },
  rpcUrls:['https://brnkc-mainnet.bearnetwork.net'],
  blockExplorerUrls:['https://brnkscan.bearnetwork.net'],
  iconUrls:['']
}