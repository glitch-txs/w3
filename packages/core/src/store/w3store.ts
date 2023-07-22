import { Chain, EIP1193Provider } from '../types'
import { BaseWallet } from '../wallets/classes/base'
import { createStore } from 'vanilla-cafe'

interface W3Store {
  /**
   * Current connection state. Shows if there's an ongoing process.
   */
  wait?: 'Initializing' | 'Connecting' | 'Disconnecting' | 'Loading'
  /**
   * Connected wallet address, undefined if disconnected.
   */
  address?: string
  /**
   * Connected chain id.
   */
  chainId?: number
  /**
   * Array of supported chains.
   */
  chains: Chain[]
  /**
   * Each key represents the number-code of the error and its value must be a human-readable message.
   */
  errorSystem?: {
    [key: number]: string
  },
  /**
   * Human-readable error message. 
   * Triggered and populated when an error happens, if its corresponding number-code exists in the errorSystem object.
   */
  error?: string
  /**
   * Array of connectors instances.
   */
  wallets: BaseWallet[]
  /**
   * A public provider to interact directly with the blockchain.
   */
  clientProvider?: unknown
  /**
   * EIP-1193 provider of the connected wallet.
   */
  walletProvider?: EIP1193Provider
}

export const { set: setW3, sub: subW3, states } = createStore<W3Store>({
  wait:'Initializing',
  address: undefined,
  chainId: undefined,
  error: undefined,
  chains: [],
  wallets: []
})