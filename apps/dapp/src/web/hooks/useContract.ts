import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import { getContract } from '@utils/index';

import { KEY_TUBE_ADDRESSES, VOUCHER_QUERY } from '@constants/addresses';
import DreamVoucherABI from '../abi/DreamVoucher.json';
import DreamExchangeMarketplaceABI from '../abi/ExchangeMarketV2.json';
import DreamOrderQueryABI from '../abi/ExchangeMarketV2Query.json';
import KeyTubeABI from '../abi/KeyTube.json';
import VoucherQueryABI from '../abi/voucherQuery.json';
import { DREAM_EXCHANGE_MARKETPLACE, DREAM_ORDER_QUERY } from '../constants/addresses';

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T;
}

export function useKeyTubeContract() {
  return useContract(KEY_TUBE_ADDRESSES, KeyTubeABI);
}

export function useVoucherQueryContract() {
  return useContract(VOUCHER_QUERY, VoucherQueryABI);
}

export function useDreamOrderQueryContract() {
  return useContract(DREAM_ORDER_QUERY, DreamOrderQueryABI);
}

export function useDreamExchangeMarketplaceContract() {
  return useContract(DREAM_EXCHANGE_MARKETPLACE, DreamExchangeMarketplaceABI);
}

export function useDreamVoucherContract(voucherAddress: string) {
  return useContract(voucherAddress, DreamVoucherABI);
}
