import { Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";

export const metamask: Connector = {
  walletName: 'MetaMask',
  deeplink:`https://metamask.app.link/dapp/${isWindow()}`,
  install:'https://metamask.io/download/',
  getProvider: ()=>{
    if(window?.ethereum){
  

    }
  }
}