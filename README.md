# EVM Wallet Connector Library (BETA)

install

```sh
pnpm i @glitch-txs/w3 @glitch-txs/w3-hooks
```

install devDeps to use the WalletConnect connector
```sh
pnpm i @web3modal/standalone @walletconnect/ethereum-provider
```

1. Init w3 setting the connectors and supported chains
```tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { connectors, mainnet, w3init } from '@glitch-txs/w3'

w3init({connectors, chains:[mainnet]})

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

2. Import the `connect` function and choose as arg a connector's name as string, you'll get autocomplete:
```tsx
import { connect } from '@glitch-txs/w3'

export default function Connect() {
  
  return (
    <div>
      <button onClick={()=>connect('MetaMask')} >MetaMask</button>
    </div>
  )
}
```
For disconnecting you can use the `switchWallet` function.

3. Add hooks!
```tsx
import { connect } from '@glitch-txs/w3'
import { useAccount, useChain } from '@glitch-txs/w3-hooks'

export default function Connect() {
  const { account, isLoading } = useAccount()
  const { chain } = useChain()
  
  return (
    <div>
      <button disable={isLoading} onClick={()=>connect('MetaMask')} >MetaMask</button>
      user Account: {account}
      ChainId: {chain}
    </div>
  )
}
```

4. wrap it with ether.js, viem or web3.js!
```tsx
import { ethers } from 'ethers'
import { useProvider } from '@glitch-txs/w3-hooks'

export default function InteractWithContracts() {
  const { childProvider } = useProvider()

  const provider = useMemo(()=> new ethers.providers.Web3Provider(childProvider),[childProvider])
  
  return (
    <div>
      You can also wrap the childProvider to create your own hook!
    </div>
  )
}
```

## Current supported connectors:
1. MetaMask
2. Coinbase
3. WalletConnect
4. Trust Wallet

### You can create your own connectors and chains!

```ts
type Connector = {
  walletName: string
  deeplink?:`https://${string}`
  install?:`https://${string}`
  getProvider:()=> Promise<EIP1193Provider> | EIP1193Provider
}

type Chain = {
  chainId:`0x${string}`
  chainName:string
  nativeCurrency?:{
    name:string
    symbol:string
    decimals:number
  }
  rpcUrls: string[]
  blockExplorerUrls?:string[]
  iconUrls?:string[]
}
```
