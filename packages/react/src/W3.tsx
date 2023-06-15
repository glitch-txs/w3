import { useEffect } from 'react'
import { BaseWallet, initEIP6963, web3Store } from 'w3-evm'
import { KEY_WALLET } from './utils/constants'

let init = 0

export function W3({ EIP6963, cache, wallets }:{ EIP6963: boolean, cache: boolean, wallets?: BaseWallet[] }):null{
  useEffect(()=>{
    if(cache || !wallets) return
    if(init === 0){
      if(!window.localStorage.getItem(KEY_WALLET))
      web3Store.setState((state)=>({wait:{state: false, reason:'' }}))

      if(EIP6963) initEIP6963()
      
      for(let w of wallets) w.init()
    }
    // This component must be mounted only once in the whole application's lifecycle
    return ()=>{init = 1}
  },[])

  return null
}