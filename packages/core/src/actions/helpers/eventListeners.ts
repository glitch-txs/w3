import { checkAccountAndChainId } from "./checkAccountAndChain"
import { web3Store } from '../../store/web3store'
import { WalletNames } from "../../types"
import { filter_disconnect } from "../../utils/disconnect"
import { DEBUG, LAST_WALLET } from "../../utils/constants"

type ConnectInfo = {
  chainId: string
}

const handleAccount = (accounts: `0x${string}`[], walletName: WalletNames, provider: any) => {

  if(typeof accounts[0] !== 'undefined'){
    web3Store.setState((state)=>({ userAccount: accounts[0]}))
    DEBUG && console.log(`${walletName}: user changed address to: `, accounts[0])
  }else{
    if(filter_disconnect(provider)){
      /* EVM Phantom wallet breaks when running restartWeb3 - infinite loop
      reason: eth_account method triggers accountChange listener */
      window.location.reload()
      return
    }
    removeEvents(provider, walletName)
    if(typeof window != 'undefined' && window.localStorage.getItem(LAST_WALLET) === walletName)
    window.localStorage.removeItem(LAST_WALLET)
    //we set the WC provider as childProvider when restarting, so user can reconnect on WC
    web3Store.getState().restartWeb3()

    DEBUG && console.log(`${walletName}: user has disconnect`)
  }
}

const handleChain = (chainId: string, walletName: WalletNames) => {
  web3Store.setState((state)=>({ chainId: Number(chainId) }))
  DEBUG && console.log(`${walletName}: chain id - `, chainId)
}

const handleConnect = (connectInfo: ConnectInfo, provider: any, walletName: WalletNames)=>{
  checkAccountAndChainId(provider, walletName)
  web3Store.setState((state)=>({ isProvider: true }))
  DEBUG && console.log(`${walletName}: provider is connected in:`, connectInfo.chainId)
}

const handleDisconnect = (err: any, walletName: WalletNames)=>{
  web3Store.setState((state)=>({ isProvider: false }))
  DEBUG && console.log(`${walletName}: the provider is desconnected from blockchain, refresh the dapp and check your internet connection`)
  console.error(err)
}

export const addEvents = (provider: any, walletName: WalletNames)=>{
  if(provider.on){
    provider.on("accountsChanged",(accounts: `0x${string}`[])=>handleAccount(accounts, walletName, provider));
    provider.on("chainChanged",(chainId: string)=>handleChain(chainId, walletName));
    provider.on('connect',(connectInfo: ConnectInfo)=>handleConnect(connectInfo, provider, walletName));
    provider.on('disconnect',(err: any)=>handleDisconnect(err, walletName));
  }else if (provider.addListener){
    //suggested by Trust Wallet
    provider.addListener("accountsChanged",(accounts: `0x${string}`[])=>handleAccount(accounts, walletName, provider));
    provider.addListener("chainChanged",(chainId: string)=>handleChain(chainId, walletName));
    provider.addListener('connect',(connectInfo: ConnectInfo)=>handleConnect(connectInfo, provider, walletName));
    provider.addListener('disconnect',(err: any)=>handleDisconnect(err, walletName));
  } else {
    console.error("Event Listeners couldn't initialize.")
  }
}

export const removeEvents = (provider: any, walletName: WalletNames)=>{
  
  provider.removeAllListeners?.()

  if(provider.removeListener){
    provider.removeListener("accountsChanged",(accounts: `0x${string}`[])=>handleAccount(accounts, walletName, provider));
    provider.removeListener("chainChanged",(chainId: string)=>handleChain(chainId, walletName));
    provider.removeListener('connect',(connectInfo: ConnectInfo)=>handleConnect(connectInfo, provider, walletName));
    provider.removeListener('disconnect',(err: any)=>handleDisconnect(err, walletName));
  }
  if(provider.off){
    provider.off("accountsChanged",(accounts: `0x${string}`[])=>handleAccount(accounts, walletName, provider));
    provider.off("chainChanged",(chainId: string)=>handleChain(chainId, walletName));
    provider.off('connect',(connectInfo: ConnectInfo)=>handleConnect(connectInfo, provider, walletName));
    provider.off('disconnect',(err: any)=>handleDisconnect(err, walletName));
  }
}