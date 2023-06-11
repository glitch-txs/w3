import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { Chain } from '../types'
import { BaseWallet } from '../actions/classes/base'

interface Web3Store {
  /*We need a time for the WC init to load
  also, some providers are injected after the app js runs meaning a little bit of delay is good for getting the wallet providers
  */
  wait: {
    state: boolean,
    reason: 'Initializing' | 'Connecting' | 'Disconnecting' | 'Loading' | ''
  }
  /**
   * False if WalletConnect init failed or if the wallet provider lost the connection with the blockchain node
   */
  isProvider: boolean
  /**Open installation website if wallet provider is not found */
  onboard: boolean
  address: string
  chainId: number | null
  chains: Chain[]
  error?: string
  wallets: BaseWallet[]
  w3provider: any
}

export const web3Store = createStore(subscribeWithSelector<Web3Store>((set, get) => ({
  wait: {
    state: true,
    reason: 'Initializing'
  },
  isProvider: true,
  onboard: true,
  address: '',
  chainId: null,
  error: undefined,
  chains: [],
  wallets: [],
  w3provider: null,
})))