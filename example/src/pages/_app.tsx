import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, initW3, initWallets, mainnet } from 'w3-evm-react'
import { walletIcons } from '../../utils/icons'

const w3props = initW3({
  wallets: initWallets(walletIcons),
  chains:[mainnet]
})

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <W3 {...w3props} />
    <Component {...pageProps} />
  </>
}
