import { useSyncExternalStore } from 'react'
import { web3Store } from 'w3-evm'

export function getW3Provider() {
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.w3Provider,cb),()=>web3Store.getState().w3Provider,()=>web3Store.getState().w3Provider)
}