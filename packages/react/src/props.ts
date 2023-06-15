import { initEIP6963, web3Store } from "w3-evm"
import { KEY_WALLET } from "./utils/constants"
import { W3Props, ReturnW3Props } from "./types"
import { storedWalletExists } from "./utils/storedWalletExists"

export function initW3({wallets, chains, onboard = true, EIP6963 = true, hydration = true }: W3Props):ReturnW3Props{
  web3Store.setState((state)=>({ onboard, chains, wallets }))
  // wallets are return to initialize after the DOM is painted
  if(typeof window === 'undefined' || hydration) return { EIP6963, hydration, wallets }
  const selectedWallet = window.localStorage.getItem(KEY_WALLET)

  if(EIP6963) initEIP6963()
  
  //even if they are not connected we set this.ready to true
  for(let w of wallets) w.init()
  
  if(!selectedWallet)
  web3Store.setState((state)=>({wait:{state: false, reason:'' }}))

  //Throw error if stored wallet not found - we add time for EIP6963 wallets to load
  setTimeout(storedWalletExists, 600)
  
  return { EIP6963, hydration }
}