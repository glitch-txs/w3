import { useEffect } from 'react'
import { BaseWallet, initEIP6963 } from 'w3-evm'
import { KEY_WALLET } from './utils/constants'

let init = 0

export function W3({ EIP6963, cache, wallets }:{ EIP6963: boolean, cache: boolean, wallets?: BaseWallet[] }):null{
  useEffect(()=>{
    if(cache || !wallets) return
    if(init === 0){
      if(EIP6963) initEIP6963()
      const connectedWallet = window.localStorage.getItem(KEY_WALLET)
      if(!connectedWallet) return
      for(let w of wallets)
      if(w.id === connectedWallet) w.init()
    }
    // This component must be mounted only once in the whole application's lifecycle
    return ()=>{init = 1}
  },[])

  return null
}