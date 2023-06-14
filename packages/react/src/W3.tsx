import { useEffect } from 'react'
import { Chain, BaseWallet, w3init } from 'w3-evm'

let init = 0

export function W3(props: { wallets: BaseWallet[], chains: Chain[]}){

  useEffect(()=>{
    if(init === 0) w3init(props)
    // This component must be mounted only once in the whole application lifecycle
    return ()=>{init = 1}
  },[])

  return null
}