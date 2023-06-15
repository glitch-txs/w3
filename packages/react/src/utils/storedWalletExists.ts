import { web3Store } from "w3-evm"
import { KEY_WALLET } from "./constants"

//if stored wallet is not found on wallets, we stop initialization
export const storedWalletExists = ()=>{
  const selectedWallet = window.localStorage.getItem(KEY_WALLET)
  if(selectedWallet && !web3Store.getState().wallets.some(w=>w.id === selectedWallet)){
    window.localStorage.removeItem(KEY_WALLET)
    web3Store.setState((state)=>({wait:{state: false, reason:'' }}))
    throw Error(`${selectedWallet} session was saved on storage but the wallet was NOT found`)
  }
}