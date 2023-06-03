import { useSyncExternalStore } from 'react'
import { web3Store } from '@glitch-txs/w3'

export function useAccount () {
  const account = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.userAccount,cb),()=>web3Store.getState().userAccount,()=>web3Store.getState().userAccount)
  const isLoading = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.isLoading,cb),()=>web3Store.getState().isLoading,()=>web3Store.getState().isLoading)
  return { account, isLoading }
}