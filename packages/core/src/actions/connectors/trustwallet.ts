import { Connector } from "../../types";
import { isWindow } from "../../utils/isWindow";

export const trustwallet: Connector = {
  walletName: 'Trust Wallet',
  deeplink:`https://link.trustwallet.com/open_url?coin_id=60&url=${isWindow()}`,
  install:'https://trustwallet.com/browser-extension/',
  getProvider: ()=>{
    const isTrustWallet = (ethereum: any) => {
      // Identify if Trust Wallet injected provider is present.
      const trustWallet = !!ethereum.isTrust;
  
      return trustWallet;
    };
  
    const injectedProviderExist = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  
    // No injected providers exist.
    if (!injectedProviderExist) {
      return null;
    }
  
    // Trust Wallet was injected into window.ethereum.
    if (isTrustWallet(window.ethereum)) {
      return window.ethereum;
    }
  
    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array.
    if ((window.ethereum as any)?.providers) {
      // ethereum.providers array is a non-standard way to
      // preserve multiple injected providers. Eventually, EIP-5749
      // will become a living standard and we will have to update this.
      return (window.ethereum as any).providers.find(isTrustWallet) ?? null;
    }
  
    // Trust Wallet injected provider is available in the global scope.
    // There are cases that some cases injected providers can replace window.ethereum
    // without updating the ethereum.providers array. To prevent issues where
    // the TW connector does not recognize the provider when TW extension is installed,
    // we begin our checks by relying on TW's global object.
    return window["trustwallet"] ?? null;
  }
}