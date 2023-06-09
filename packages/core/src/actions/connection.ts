import { web3Store } from "../store/web3store"
import { EIP6963AnnounceProviderEvent, Init, WalletNames } from "../types"
import { KEY_WALLET } from "../utils/constants"
import { EIP6963 } from "./connectors/EIP6963"
import { Connector } from "./connectors/base"

export async function connectW3(selectedWallet: WalletNames | Connector): Promise<any>{

  if(typeof selectedWallet !== "string") return await selectedWallet.connect()

  const [connector] = web3Store.getState().connectors.filter(c => c.name === selectedWallet)

  if(!connector){
    web3Store.setState((state)=>({errorMessage: `${selectedWallet} connector not found!`}))
    throw Error(`Connector not found, add the ${selectedWallet} connector in the w3init function`)
  }

  return await connector.connect()
}

export function disconnectW3(){
  const [connector] = web3Store.getState().connectors.filter(c => c.name === window?.localStorage.getItem(KEY_WALLET))
  
  if(connector){
    connector.disconnect()
  }else{
    for(let c of web3Store.getState().connectors)
    c.disconnect()
  }
}

export async function w3init({connectors, chains, onboard = true, EIP6963 = true }: Init){
  if(typeof window === 'undefined') return
  if(EIP6963) initEIP6963()
  web3Store.setState((state)=>({ onboard, chains, connectors: [...state.connectors, ...connectors ] }))
  //EIP6963 is initialized inside the constructor
  for(let c of connectors)
  c.init()
}

function initEIP6963(){
  function onAnnouncement(event: EIP6963AnnounceProviderEvent){
    if(web3Store.getState().connectors.map((c) => c.name).includes(event.detail.info.name)) return
    web3Store.setState((state)=>({ connectors: [ new EIP6963(event.detail), ...state.connectors ] }))
  }
  window.addEventListener("eip6963:announceProvider", onAnnouncement);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  
  return ()=>window.removeEventListener("eip6963:announceProvider", onAnnouncement)
}