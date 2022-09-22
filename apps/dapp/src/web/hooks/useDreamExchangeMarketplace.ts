import { DREAM_EXCHANGE_MARKETPLACE } from '@constants/addresses';
import { useImmer } from '@hooks/useImmer';
import { messageAtom } from '@states/message';
import { inputTokenAmount } from '@utils/pipe';
import { useWeb3React } from '@web3-react/core';
import { useImmerAtom } from 'jotai/immer';
import { useCallback, useEffect, useState } from 'react';
import { useDreamExchangeMarketplaceContract, useDreamOrderQueryContract } from './useContract';

export type DreamExchangeOrderInfo = {
  orderId: string;
  voucherIn: string;
  voucherInSlot: string;
  tokenOutName: string;
  tokenOutChain: string;
  tokenOutAddress: string;
  exchangeRate: string;
  exchangeRateDecimals: string;
  maker: string;
  recycler: string;
  orderType: string;
  isValid: boolean;
};

export function useDreamExchangeMarketplace() {
  const dreamOrderQuery = useDreamOrderQueryContract();
  const { isActive, account, chainId } = useWeb3React();

  const [dreamExchangeOrderData, setDreamExchangeOrderData] = useImmer<{
    loadFinished: boolean;
    list: DreamExchangeOrderInfo[];
  }>({
    loadFinished: false,
    list: [],
  });

  const getDreamExchangeOrders = useCallback(
    async (isLoading = true) => {
      if (!chainId) {
        return [];
      }
      try {
        setDreamExchangeOrderData(draft => {
          draft.loadFinished = !isLoading;
        });

        const res: { orderId: number; order: DreamExchangeOrderInfo }[] =
          await dreamOrderQuery?.queryExchangeOrders(DREAM_EXCHANGE_MARKETPLACE[chainId]);
        const listData: DreamExchangeOrderInfo[] = [];
        res &&
          res.forEach(item => {
            listData.push({
              orderId: item.orderId.toString(),
              voucherIn: item.order.voucherIn,
              voucherInSlot: item.order.voucherInSlot.toString(),
              tokenOutName: item.order.tokenOutName,
              tokenOutChain: item.order.tokenOutChain,
              tokenOutAddress: item.order.tokenOutAddress,
              exchangeRate: item.order.exchangeRate.toString(),
              exchangeRateDecimals: item.order.exchangeRateDecimals,
              maker: item.order.maker,
              recycler: item.order.recycler,
              orderType: item.order.orderType,
              isValid: item.order.isValid,
            });
          });
        setDreamExchangeOrderData(draft => {
          draft.loadFinished = true;
          draft.list = listData;
        });
        return listData || [];
      } catch (error) {
        console.log('[Tip] error ===> ', error);
        setDreamExchangeOrderData(draft => {
          draft.loadFinished = true;
        });
        return [];
      }
    },
    [chainId, setDreamExchangeOrderData, dreamOrderQuery]
  );

  useEffect(() => {
    if (isActive && account && chainId) {
      getDreamExchangeOrders();
    }
  }, [account, chainId, getDreamExchangeOrders, isActive]);

  return {
    dreamExchangeOrderData,
    getDreamExchangeOrders,
  };
}

export type DreamExchangeReacordInfo = {
  voucherId: string;
  voucherValue: string;
  deservedAmount: string;
  taker: string;
  receiverAddress: string;
  exchangeTime: string;
};

export function useDreamMarketplaceRecords(
  parentOrderId?: string,
  parentPage?: number,
  parentPageSize?: number
) {
  const dreamExchangeMarketplace = useDreamExchangeMarketplaceContract();
  const { isActive, account, chainId } = useWeb3React();

  const [dreamExchangeReacordsData, setDreamExchangeRecordsData] = useImmer<{
    loadFinished: boolean;
    list: DreamExchangeReacordInfo[];
  }>({
    loadFinished: false,
    list: [],
  }); // ing

  const getDreamExchangeRecrods = useCallback(
    async (orderId: string, page = 0, pageSize = 600, isLoading = true) => {
      if (!chainId || !orderId) {
        return [];
      }
      try {
        setDreamExchangeRecordsData(draft => {
          draft.loadFinished = !isLoading;
        });
        const res: DreamExchangeReacordInfo[] = await dreamExchangeMarketplace?.getExchangeRecords(
          orderId,
          page,
          pageSize
        );
        const listData: DreamExchangeReacordInfo[] = [];
        res &&
          res.forEach(item => {
            listData.push({
              voucherId: item.voucherId.toString(),
              voucherValue: item.voucherValue.toString(),
              deservedAmount: item.deservedAmount.toString(),
              taker: item.taker,
              receiverAddress: item.receiverAddress,
              exchangeTime: item.exchangeTime.toString(),
            });
          });
        setDreamExchangeRecordsData(draft => {
          draft.loadFinished = true;
          draft.list = listData;
        });
        return listData || [];
      } catch (error) {
        console.log('[Tip] error ===> ', error);
        setDreamExchangeRecordsData(draft => {
          draft.loadFinished = true;
        });
        return [];
      }
    },
    [chainId, setDreamExchangeRecordsData, dreamExchangeMarketplace]
  );

  useEffect(() => {
    if (isActive && account && chainId) {
      getDreamExchangeRecrods(parentOrderId || '', parentPage, parentPageSize);
    }
  }, [
    account,
    chainId,
    getDreamExchangeRecrods,
    isActive,
    parentOrderId,
    parentPage,
    parentPageSize,
  ]);

  return {
    dreamExchangeReacordsData,
    getDreamExchangeRecrods,
  };
}

export type DreamMarketplacePublishOrderParams = {
  voucherIn: string;
  voucherInSlot: string;
  tokenOutName: string;
  tokenOutChain: string;
  tokenOutAddress: string;
  exchangeRate: string;
  exchangeRateDecimals: string;
  recycler: string; // 兑换之后接收地址，burn: 0x0
  orderType: string; // 0: ERC20 1: ERC3525
};

export function useDreamMarketplacePublishOrder() {
  const dreamExchangeMarketplace = useDreamExchangeMarketplaceContract();
  const [txPending, setTxPending] = useState(false);
  const [, setMessageAtom] = useImmerAtom(messageAtom);

  const { isActive, account, chainId } = useWeb3React();

  const getSupportedChains = useCallback(async () => {
    const chainList: string[] = await dreamExchangeMarketplace?.getSupportedChains();
    return Array.from(new Set(chainList));
  }, [dreamExchangeMarketplace]);

  const onPublishOrder = useCallback(
    async (params: DreamMarketplacePublishOrderParams) => {
      if (!isActive || !account || !chainId) return;
      try {
        setTxPending(true);

        const txRes = await dreamExchangeMarketplace?.publishOrder(
          params.voucherIn,
          params.voucherInSlot,
          params.tokenOutName,
          params.tokenOutChain,
          params.tokenOutAddress,
          inputTokenAmount(params.exchangeRate, Number(params.exchangeRateDecimals)),
          params.exchangeRateDecimals,
          params.recycler,
          params.orderType
        );
        await txRes.wait();
        setTxPending(false);
        setMessageAtom(draft => {
          draft.show = true;
          draft.type = 'success';
          draft.message = 'Dream exchange order publish Success';
        });
      } catch (error: any) {
        console.log('[Tip] error ===> ', error);
        setTxPending(false);
        setMessageAtom(draft => {
          draft.show = true;
          draft.type =
            typeof error === 'object' && error.code && error.code === 4001 ? 'info' : 'error';
          draft.message =
            typeof error === 'object' && error.code && error.code === 4001
              ? 'User cancel'
              : 'Tx fail';
        });
      }
    },
    [account, chainId, dreamExchangeMarketplace, isActive, setMessageAtom]
  );

  return {
    txPending,
    getSupportedChains,
    onPublishOrder,
  };
}

export function useDreamMarketplaceCancelOrder() {
  const dreamExchangeMarketplace = useDreamExchangeMarketplaceContract();
  const [txPending, setTxPending] = useState(false);
  const [, setMessageAtom] = useImmerAtom(messageAtom);

  const { isActive, account, chainId } = useWeb3React();

  const onCancelOrder = useCallback(
    async (orderId: string) => {
      if (!isActive || !account || !chainId) return;
      try {
        setTxPending(true);

        const txRes = await dreamExchangeMarketplace?.cancelOrder(orderId);
        await txRes.wait();
        setTxPending(false);
        setMessageAtom(draft => {
          draft.show = true;
          draft.type = 'success';
          draft.message = 'Dream exchange order cancel Success';
        });
      } catch (error: any) {
        console.log('[Tip] error ===> ', error);
        setTxPending(false);
        setMessageAtom(draft => {
          draft.show = true;
          draft.type =
            typeof error === 'object' && error.code && error.code === 4001 ? 'info' : 'error';
          draft.message =
            typeof error === 'object' && error.code && error.code === 4001
              ? 'User cancel'
              : 'Tx fail';
        });
      }
    },
    [account, chainId, dreamExchangeMarketplace, isActive, setMessageAtom]
  );

  return {
    txPending,
    onCancelOrder,
  };
}
