import { useSyncExternalStore } from 'react'
import { web3Store, connectW3, disconnectW3 } from 'w3evm'

export function useConnect(){
  const wallets = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.wallets,cb),()=>web3Store.getState().wallets,()=>web3Store.getState().wallets)
  const wait = useSyncExternalStore((cb)=>web3Store.subscribe((state: any)=> state.wait,cb),()=>web3Store.getState().wait,()=>web3Store.getState().wait)
  return { wallets, connectW3, disconnectW3, wait }
}