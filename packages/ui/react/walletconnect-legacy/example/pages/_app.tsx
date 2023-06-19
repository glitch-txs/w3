import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, mainnet, initW3, MetaMask, WalletConnect } from 'w3-evm-react'

const w3props = initW3({
  wallets:[],
  chains:[mainnet]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <W3 {...w3props} />
      <Component {...pageProps} />
    </>
  )
}