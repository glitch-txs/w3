import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3'

export function useConnectors(){
  const connectors = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.connectors,cb),()=>web3Store.getState().connectors,()=>web3Store.getState().connectors)
  return { connectors }
}