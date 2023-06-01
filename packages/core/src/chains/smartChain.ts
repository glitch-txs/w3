import { Chain } from "../types";

export const smartChain: Chain = {
  chainId:'0x38',
  chainName: 'Smart Chain',
  nativeCurrency:{
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls:['https://bsc-dataseed1.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com'],
  iconUrls: ['']
}