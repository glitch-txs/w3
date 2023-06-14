import { Chain } from "../types";

export const arbitrumGoerli: Chain = {
  chainName: 'Arbitrum Goerli',
  chainId:'0x66EED',
  nativeCurrency:{
    name: 'Arbitrum Goerli Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://goerli-rollup.arbitrum.io/rpc'],
  blockExplorerUrls:['https://goerli.arbiscan.io/'],
  iconUrls:['']
}