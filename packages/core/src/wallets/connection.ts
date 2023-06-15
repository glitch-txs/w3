import { web3Store } from "../store/web3store"
import { EIP6963AnnounceProviderEvent } from "../types"
import { KEY_WALLET } from "../utils/constants"
import { EIP6963 } from "./classes/EIP6963"
import { BaseWallet } from "./classes/base"

export async function connectW3(wallet: BaseWallet): Promise<void>{
  await wallet.connect()
}

export function disconnectW3(){
  const [wallet] = web3Store.getState().wallets.filter(w => w.id === window?.localStorage.getItem(KEY_WALLET))
  
  if(wallet){
    wallet.disconnect()
  }else{
    for(let w of web3Store.getState().wallets)
    w.disconnect()
  }
}

export function initEIP6963(){
  function onAnnouncement(event: EIP6963AnnounceProviderEvent){
    if(web3Store.getState().wallets.map((c) => c.id).includes(event.detail.info.uuid)) return
    web3Store.setState((state)=>({ wallets: [ new EIP6963(event.detail), ...state.wallets ] }))
  }
  window.addEventListener("eip6963:announceProvider", onAnnouncement);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  
  return ()=>window.removeEventListener("eip6963:announceProvider", onAnnouncement)
}