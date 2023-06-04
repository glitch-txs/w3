import { web3Store } from "../store/web3store"
import { Address, EIP1193Provider, URL, WalletNames } from "../types"
import { DEBUG, LAST_WALLET } from "../utils/constants"
import { isOnMobile } from "../utils/handleMobile"
import { addEvents, removeEvents } from "./helpers/eventListeners"
import { setAccountAndChainId } from "./helpers/setAccountAndChainId"

const mobile = isOnMobile()
  
export abstract class Connector{
  /** Connector name */
  abstract readonly name: WalletNames
  /** Whether connector is usable */
  protected ready: boolean
  /**Installation website */
  abstract readonly install?: URL
  /**Deeplink to open explorer on mobile */
  abstract readonly deeplink?: URL
  
  getProvider: Promise<EIP1193Provider> | EIP1193Provider
  
  constructor(getProvider: ()=> Promise<EIP1193Provider> | EIP1193Provider) {
    this.ready = false
    this.getProvider = getProvider
  }

  async init(){
    if(window?.localStorage.getItem(LAST_WALLET) === this.name){
      const { setState } = web3Store
      setState((state)=> ({isLoading: true}))
      const provider = await this.getProvider()
      const connected = await setAccountAndChainId(provider, this.name)
      if(connected){
        addEvents(provider, this.name)
        setState((state)=>({childProvider: provider}))
      }else{
        window?.localStorage.removeItem(LAST_WALLET)
      }
      setState((state)=> ({isLoading: false}))
    }
    this.ready = true
  }

  async connect(){
    const { setState, getState } = web3Store

    setState((state)=>({isLoading: true}))
    const provider = await this.getProvider()
    
    if(!provider){
      if(mobile && this.deeplink){
        //If user is on mobile and provider is not injected it will open the wallets browser.
        window.open(this.deeplink)
      }else{
        //If the wallet is not installed then it will open this link to install the extention.
        DEBUG && console.warn(`${this.name} provider is not injected`)
        window.open(this.install, '_blank')
      }
      setState((state)=>({isLoading: false}))
      return
    }

    await provider.request({ method: 'eth_requestAccounts' })
    .then(async(accounts: Address[])=> {
      window?.localStorage.setItem(LAST_WALLET, this.name)

      setState((state)=>({userAccount: accounts[0], childProvider: provider}))
      this.setChainId(provider)
      this.addEvents(provider)
  
      /** If the dapp supports more than one chain we won't ask the user to switch to a default one */
      const chains = getState().chains
      if(chains.length > 1){
        setState((state)=>({isLoading: false}))
        return
      }
  
      /**Request to switch to a default chain */
      if(getState().chainId !== Number(chains[0]?.chainId)){
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[0]?.chainId }],
        }).catch(async (er: any)=>{
          if(er.code === 4902 || er?.data?.originalError?.code == 4902){
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [chains[0]],
              })
              .catch((er: any)=>{
                console.error(`${this.name}: user rejected the add new chain request`, er)
              })
          }
        })
      } 
    })
    .catch((err: any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.error(`${this.name}: user rejected the connection request`);
      } else {
        console.error(`${this.name}: request connection error`,err);
      }
    });
  }

  disconnect(){
    const { getState, setState }  = web3Store
    this.removeEvents(getState().childProvider)
    window?.localStorage.removeItem(LAST_WALLET)
    setState({ userAccount: '', chainId: 0, childProvider: null })
  }

  protected async setAccountAndChainId(provider: EIP1193Provider){
    await setAccountAndChainId(provider, this.name)
  }

  protected async setChainId(provider: EIP1193Provider){
    
    const { setState } = web3Store

    await provider.request({ method: 'eth_chainId' }).then((chainId: any)=> {
      setState((state)=>({ chainId: Number(chainId) }))
      DEBUG && console.log(`${this.name}: chain id - ${chainId}`)
    }).catch(console.error)
  }

  protected addEvents(provider: EIP1193Provider){
    addEvents(provider, this.name)
  }

  protected removeEvents(provider: EIP1193Provider){
    removeEvents(provider, this.name)
  }
}