import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3/dist'

export function useProvider () {
  const childProvider = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.childProvider,cb),()=>web3Store.getState().childProvider,()=>web3Store.getState().childProvider)
  const isConnected = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.isProvider,cb),()=>web3Store.getState().isProvider,()=>web3Store.getState().isProvider)
  return { childProvider, isConnected }
}