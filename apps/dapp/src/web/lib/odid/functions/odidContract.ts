import { Contract } from '@ethersproject/contracts';

import { getContract } from '@utils/index';

import { JsonRpcProvider } from '@ethersproject/providers/lib/json-rpc-provider';

import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import OdidABI from '../abi/Odid.json';
import { ODID_ADDRESSES } from '../constants/addresses';

export type OdidProvider = ExternalProvider | JsonRpcProvider | undefined;

export type ContractOptions = {
  chainId: number;
  account: string;
  provider?: OdidProvider;
};

// returns null on errors
export function odidContract(
  options: ContractOptions,
  withSignerIfPossible = true
): Contract | null {
  const { provider, account, chainId } = options;

  if (!provider || !chainId) return null;
  try {
    return getContract(
      ODID_ADDRESSES[chainId],
      OdidABI,
      provider as JsonRpcProvider,
      withSignerIfPossible && options.account ? account : undefined
    );
  } catch (error) {
    return null;
  }
}
