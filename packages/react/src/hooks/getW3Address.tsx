import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3'

export function getW3Address () {
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.address,cb),()=>web3Store.getState().address,()=>web3Store.getState().address)
}