/**
 * Some wallets don't clean eth_accounts return method when user disconnects
 * @param provider ethereum provider
 * @returns true if matches
 */
export function filter_disconnect(provider: any){
  if(provider.isPhantom || provider.isSelectingExtension === false) return true
  if(provider.isTrust || provider.isTrustWallet) return true
  return false
}