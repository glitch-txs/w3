import { Chain } from "../types";

export const polygon: Chain = {
  chainName: 'Polygon',
  chainId:'0x89',
  nativeCurrency:{
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls:['https://polygon-rpc.com/'],
  blockExplorerUrls:['https://polygonscan.com/'],
  iconUrls:['']
}