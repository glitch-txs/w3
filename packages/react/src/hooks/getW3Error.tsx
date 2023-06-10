import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3'

export function getW3Error(){
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.error,cb),()=>web3Store.getState().error,()=>web3Store.getState().error)
}