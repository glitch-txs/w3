import { Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";

export const phantom: Connector = {
  walletName: 'Phantom',
  deeplink:`https://phantom.app/ul/browse/${isWindow()}`,
  install:'https://phantom.app/',
  getProvider: ()=>{
    function getReady(ethereum?: any) {
      const isPhantom = !!ethereum?.isPhantom;
      if (!isPhantom) return;
      return ethereum;
    }

    if (typeof window === "undefined") return;
    const ethereum = window?.phantom?.ethereum as
      | any
      | undefined;
    if (ethereum?.providers) return ethereum.providers.find(getReady);
    return getReady(ethereum);
  },

}