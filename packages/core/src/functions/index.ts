import { EIP6963Connector } from "../connectors/EIP6963"
import { setW3, getW3 } from "../store/w3store"
import { Chain, Connector, EIP6963AnnounceProviderEvent } from "../types"
import { KEY_WALLET } from "../constants"

/* Connect & Disconnect Functions */
export async function connectW3(connector: Connector): Promise<void>{
  await connector.connect()
}

export async function disconnectW3(){
  const connectors = getW3.connectors()
  const [connector] = connectors.filter(c => c.id === window?.localStorage.getItem(KEY_WALLET))
  
  if(connector) await connector.disconnect()
  else
  for(let c of connectors) c.disconnect()
}

/* EIP-6963 subscriber */
export function initEIP6963(){
  function onAnnouncement(event: EIP6963AnnounceProviderEvent){
    if(getW3.connectors().map(({ uuid }) => uuid).includes(event.detail.info.uuid)) return
    setW3.connectors([ new EIP6963Connector(event.detail), ...getW3.connectors() ])
  }
  window.addEventListener("eip6963:announceProvider", onAnnouncement);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  
  return ()=>window.removeEventListener("eip6963:announceProvider", onAnnouncement)
}

/* Init Function */
export function initW3({ connectors, chains, SSR }: {connectors: Connector[], chains: Chain[], SSR?: Boolean}){
  setW3.chains(chains), setW3.connectors(connectors)
  
  if(typeof window === 'undefined') return
  if(SSR) return { connectors }
  
  initEIP6963()
  for(let c of connectors) c.init()
  
  if(!localStorage.getItem(KEY_WALLET)){
    setW3.wait(undefined)
  }else{
    setTimeout(storedWalletExists, 1000)  
  }
}

export const storedWalletExists = ()=>{
  const selectedWallet = window.localStorage.getItem(KEY_WALLET)
  if(selectedWallet && !getW3.connectors().some(c=>c.id === selectedWallet)){
    window.localStorage.removeItem(KEY_WALLET), setW3.wait(undefined)

    throw Error(`${selectedWallet} session was saved on storage but the wallet was NOT found`)
  }
}