export { getW3, setW3, subW3 } from './store/w3store'

export {
  Injected,
  WalletConnect,
  EIP6963Connector
} from './connectors'

export {
  connectW3,
  disconnectW3,
  initEIP6963,
  initW3,
  _storedWalletExists
} from './functions'

export * from './types'