import { setAccountAndChainId } from "./setAccountAndChainId"
import { web3Store } from '../../store/web3store'
import { WalletNames } from "../../types"
import { filter_disconnect } from "../../utils/disconnect"
import { DEBUG, LAST_WALLET } from "../../utils/constants"

type ConnectInfo = {
  chainId: string
}

const onAccountChange = (accounts: `0x${string}`[], name: WalletNames, provider: any) => {

  if(typeof accounts[0] !== 'undefined'){
    web3Store.setState((state)=>({ userAccount: accounts[0] as `0x${string}`}))
    DEBUG && console.log(`${name}: user changed address to: `, accounts[0])
  }else{
    window?.localStorage.removeItem(LAST_WALLET)
    if(filter_disconnect(provider)){
      /* EVM Phantom wallet breaks when running restartWeb3 - infinite loop
      reason: eth_account method triggers accountChange listener */
      window?.location.reload()
      return
    }
    removeEvents(provider, name)
    web3Store.setState((state)=>({ userAccount: '', chainId: 0, childProvider: null }))

    DEBUG && console.log(`${name}: user has disconnect`)
  }
}

const onChainChange = (chainId: string, name: WalletNames) => {
  web3Store.setState((state)=>({ chainId: Number(chainId) }))
  DEBUG && console.log(`${name}: chain id - `, chainId)
}

const onConnect = (connectInfo: ConnectInfo, provider: any, name: WalletNames)=>{
  setAccountAndChainId(provider, name)
  web3Store.setState((state)=>({ isProvider: true }))
  DEBUG && console.log(`${name}: provider is connected in:`, connectInfo.chainId)
}

const onDisconnect = (err: any, name: WalletNames)=>{
  web3Store.setState((state)=>({ isProvider: false }))
  DEBUG && console.log(`${name}: the provider is desconnected from blockchain, refresh the dapp and check your internet connection`)
  console.error(err)
}

export const addEvents = (provider: any, name: WalletNames)=>{
  if(provider.on){
    provider.on("accountsChanged",(accounts: `0x${string}`[])=>onAccountChange(accounts, name, provider));
    provider.on("chainChanged",(chainId: string)=>onChainChange(chainId, name));
    provider.on('connect',(connectInfo: ConnectInfo)=>onConnect(connectInfo, provider, name));
    provider.on('disconnect',(err: any)=>onDisconnect(err, name));
  }else if (provider.addListener){
    //suggested by Trust Wallet
    provider.addListener("accountsChanged",(accounts: `0x${string}`[])=>onAccountChange(accounts, name, provider));
    provider.addListener("chainChanged",(chainId: string)=>onChainChange(chainId, name));
    provider.addListener('connect',(connectInfo: ConnectInfo)=>onConnect(connectInfo, provider, name));
    provider.addListener('disconnect',(err: any)=>onDisconnect(err, name));
  } else {
    console.error("Event Listeners couldn't initialize.")
  }
}

export const removeEvents = (provider: any, name: WalletNames)=>{
  
  provider.removeAllListeners?.()

  if(provider.removeListener){
    provider.removeListener("accountsChanged",(accounts: `0x${string}`[])=>onAccountChange(accounts, name, provider));
    provider.removeListener("chainChanged",(chainId: string)=>onChainChange(chainId, name));
    provider.removeListener('connect',(connectInfo: ConnectInfo)=>onConnect(connectInfo, provider, name));
    provider.removeListener('disconnect',(err: any)=>onDisconnect(err, name));
  }
  if(provider.off){
    provider.off("accountsChanged",(accounts: `0x${string}`[])=>onAccountChange(accounts, name, provider));
    provider.off("chainChanged",(chainId: string)=>onChainChange(chainId, name));
    provider.off('connect',(connectInfo: ConnectInfo)=>onConnect(connectInfo, provider, name));
    provider.off('disconnect',(err: any)=>onDisconnect(err, name));
  }
}