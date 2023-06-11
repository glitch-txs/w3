import { web3Store } from "../store/web3store"
import { EIP6963AnnounceProviderEvent, W3Props, WalletNames } from "../types"
import { KEY_WALLET } from "../utils/constants"
import { EIP6963 } from "./classes/EIP6963"
import { BaseWallet } from "./classes/base"

export async function connectW3(selectedWallet: WalletNames | BaseWallet): Promise<any>{

  if(typeof selectedWallet !== "string") return await selectedWallet.connect()

  const [wallet] = web3Store.getState().wallets.filter(w => w.name === selectedWallet)

  if(!wallet){
    throw Error(`Wallet instance not found: make sure the name ${selectedWallet} is properly spelled or that the wallet was included when initializing`)
  }

  return await wallet.connect()
}

export function disconnectW3(){
  const [wallet] = web3Store.getState().wallets.filter(w => w.name === window?.localStorage.getItem(KEY_WALLET))
  
  if(wallet){
    wallet.disconnect()
  }else{
    for(let w of web3Store.getState().wallets)
    w.disconnect()
  }
}

export async function w3init({wallets, chains, onboard = true, EIP6963 = true }: W3Props){
  if(typeof window === 'undefined') return
  if(!window.localStorage.getItem(KEY_WALLET)) web3Store.setState((state)=>({ wait:{state: false, reason:'' } })) 
  if(EIP6963) initEIP6963()
  web3Store.setState((state)=>({ onboard, chains, wallets: [...state.wallets, ...wallets ] }))
  //EIP6963 is initialized inside the constructor
  for(let w of wallets)
  w.init()
}

function initEIP6963(){
  function onAnnouncement(event: EIP6963AnnounceProviderEvent){
    if(web3Store.getState().wallets.map((c) => c.name).includes(event.detail.info.name)) return
    web3Store.setState((state)=>({ wallets: [ new EIP6963(event.detail), ...state.wallets ] }))
  }
  window.addEventListener("eip6963:announceProvider", onAnnouncement);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  
  return ()=>window.removeEventListener("eip6963:announceProvider", onAnnouncement)
}