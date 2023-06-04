import { web3Store } from "../store/web3store"
import { WalletNames } from "../types"
import { KEY_WALLET } from "../utils/constants"
import { Connector } from "./connectors/base"
import { removeEvents } from "./connectors/helpers/eventListeners"

export async function connectW3(selectedWallet: WalletNames | Connector): Promise<any>{

  if(typeof selectedWallet !== "string") return await selectedWallet.connect()

  const connectorArr = web3Store.getState().connectors.filter(c => c.name === selectedWallet)

  if(connectorArr.length === 0){
    web3Store.setState((state)=>({errorMessage: `${selectedWallet} connector not found!`}))
    throw Error(`Connector not found, add the ${selectedWallet} connector in the w3init function`)
  }

  return await connectorArr[0]?.connect()
}

export async function disconnectW3(): Promise<any>{
  removeEvents(web3Store.getState().childProvider, window?.localStorage.getItem(KEY_WALLET) as WalletNames)
  window?.localStorage.removeItem(KEY_WALLET)
  web3Store.setState((state)=>({ userAccount: '', chainId: 0, childProvider: null }))
}