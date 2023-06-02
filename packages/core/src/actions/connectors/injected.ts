import { Connector } from "../../types";

const injected: Connector = {
  walletName: 'Injected',
  getProvider: ()=>{
    if(typeof window != 'undefined') return window.ethereum
  }
}