import { web3Store } from '../../store/web3store'
import { WalletNames } from '../../types'
import { DEBUG } from '../../utils/constants'

//Check account and chain id and save them in the Zustand store:
export const checkAccountAndChainId = async(provider: any, wallet: WalletNames)=>{

  const { setState } = web3Store
  
  let connected: boolean = false

  await provider.request({ method: 'eth_accounts' })
  .then(async (accounts: `0x${string}`[])=>{
    if(accounts?.length > 0){

      setState((state)=>({ userAccount: accounts[0]}))
      DEBUG && console.log(`${wallet}: user is connected as: ${accounts[0]}`)

      await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
        setState((state)=>({ chainId: Number(chainId) }))
        DEBUG && console.log(`${wallet}: chain id - ${chainId}`)
      }).catch(console.error)
  
      connected = true

    }else{
      //is clearing needed here?
      setState((state)=>({ userAccount: ''}))
      DEBUG && console.log(`${wallet}: user is not connected`)
    }

  }).catch(console.error)

  return connected
}