import { useSyncExternalStore } from 'react'
import { web3Store } from 'w3evm'

export function getW3Chain () {
  return useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.chainId,cb),()=>web3Store.getState().chainId,()=>web3Store.getState().chainId)
}