import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { connectors, mainnet } from '@glitch-txs/w3'
import { W3 } from '@glitch-txs/w3-hooks'

const w3props = {
  connectors: connectors(),
  chains:[mainnet]
}

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <W3 {...w3props} />
    <Component {...pageProps} />
  </>
}
