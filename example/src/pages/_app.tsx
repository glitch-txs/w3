import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, W3Props, initWallets, mainnet } from 'w3evm-react'
import { walletIcons } from '../../utils/icons'

const w3props: W3Props = {
  wallets: initWallets(walletIcons),
  chains:[mainnet]
}

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <W3 {...w3props} />
    <Component {...pageProps} />
  </>
}
