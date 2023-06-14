import { useSyncExternalStore } from 'react'
import { web3Store } from 'w3-evm'

export function getW3Error(){
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.error,cb),()=>web3Store.getState().error,()=>web3Store.getState().error)
}