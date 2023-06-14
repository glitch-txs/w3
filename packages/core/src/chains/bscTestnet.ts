import { Chain } from "../types";

export const bscTestnet: Chain = {
  chainName: 'Binance Smart Chain Testnet',
  chainId:'0x61',
  nativeCurrency:{
    name: 'BNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls:['https://data-seed-prebsc-1-s1.binance.org:8545'],
  blockExplorerUrls:['https://testnet.bscscan.com'],
  iconUrls:['']
}