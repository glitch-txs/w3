import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { getW3Address, getW3Chain, useConnect } from 'w3-evm-react'
import Image from 'next/image'


export default function Home() {
  
  const { wallets, wait, connectW3, disconnectW3 } = useConnect()

  const address = getW3Address()

  const chain = getW3Chain()
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          { address ? 
          <button className={styles.button} onClick={disconnectW3} >Disconnect</button> :
          wallets.map((wallet) =>
          <button
          key={wallet.id} 
          disabled={wait.state} 
          className={[styles.wallet, wait.state && styles.loading].join(' ')} 
          onClick={()=>connectW3(wallet)}>
            <span>
              <Image width={44} height={44} src={wallet.icon} alt='' />
            </span>
            {wallet.name}
          </button>
          )}
        </div>

        { wait.state ? `${wait.reason}...` : (address ? "Connected" : "Connect Your Wallet") }
        <br/>
        <br/>
        User: { address }
        <br/>
        <br/>
        Chain: {chain}
      </main>
    </>
  )
}
