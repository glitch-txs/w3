import { EIP1193Provider, WalletNames } from "../../../types";
import { web3Store } from "../../../store/web3store";
import { DEBUG } from "../../../utils/constants";

export async function setAccountAndChainId(provider: EIP1193Provider, name: WalletNames){

  const { setState } = web3Store

  let connected: boolean = false

  await provider.request({ method: 'eth_accounts' })
  .then(async (accounts: `0x${string}`[])=>{
    if(accounts?.length > 0){

      setState((state)=>({ userAccount: accounts[0] as `0x${string}`}))
      DEBUG && console.log(`${name}: user is connected as: ${accounts[0]}`)

      await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
        setState((state)=>({ chainId: Number(chainId) }))
        DEBUG && console.log(`${name}: chain id - ${chainId}`)
      }).catch(console.error)
  
      connected = true

    }else{
      //is clearing needed here?
      setState((state)=>({ userAccount: ''}))
      DEBUG && console.log(`${name}: user is not connected`)
    }

  }).catch(console.error)

  return connected
}