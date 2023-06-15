import { initEIP6963, web3Store } from "w3-evm"
import { KEY_WALLET } from "./utils/constants"
import { W3Props, ReturnW3Props } from "./types"

export async function createW3props({wallets, chains, onboard = true, EIP6963 = true, cache = false }: W3Props):Promise<ReturnW3Props>{
  web3Store.setState((state)=>({ onboard, chains, wallets }))
  // wallets are return to initialize after the DOM is painted
  if(typeof window === 'undefined' || !cache) return { EIP6963, cache, wallets }
  if(EIP6963) initEIP6963()
  const connectedWallet = window.localStorage.getItem(KEY_WALLET)
  if(!connectedWallet){
    web3Store.setState((state)=>({wait:{state: false, reason:'' }}))
    return { EIP6963, cache }
  }
  // injection delay - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1
  await new Promise(r => setTimeout(r, 100))
  for(let w of wallets)
  if(w.id === connectedWallet) w.init()
  
  return { EIP6963, cache }
}