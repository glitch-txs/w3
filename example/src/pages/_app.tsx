import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, W3Props, createWallets, mainnet } from '@glitch-txs/w3-react'
import { walletIcons } from '../../utils/icons'

const w3props: W3Props = {
  wallets: createWallets(walletIcons),
  chains:[mainnet]
}

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <W3 {...w3props} />
    <Component {...pageProps} />
  </>
}
