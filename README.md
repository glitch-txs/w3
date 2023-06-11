# W3 - EVM Wallet Connectors Library

[Read the Full Documentation](https://w3-docs.vercel.app/)

[Demo](https://glitch-txs-w3.vercel.app/)

# Getting Started

W3 is an evm wallet connectors library for Vanilla JS and React.js. <br/>
It sets up for you a wallet connection infrastructure with a built-in store and React hooks to handle the wallet state and user's sessions.

**Compatible with ethers.js, viem and web3.js**

### Install

npm
```bash
npm i @glitch-txs/w3-react
```
yarn
```bash
yarn add @glitch-txs/w3-react
```
pnpm
```bash
pnpm i @glitch-txs/w3-react
```

### Init the W3 Component

Select the connectors and chains you want to support. Calling `connectors` function will invoke all connectors.

```tsx
import { W3, connectors, mainnet, W3Props } from '@glitch-txs/w3-react'

const w3props: W3Props = {
  connectors: connectors(),
  chains:[mainnet]
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <W3 {...w3props} />
      <Component {...pageProps} />
    </>
  )
}
```

> With this type of config you need to set an enviroment variable for WalletConnect's project ID: `NEXT_PUBLIC_WALLETCONNECT_ID="yourProjectID"`. For others ways of configuration [see this link](https://w3-docs.vercel.app/docs/W3%20React/init)

### Connect to a Wallet

Import the `useConnect` hook and loop through the connectors:
```tsx
import { useConnect } from '@glitch-txs/w3-react'

export default function Connect() {

  const { connectors, connectW3, disconnectW3, isLoading } = useConnect()
  
  return (
    {<>
      connectors.map((wallet) =>
      (<button key={wallet.id} disabled={isLoading} onClick={()=>connectW3(wallet)}>
        {wallet.name}
      </button>)
    </>
    }
  )
}
```

You can also set a connection to a single wallet by using the wallet's name as argument of the `connectW3` function:

> You can also import `connectW3` and `disconnectW3` functions directly from the library

```tsx
import { connectW3 } from '@glitch-txs/w3-react'

export default function Connect() {
  return (
    <div>
      <button onClick={()=>connectW3('MetaMask')} >Connect to MetaMask</button>
    </div>
  )
}
```
For disconnecting you can use the `disconnectW3` function.

### Reactive Getters

Reactive Getters are similar to React hooks but will only return one value and you don't need to disctructure them. They are reactive, so your components **will** re-render whenever their value changes.
```tsx
import { getW3Chain, getW3Address, connectW3, disconnectW3 } from '@glitch-txs/w3-react'

export default function Connect() {
  
  const address = getW3Address()
  const chain = getW3Chain()
  const error = getW3Error()
  
  return (
    <div>
      {address ?
      <button onClick={disconnectW3} >Disconnect</button> :
      <button disable={isLoading} onClick={()=>connectW3('MetaMask')} >Connect to MetaMask</button>
      }
      Chain ID: {chain}
      <br/>
      {error.message}
    </div>
  )
}
```

### Use with with ethers.js, viem or web3.js
```tsx
import { BrowserProvider } from 'ethers'
import { getW3Provider } from '@glitch-txs/w3-react'

export default function useEthersProvider() {

  const w3Provider = getW3Provider()

  const provider = useMemo(()=>{
    if(w3Provider)
    return new BrowserProvider(w3Provider)
  },[w3Provider])
  
  return { provider }
}
```

### Current supported connectors
1. MetaMask
2. Coinbase
3. WalletConnect
4. Trust Wallet
5. Phantom (EVM)
6. EIP-6963 compatible wallets