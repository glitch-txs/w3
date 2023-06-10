import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3'

export function getW3Provider() {
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.childProvider,cb),()=>web3Store.getState().childProvider,()=>web3Store.getState().childProvider)
}