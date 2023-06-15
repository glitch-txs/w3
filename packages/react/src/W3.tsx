import { useEffect } from 'react'
import { BaseWallet, initEIP6963, web3Store } from 'w3-evm'
import { KEY_WALLET } from './utils/constants'
import { storedWalletExists } from './utils/storedWalletExists'

let init = 0

export function W3({ EIP6963, hydration, wallets }:{ EIP6963: boolean, hydration: boolean, wallets?: BaseWallet[] }):null{
  useEffect(()=>{
    if(!hydration) return ()=>console.warn("the W3 component is not necessary when hydration is set to false")
    if(!wallets) throw Error("Wallets are missing in W3Props")
    if(init === 0){
      const selectedWallet = window.localStorage.getItem(KEY_WALLET)

      if(EIP6963) initEIP6963()
      
      for(let w of wallets) w.init()
      
      if(!selectedWallet)
      web3Store.setState((state)=>({wait:{state: false, reason:'' }}))
    
      //Throw error if stored wallet not found - we add time for EIP6963 wallets to load
      setTimeout(storedWalletExists, 600)
    }
    // This component must be mounted only once in the whole application's lifecycle
    return ()=>{init = 1}
  },[])

  return null
}