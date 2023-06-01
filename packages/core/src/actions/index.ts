import { web3Store } from "../store/web3store"
import { WalletNames } from "../types"
import { LAST_WALLET } from "../utils/storage"
import { connectWallet } from "./connectWallet"
import { removeEvents } from "./helpers/eventListeners"

export async function connect(walletName: WalletNames){
  
  const { getState, setState } = web3Store

  setState((state)=>({isLoading: true}))
  for (let connector of getState().connectors){
    if(connector.walletName === walletName){
      await connectWallet(connector)
      setState((state)=>({isLoading: false}))
      return
    }
  }
  throw Error(`Connector not found, add the ${walletName} connector in the w3init function`)
}

export async function switchWallet(){

  const { getState, setState } = web3Store
  
    //check if there's a session in Walletconnect
    if(getState().childProvider?.signer?.isWalletConnect && getState().childProvider.session){
      setState((state)=>({isLoading: true}))
      await getState().childProvider?.disconnect()
      setState({ userAccount: '', chainId: 0, childProvider: null })
      setState((state)=>({isLoading: false}))
    }else{
      removeEvents(getState().childProvider, window?.localStorage.getItem(LAST_WALLET) as WalletNames)
      window?.localStorage.removeItem(LAST_WALLET)
      setState({ userAccount: '', chainId: 0, childProvider: null })
    }
}