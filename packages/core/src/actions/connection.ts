import { web3Store } from "../store/web3store"
import { Init, WalletNames } from "../types"
import { KEY_WALLET } from "../utils/constants"
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

export function w3init({connectors, chains}: Init){
  web3Store.setState((state)=>({chains}))
  for(let c of connectors)
  c.init()
}