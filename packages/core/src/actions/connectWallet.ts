import { web3Store } from "../store/web3store";
import { checkAccountAndChainId } from "./helpers/checkAccountAndChain";
import { Connector, WalletNames } from "../types";
import { addEvents } from "./helpers/eventListeners";
import { isOnMobile } from "../utils/handleMobile";
import { DEBUG, LAST_WALLET } from "../utils/constants";

//True if user is on mobile
const mobile = isOnMobile()

export async function connect(selectedWallet: WalletNames): Promise<any>{

  const { getState, setState } = web3Store

  setState((state)=>({isLoading: true}))

  const connectorArr = getState().connectors.filter(c => c.walletName === selectedWallet)

  if(connectorArr.length === 0){
    setState((state)=>({isLoading: false}))
    throw Error(`Connector not found, add the ${selectedWallet} connector in the w3init function`)
  }
  const [{ getProvider, walletName, deeplink, install }] = connectorArr as [Connector]
  
  if(walletName === "WalletConnect"){
    if(getState().WCInitFailed){
      //If WCinit failed to load user will need to reload the website to connect
      setState((state)=>({ isProvider: false, isLoading: false }))
      return
    }
    const WCProvider = getProvider()

    await WCProvider?.connect().then(async(e: any)=> {
      const connected = await checkAccountAndChainId(WCProvider, walletName)
      if(connected) setState((state)=>({childProvider: WCProvider}))
    }).catch(console.error)
    setState((state)=>({isLoading: false}))
    return
  }
 //deleted code...
  setState((state)=>({isLoading: false}))
}