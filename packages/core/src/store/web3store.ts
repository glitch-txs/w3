import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { Chain, Connector } from '../types'
import { w3init } from '../actions/initWallet'

interface Web3Store {
  /*We need a time for the WC init to load
  also, some providers are injected after the app js runs meaning a little bit of delay is good for getting the wallet providers
  */
  isLoading: boolean
  /**
   * True if WalletConnect init failed or if the wallet provider lost the connection with the blockchain node
   */
  isProvider: boolean
  WCInitFailed: boolean
  userAccount: string
  chainId: number
  chains: Chain[]
  connectors: Connector[]
  childProvider: any
  WCProvider: any

  restartWeb3: ()=> void
}

export const web3Store = createStore(subscribeWithSelector<Web3Store>((set, get) => ({
  isLoading: true,
  isProvider: true,
  WCInitFailed: false,
  userAccount: '',
  chainId:0,
  chains: [],
  connectors: [],
  childProvider: null,
  WCProvider: null,

  restartWeb3:async()=>{
    set((state)=>({isLoading: true, userAccount: '', childProvider: null}))
    console.log("web3 state restarted")
    if(get().WCProvider?.session) await get().WCProvider.disconnect()
    w3init({ connectors: get().connectors, chains: get().chains })

    set((state)=>({isLoading: false}))
  }
})))