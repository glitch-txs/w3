import { initEIP6963, web3Store } from "w3-evm"
import { KEY_WALLET } from "./utils/constants"
import { W3Props, ReturnW3Props } from "./types"

export function createW3props({wallets, chains, onboard = true, EIP6963 = true, cache = false }: W3Props):ReturnW3Props{
  web3Store.setState((state)=>({ onboard, chains, wallets }))
  // wallets are return to initialize after the DOM is painted
  if(typeof window === 'undefined' || !cache) return { EIP6963, cache, wallets }

  if(EIP6963) initEIP6963()

  if(!window.localStorage.getItem(KEY_WALLET))
  web3Store.setState((state)=>({wait:{state: false, reason:'' }}))
  
  //even if they are not connected we set this.ready to true
  for(let w of wallets) w.init()
  
  return { EIP6963, cache }
}