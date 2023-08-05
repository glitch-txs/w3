import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { W3, initW3, WindowEthereum, WalletConnect, subW3 } from 'w3-evm-react'
import { mainnet } from 'w3-evm'
import walletconnect from 'public/walletconnect.svg'
import wallet from 'public/wallet.png'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string

const w3props = initW3({
  connectors: [
    new WindowEthereum({ icon: wallet }), 
    new WalletConnect({ projectId, icon: walletconnect, showQrModal: true })
  ],
  chains:[mainnet],
  SSR: true,
})

// subW3.error(console.error)

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <W3 {...w3props} />
    <Component {...pageProps} />
  </>
}
