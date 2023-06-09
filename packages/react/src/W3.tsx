import { useEffect } from 'react'
import { Chain, Connector, w3init } from '@glitch-txs/w3'

let init = 0

export function W3(props: { connectors: Connector[], chains: Chain[]}){

  useEffect(()=>{
    if(init === 0) w3init(props)
    // This component must be mounted only once in the whole application lifecycle
    return ()=>{init = 1}
  },[])

  return null
}