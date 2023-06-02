import { web3Store } from "../../store/web3store";
import { Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";

export const coinbase: Connector = {
  walletName: 'Coinbase',
  deeplink:`https://go.cb-w.com/dapp?cb_url=${isWindow()}`,
  install:'https://www.coinbase.com/wallet/downloads',
  getProvider: async()=>{

    if(typeof window != 'undefined'){
      if (window.coinbaseWalletExtension){
        return window.coinbaseWalletExtension
      } else if ((window.ethereum as any)?.providers?.length) {
        // edge case if MM and CBW are both installed
        (window.ethereum as any).providers.forEach(async (p: any) => {
          if (p.isCoinbaseWallet) 
          return p;
        });
      } else if ((window.ethereum as any)?.isCoinbaseWallet){
        return window.ethereum;
      }else{
        const CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default
        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: document?.title,
          appLogoUrl: `${isWindow()}favicon.ico`,
          darkMode: false
        })
    
        const { getState } = web3Store
   
        return coinbaseWallet.makeWeb3Provider?.(getState().chains[0]?.rpcUrls[0], Number(getState().chains[0]?.chainId))
      }
    }
 
  }
}