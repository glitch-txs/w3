import { web3Store } from "../store/web3store";
import { checkAccountAndChainId } from "./helpers/checkAccountAndChain";
import { Connector } from "../types";
import { addEvents } from "./helpers/eventListeners";
import { isOnMobile } from "../utils/handleMobile";
import { LAST_WALLET } from "../utils/storage";

//True if user is on mobile
const mobile = isOnMobile()

export async function connectWallet({ getProvider, walletName, deeplink, install }: Connector): Promise<any>{

  const { getState, setState } = web3Store
  
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
    return
  }

  const provider = await getProvider()
  if(!provider){
    if(mobile && deeplink){
      //If user is on mobile and provider is not injected it will open the wallets browser.
      window.open(deeplink)
    }else{
      //If the wallet is not installed then it will open this link to install the extention.
      console.warn(`${walletName} provider is not injected`)
      window.open(install, '_blank')
    }
    return
  }

  await provider.request({ method: 'eth_requestAccounts' })
  .then(async()=> {
    window?.localStorage.setItem(LAST_WALLET, walletName)
    await checkAccountAndChainId(provider, walletName)
    setState((state)=>({childProvider: provider}))
    addEvents(provider, walletName)

    const chains = getState().chains
    if(chains.length > 1) return provider

    if(getState().chainId !== Number(chains[0].chainId)){
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chains[0].chainId }],
      }).catch(async (er: any)=>{
        if(er.code === 4902 || er?.data?.originalError?.code == 4902){
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [chains[0]],
            })
            .catch((er: any)=>{
              console.error(`${walletName}: user rejected the add new chain request`, er)
            })
        }
      })
    } 
  })
  .catch((err: any) => {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.error(`${walletName}: user rejected the connection request`);
    } else {
      console.error(`${walletName}: request connection error`,err);
    }
  });
}