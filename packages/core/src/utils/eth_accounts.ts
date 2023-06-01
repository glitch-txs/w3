export function fitler_eth_accounts(provider: any){
  if(provider.isSelectingExtension === false) return true /**Phantom wallet when selected wallet is on "always ask" */
  if(provider.isEnkrypt) return true
  if(provider.isSlope) return true
  return false
}