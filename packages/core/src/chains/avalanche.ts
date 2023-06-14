import { Chain } from "../types";

export const avalanche: Chain = {
  chainName: 'Avalanche',
  chainId:'0xa86a',
  nativeCurrency:{
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls:['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls:['https://snowtrace.io/'],
  iconUrls:['']
}