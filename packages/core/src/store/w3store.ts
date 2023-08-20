import { createStore } from 'vanilla-cafe'
import { Chain, Connector, Provider, ProviderRpcError } from '../types'

interface W3Store {
  /**
   * WalletConnect URI
   */
  uri: string
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
  chains: Chain[] | number[]
  /**
   * ProviderRpcError: object with an error message and its code.
   */
  error?: ProviderRpcError | Error
  /**
   * Array of connectors instances.
   */
  connectors: Connector[]
  /**
   * A public provider to interact directly with the blockchain.
   */
  clientProvider?: unknown
  /**
   * extended EIP-1193 provider of the connected wallet.
   */
  walletProvider?: Provider
}

export const { set: setW3, sub: subW3, get: getW3 } = createStore<W3Store>({
  uri: '',
  wait:'Initializing',
  address: undefined,
  chainId: undefined,
  chains: [],
  error: undefined,
  connectors: [],
  walletProvider: undefined,
})