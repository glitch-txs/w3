import { Chain } from "../types";

export const mainnet: Chain = {
  chainName: 'Ethereum Mainnet',
  chainId: '0x1',
  nativeCurrency:{
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://eth.llamarpc.com'],
  blockExplorerUrls:['https://etherscan.io/'],
  iconUrls:['']
}