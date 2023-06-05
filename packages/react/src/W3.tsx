import { useEffect } from 'react'
import { Chain, Connector, w3init } from '@glitch-txs/w3'

export function W3(props: { connectors: Connector[], chains: Chain[]}){

  useEffect(()=>{
    w3init(props)
  },[])

  return null
}
