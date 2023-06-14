import { Chain } from "../types";

export const moonbeam: Chain = {
  chainName: 'Moonbeam',
  chainId: '0x504',
  nativeCurrency:{
    name: 'GLMR',
    symbol: 'GLMR',
    decimals: 18,
  },
  rpcUrls:['https://moonbeam.public.blastapi.io'],
  blockExplorerUrls:['https://moonscan.io'],
  iconUrls:['']
}