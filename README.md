# W3 - an EVM Wallet Connectors Library

**Compatible with Ethers.js, Viem and Web3.js**

install:

```sh
npm i @glitch-txs/w3 @glitch-txs/w3-hooks
```

install devDeps to use the WalletConnect connector:
```sh
npm i @web3modal/standalone @walletconnect/ethereum-provider
```

1. Init w3 with the connectors and supported chains
```tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { connectors, mainnet, w3init } from '@glitch-txs/w3'

w3init({
  connectors: connectors(),
  chains:[mainnet]
})

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

2. Import the `connect` function and choose a connector's name as arg, you'll get autocomplete:
```tsx
import { connectW3 } from '@glitch-txs/w3'

export default function Connect() {
  
  return (
    <div>
      <button onClick={()=>connectW3('MetaMask')} >MetaMask</button>
    </div>
  )
}
```
For disconnecting you can use the `switchWallet` function.

3. Add hooks!
```tsx
import { connectW3, disconnectW3 } from '@glitch-txs/w3'
import { useAccount, useChain } from '@glitch-txs/w3-hooks'

export default function Connect() {
  const { account, isLoading } = useAccount()
  const { chain } = useChain()
  
  return (
    <div>
      {account ?
      <button onClick={()=>disconnectW3()} >Disconnect</button> :
      <button disable={isLoading} onClick={()=>connectW3('MetaMask')} >MetaMask</button>
      }
      {
        account && 
        <span>
          user Account: {account}
          ChainId: {chain}
        </span>
      }
    </div>
  )
}
```

4. wrap it with ether.js, viem or web3.js!
```tsx
import { ethers } from 'ethers'
import { useProvider } from '@glitch-txs/w3-hooks'

export default function useEthersProvider() {
  const { childProvider } = useProvider()

  const provider = useMemo(()=>{
    if(childProvider)
    return new ethers.providers.Web3Provider(childProvider)
  },[childProvider])
  
  return { provider }
}
```

## Current supported connectors:
1. MetaMask
2. Coinbase
3. WalletConnect
4. Trust Wallet
5. Phantom (EVM)

### You can create your own connectors and chains!

```ts
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
