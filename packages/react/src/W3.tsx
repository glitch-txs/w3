import { useEffect } from 'react'
import { Connector, initEIP6963, setW3, getW3 } from 'w3-evm'
import { KEY_WALLET } from './constants'

let init = 0

export function W3({ connectors }:{ connectors?: Connector[] }):null{

  useEffect(()=>{
    if(init === 0 && connectors){
      initEIP6963()
      for(let w of connectors) w.init()
      
      if(!localStorage.getItem(KEY_WALLET)){
        setW3.wait(undefined)
      }else{
        setTimeout(storedWalletExists, 600)
      }
    }

    // This component must be mounted only once in the whole application's lifecycle
    return ()=>{init = 1}
  },[])

  return null
}

export const storedWalletExists = ()=>{
  const selectedWallet = window.localStorage.getItem(KEY_WALLET)
  if(selectedWallet && !getW3.connectors().some(w=>w.id === selectedWallet)){
    window.localStorage.removeItem(KEY_WALLET), setW3.wait(undefined)

    throw Error(`${selectedWallet} session was saved on storage but the wallet was NOT found`)
  }
}