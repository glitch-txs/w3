import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { connectors, mainnet, w3init } from '@glitch-txs/w3/dist'

w3init({connectors, chains:[mainnet]})

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
