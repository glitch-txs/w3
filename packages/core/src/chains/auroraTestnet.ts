import { Chain } from "../types";

export const auroraTestnet: Chain = {
  chainName: 'Aurora Testnet',
  chainId:'0x4E454153',
  nativeCurrency:{
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://testnet.aurora.dev'],
  blockExplorerUrls:['https://testnet.aurorascan.dev'],
  iconUrls:['']
}