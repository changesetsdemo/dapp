import { useImmer } from '@hooks/useImmer';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useDreamVoucherContract, useVoucherQueryContract } from './useContract';

export type DreamVoucherInfo = {
  slot: string;
  tokenId: string;
  units?: string;
  name: string;
  image: string;
  decimals?: number;
  voucherAddress: string;
};

export function base64Decode<T>(base64Str: string): T {
  let res = {};
  if (base64Str && base64Str.indexOf('data:application/json;base64,') > -1) {
    const uri = base64Str.split('data:application/json;base64,')[1];
    res = JSON.parse(ethers.utils.toUtf8String(ethers.utils.base64.decode(uri)));
  }
  return res as T;
}

const voucherList = ['0xbabB1b3163606431CeFB236BcEaB91c4dCf4dD39'];

export function useDreamVoucher() {
  const voucherQuery = useVoucherQueryContract();
  const { isActive, account } = useWeb3React();

  const [dreamVoucherData, setDreamVoucherData] = useImmer<{
    loadFinished: boolean;
    list: DreamVoucherInfo[];
  }>({
    loadFinished: false,
    list: [],
  }); // ing

  const getDreamVoucherReturn = useCallback(
    async (voucherAddress: string, isLoading = true) => {
      try {
        setDreamVoucherData(draft => {
          draft.loadFinished = !isLoading;
        });
        const res: { tokenURI: string; tokenId: number; units: number; slot: number }[] =
          await voucherQuery?.queryDreamVouchers({
            voucher: voucherAddress,
            owner: account,
          });
        const listData: DreamVoucherInfo[] = [];
        try {
          res &&
            res.forEach(item => {
              const info: DreamVoucherInfo = base64Decode(item.tokenURI);
              listData.push({
                tokenId: item.tokenId.toString(),
                slot: item.slot.toString(),
                units: item.units.toString(),
                name: info.name,
                image: info.image,
                decimals: 18,
                voucherAddress: voucherList[0],
              });
            });
        } catch (error) {
          console.log('[Tip] error ===> ', error);
        }
        setDreamVoucherData(draft => {
          draft.loadFinished = true;
          draft.list = listData;
        });
        return listData;
      } catch (error) {
        console.log('[Tip] error ===> ', error);
        return [];
      }
    },
    [account, setDreamVoucherData, voucherQuery]
  );

  const getDreamVoucher = useCallback(async () => {
    getDreamVoucherReturn(voucherList[0]);
  }, [getDreamVoucherReturn]);

  useEffect(() => {
    if (isActive && account) {
      getDreamVoucher();
    }
  }, [account, getDreamVoucher, isActive]);

  return {
    dreamVoucherData,
    getDreamVoucher,
  };
}

export function useDreamVoucherInfo(voucherAddress: string) {
  const dreamVoucherContract = useDreamVoucherContract(voucherAddress);

  const queryDreamVoucherInfo = useCallback(
    async (tokenId: string) => {
      const tokenURI = await dreamVoucherContract?.tokenURI(tokenId);
      const metadata: DreamVoucherInfo | undefined = tokenURI ? base64Decode(tokenURI) : undefined;
      console.log('[Tip] metadata ===> ', metadata);
      // if (metadata) {
      //   const info: DreamVoucherInfo = {
      //     slot: metadata.slot,
      //     tokenId: tokenId,
      //     name: metadata.name,
      //     image: metadata.image,
      //     voucherAddress: voucher,
      //   };
      // }
      return metadata;
    },
    [dreamVoucherContract]
  );

  return {
    queryDreamVoucherInfo,
  };
}

/**
 * const tokenURI = await this.tokenURI(tokenId);
    const metadata = tokenURI ? base64Decode(tokenURI) : {};
 */
