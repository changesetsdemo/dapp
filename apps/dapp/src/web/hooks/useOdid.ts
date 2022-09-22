import { IPFS_URL } from '@constants/migsc';
import { useImmer } from '@hooks/useImmer';
import Odid from '@lib/odid';
import { BYTES_NULL } from '@lib/odid/constants/migsc';
import { useWeb3React } from '@web3-react/core';
import { BytesLike, ethers } from 'ethers';
import { useCallback, useEffect, useMemo } from 'react';

export function useOdid() {
  const { account, chainId, provider: library, isActive } = useWeb3React();
  const [odidData, setOdidData] = useImmer<{ odid: BytesLike; ipfsHash: string } | undefined>(
    undefined
  );

  const odidHelper = useMemo(() => {
    return isActive && account && chainId && library
      ? new Odid({
          chainId: Number(chainId),
          account: account || '',
        })
      : undefined;
  }, [account, chainId, isActive, library]);

  const getMemberAccount = useCallback(async () => {
    if (!odidHelper) return;
    const res = await odidHelper.getMemberAccount();
    setOdidData(() => res);
  }, [odidHelper, setOdidData]);

  useEffect(() => {
    if (isActive && account && chainId && library) {
      getMemberAccount();
    }
  }, [account, chainId, getMemberAccount, isActive, library]);

  if (odidData) {
    const odid = ethers.utils.toUtf8String(odidData?.odid);
    const ipfs = ethers.utils.toUtf8String(odidData?.ipfsHash);

    return {
      odid: odidData?.odid === BYTES_NULL ? undefined : odid + '' || undefined,
      figure: '',
      ipfs: odidData?.ipfsHash === BYTES_NULL ? '' : IPFS_URL + ipfs,
    };
  }
  return {
    odid: undefined,
    figure: '',
    ipfs: '',
  };
}
