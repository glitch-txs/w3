import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, mainnet, initW3 } from 'w3-evm-react'
import { W3UI, initModalWallets } from 'walletconnect-legacy-ui'

const w3props = initW3({
  wallets:initModalWallets(),
  chains:[mainnet]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <W3 {...w3props} />
      <W3UI/>
      <Component {...pageProps} />
    </>
  )
}