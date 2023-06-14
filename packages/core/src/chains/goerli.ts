import { Chain } from "../types";

export const goerli: Chain = {
  chainName: 'Goerli',
  chainId:'0x5',
  nativeCurrency:{
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls:['https://rpc.ankr.com/eth_goerli'],
  blockExplorerUrls:['https://goerli.etherscan.io'],
  iconUrls:['']
}