import { Chain } from "../types";

export const aurora: Chain = {
  chainName: 'Aurora',
  chainId:'0x4E454152',
  nativeCurrency:{
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://mainnet.aurora.dev'],
  blockExplorerUrls:['https://aurorascan.dev'],
  iconUrls:['']
}