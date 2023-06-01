import { Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";

export const metamask: Connector = {
  walletName: 'MetaMask',
  deeplink:`https://metamask.app.link/dapp/${isWindow()}`,
  install:'https://metamask.io/download/',
  getProvider: ()=>{
    if(window?.ethereum){
  
      //Check it's not coinbase wallet provider:
      let provider = window.ethereum;
      // edge case if MM and CBW are both installed
      if ((window.ethereum as any).providers?.length) {
        (window.ethereum as any).providers.forEach(async (p: any) => {
          if (p.isMetaMask) provider = p;
        });
      }
      
      return provider
    }
  }
}