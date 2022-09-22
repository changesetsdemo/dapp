type AddressMap = { [chainId: number]: string };

export enum SupportedChainId {
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
}

export const ODID_ADDRESSES: AddressMap = {
  [SupportedChainId.ARBITRUM_RINKEBY]: '0x9B00B8Ed84b6816e364e3b8162C712fF944B1804',
};
