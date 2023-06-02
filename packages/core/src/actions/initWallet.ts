import { web3Store } from "../store/web3store";
import { addEvents } from "./helpers/eventListeners";
import { Init } from "../types";
import { fitler_eth_accounts } from "../utils/eth_accounts";
import { checkAccountAndChainId } from "./helpers/checkAccountAndChain";
import { DEBUG, LAST_WALLET } from "../utils/constants";
import { WCInit } from "./connectors/walletconnect";


export const w3init = async({ connectors, chains }: Init)=>{

  if(typeof window == 'undefined') return

  const { setState } = web3Store

  setState((state)=>({isLoading: true, connectors, chains}))

  if(connectors.map(c => c.walletName).includes('WalletConnect')){
    const connected = await WCInit(chains)
    if(connected)
    return
  }else{
    // injection delay - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1
    await new Promise(r => setTimeout(r, 110))
  }

  const walletName = window.localStorage.getItem(LAST_WALLET)
  
  if(walletName){
    for (let connector of connectors){
      if(connector.walletName === walletName){
        const provider = await connector.getProvider()
        if(!provider) continue
        const connected = await checkAccountAndChainId(provider, walletName)    
        if(connected){
          setState({ childProvider: provider })
          addEvents(provider, connector.walletName)
          setState((state)=>({isLoading: false}))
          return
        }
      }
    }
  }

  for (let connector of connectors){
    if(connector.walletName === 'WalletConnect') continue
    const provider = await connector.getProvider()
    if(!provider){
      DEBUG && console.warn(`${connector.walletName} provider is not injected`)
      continue
    }
    if(fitler_eth_accounts(provider)) continue /**Some wallets trigger a connection request on eth_accounts method */

    const connected = await checkAccountAndChainId(provider, connector.walletName)
    if(connected){
      setState((state)=>({ childProvider: provider }))
      addEvents(provider, connector.walletName)
      setState((state)=>({isLoading: false}))
      return
    }
  }
  setState((state)=>({ isLoading: false }))
}