# W3 - EVM Wallet Connectors Library

[Read the Full Documentation](https://w3-docs.vercel.app/)

[Demo](https://glitch-txs-w3.vercel.app/)

# Getting Started

W3 React is an evm wallet connectors library for React.js and its frameworks. <br/>
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
:::danger Take care

Make sure props are set outside the App component.

:::
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

:::tip NOTE

With this type of config you need to set an enviroment variable for WalletConnect's project ID: `NEXT_PUBLIC_WALLETCONNECT_ID="yourProjectID"`. For others ways of configuration see *add link*

:::

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