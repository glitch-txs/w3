import { Chain } from "../types";

export const bronosTestnet: Chain = {
  chainName: 'Bronos Testnet',
  chainId:'0x40E',
  nativeCurrency:{
    name: 'Bronos Coin',
    symbol: 'tBRO',
    decimals: 18,
  },
  rpcUrls:['https://evm-testnet.bronos.org'],
  blockExplorerUrls:['https://tbroscan.bronos.org'],
  iconUrls:['']
}