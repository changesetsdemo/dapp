import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

export const KEY_TUBE_ADDRESSES: AddressMap = {
  [SupportedChainId.ARBITRUM_RINKEBY]: '0xb62c65e731867AaB1e4A89A6e5570535eF407d3f',
};

export const VOUCHER_QUERY: AddressMap = {
  [SupportedChainId.RINKEBY]: '0xed297D8d80444d84049511B9C5dcA150d577B23b',
  [SupportedChainId.POLYGON]: '',
};

export const DREAM_EXCHANGE_MARKETPLACE: AddressMap = {
  [SupportedChainId.RINKEBY]: '0x8D66022196175Fe0b58A8970218df002F63e544e', // devnet: '0xef3211615D12ff1BB0424F16586BA8a13F91cc9F',
  [SupportedChainId.POLYGON]: '0x435088fc53fc1aeA18316F22716c740DA5F9053F',
};

export const DREAM_ORDER_QUERY: AddressMap = {
  [SupportedChainId.RINKEBY]: '0xA2f818825b2e1F392c6Be049CD0dE3076b83564F',
  [SupportedChainId.POLYGON]: '0x24180df923d3cc72910307AAEE3455a22D8ad98f',
};
