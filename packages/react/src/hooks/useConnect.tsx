import { useSyncExternalStore } from 'react'
import { web3Store, connectW3, disconnectW3 } from '@glitch-txs/w3'

export function useConnect(){
  const connectors = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.connectors,cb),()=>web3Store.getState().connectors,()=>web3Store.getState().connectors)
  const isLoading = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.isLoading,cb),()=>web3Store.getState().isLoading,()=>web3Store.getState().isLoading)
  return { connectors, connectW3, disconnectW3, isLoading }
}