import { web3Store } from "../../store/web3store";
import { Chain, Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";
import { checkAccountAndChainId } from "../helpers/checkAccountAndChain";

export const walletconnect:Connector = {
  walletName: 'WalletConnect',
  getProvider:()=>web3Store.getState().WCProvider
}

export async function WCInit(chains: Chain[]){
  if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
    throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
  }
  const { getState, setState } = web3Store

  const { EthereumProvider, OPTIONAL_METHODS, OPTIONAL_EVENTS } = await import("@walletconnect/ethereum-provider")

  const provider = await EthereumProvider.init({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    chains: chains.map(chain => Number(chain.chainId)),
    showQrModal:true,
    optionalMethods:OPTIONAL_METHODS,
    optionalEvents:OPTIONAL_EVENTS,
    qrModalOptions:{
      themeMode: "light",
      themeVariables:{
        '--w3m-background-color': '#202020',
        '--w3m-accent-color': '#202020',
      }
    },
    metadata: {
      name: document?.title,
      description: document?.querySelector('meta[name="description"]')?.textContent ?? "",
      url: `${isWindow()}`,
      icons: [`${isWindow()}favicon.ico`],
    },
  }).catch(e=> {
    console.error("WC Init error: ", e)
    setState({WCInitFailed: true})
  });

  if(getState().WCInitFailed)
  return
  
  setState({WCProvider: provider})
  
  provider?.on("disconnect", () => {
    console.log("WC: session ended");
    getState().restartWeb3()
  });
  
  console.log('Walletconnect has initialized')
  
  if(provider?.session){
    const connected = await checkAccountAndChainId(provider, 'WalletConnect')
    if(connected) setState({childProvider: provider})
    return true
  }
}