import { Chain } from "../types";

export const sepolia: Chain = {
  chainName: 'Sepolia',
  chainId:'0xAA36A7',
  nativeCurrency:{
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls:['https://rpc.sepolia.org'],
  blockExplorerUrls:['https://sepolia.etherscan.io'],
  iconUrls:['']
}