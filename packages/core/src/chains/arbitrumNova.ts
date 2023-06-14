import { Chain } from "../types";

export const arbitrumNova: Chain = {
  chainName: 'Arbitrum Nova',
  chainId:'0xA4BA',
  nativeCurrency:{
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://nova.arbitrum.io/rpc'],
  blockExplorerUrls:['https://nova.arbiscan.io'],
  iconUrls:['']
}