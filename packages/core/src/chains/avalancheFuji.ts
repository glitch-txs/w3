import { Chain } from "../types";

export const avalancheFuji: Chain = {
  chainName: 'Avalanche Fuji',
  chainId:'0xA869',
  nativeCurrency:{
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls:['https://testnet.snowtrace.io'],
  iconUrls:['']
}