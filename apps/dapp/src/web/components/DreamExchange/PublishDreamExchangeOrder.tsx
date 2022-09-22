import { AnButton } from '@components/Button';
import { AnInput } from '@components/Input';
import { AnList } from '@components/List';
import { AnItem } from '@components/List/Item';
import { AddressZero } from '@ethersproject/constants';
import {
  DreamMarketplacePublishOrderParams,
  useDreamMarketplacePublishOrder,
} from '@hooks/useDreamExchangeMarketplace';
import { useDreamVoucherInfo } from '@hooks/useDreamVoucher';
import { useImmer } from '@hooks/useImmer';
import { useEthERC20Data } from '@hooks/useMuiltChainERC20Data';
import { Trans } from '@lingui/react';
import { messageAtom } from '@states/message';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import { useImmerAtom } from 'jotai/immer';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

export function PublishDreamExchangeOrderComp() {
  const { isActive } = useWeb3React();
  const { txPending, onPublishOrder, getSupportedChains } = useDreamMarketplacePublishOrder();
  const [, setMessageAtom] = useImmerAtom(messageAtom);

  const [queryVoucher, setQueryVoucher] = useImmer<{
    voucherAddress: string;
    voucherId: string;
    queryLoading: boolean;
  }>({
    voucherAddress: '',
    voucherId: '',
    queryLoading: false,
  });
  const { queryDreamVoucherInfo } = useDreamVoucherInfo(queryVoucher.voucherAddress);

  const [publishForm, setPublishForm] = useImmer<DreamMarketplacePublishOrderParams>({
    voucherIn: '',
    voucherInSlot: '',
    tokenOutName: '',
    tokenOutChain: '',
    tokenOutAddress: '',
    exchangeRate: '',
    exchangeRateDecimals: '',
    recycler: '',
    orderType: '0',
  });
  const [supportChains, setSupportChains] = useState<string[]>([]);

  const querySupportedChains = useCallback(async () => {
    const list: string[] = await getSupportedChains();
    setSupportChains(list);
  }, [getSupportedChains]);

  const getDreamVoucherInfo = useCallback(async () => {
    if (!queryVoucher.voucherAddress || !queryVoucher.voucherId) return;
    setQueryVoucher(draft => {
      draft.queryLoading = true;
    });
    try {
      const voucherInfo = await queryDreamVoucherInfo(queryVoucher.voucherId);
      setPublishForm(draft => {
        draft.voucherIn = queryVoucher.voucherAddress;
        draft.voucherInSlot = voucherInfo?.slot || '';
      });
      setQueryVoucher(draft => {
        draft.queryLoading = false;
      });
    } catch (error) {
      setQueryVoucher(draft => {
        draft.queryLoading = false;
      });
      setMessageAtom(draft => {
        draft.show = true;
        draft.type = 'info';
        draft.message = 'No voucher';
      });
    }
  }, [
    queryDreamVoucherInfo,
    queryVoucher.voucherAddress,
    queryVoucher.voucherId,
    setPublishForm,
    setQueryVoucher,
    setMessageAtom,
  ]);

  const aloowSubmit = useMemo(() => {
    return publishForm.tokenOutName &&
      publishForm.tokenOutChain &&
      publishForm.tokenOutAddress &&
      publishForm.tokenOutName &&
      publishForm.exchangeRateDecimals &&
      publishForm.exchangeRate &&
      publishForm.orderType &&
      !txPending
      ? true
      : false;
  }, [
    publishForm.exchangeRate,
    publishForm.exchangeRateDecimals,
    publishForm.orderType,
    publishForm.tokenOutAddress,
    publishForm.tokenOutChain,
    publishForm.tokenOutName,
    txPending,
  ]);

  const { loadTokenInfo, getTokenInfo } = useEthERC20Data();

  const queryTokenInfo = useCallback(async () => {
    const res = await getTokenInfo(publishForm.tokenOutChain, publishForm.tokenOutAddress);
    setPublishForm(draft => {
      draft.tokenOutName = res.symbol;
      draft.exchangeRateDecimals = res.decimals;
    });
  }, [getTokenInfo, publishForm.tokenOutAddress, publishForm.tokenOutChain, setPublishForm]);

  useEffect(() => {
    if (isActive) {
      querySupportedChains();
      setPublishForm(draft => {
        draft.recycler = AddressZero;
      });
    }
  }, [getTokenInfo, isActive, querySupportedChains, setPublishForm]);

  return (
    <div className="w-[53%] pt-[4rem]">
      <AnList>
        <AnItem label={<Trans id="Dream Voucher"></Trans>}>
          <AnInput
            className="flex-1 mr-[1rem]"
            value={queryVoucher.voucherAddress}
            onChange={value => {
              setQueryVoucher(draft => {
                draft.voucherAddress = value;
              });
            }}
            placeholder="Voucher Address"
          ></AnInput>
          <AnInput
            value={queryVoucher.voucherId}
            onChange={value => {
              setQueryVoucher(draft => {
                draft.voucherId = value;
              });
            }}
            className="w-[10rem]"
            placeholder="Voucher ID"
          ></AnInput>
          <AnButton
            className="ml-[1rem]"
            disabled={
              queryVoucher.voucherAddress && queryVoucher.voucherId && !queryVoucher.queryLoading
                ? false
                : true
            }
            onClick={getDreamVoucherInfo}
          >
            {queryVoucher.queryLoading ? (
              <Trans id="Loading..."></Trans>
            ) : (
              <Trans id="Query Slot"></Trans>
            )}
          </AnButton>
        </AnItem>
        <AnItem>
          <AnInput
            full
            value={publishForm.voucherInSlot}
            onChange={value => {
              setPublishForm(draft => {
                draft.voucherInSlot = value;
              });
            }}
            placeholder={queryVoucher.queryLoading ? 'Loading...' : 'Voucher Slot'}
          ></AnInput>
        </AnItem>
        <AnItem label={<Trans id="Out Chain"></Trans>}>
          <div className="w-full grid grid-cols-6 gap-5">
            {supportChains.length === 0 ? (
              <>Loading...</>
            ) : (
              <>
                {supportChains.map((item, index) => (
                  <AnButton
                    key={item + index}
                    size="small"
                    onClick={() => {
                      setPublishForm(draft => {
                        draft.tokenOutChain = item;
                      });
                    }}
                    className={classNames({
                      'text-purple border-purple border-solid bg-purple-50':
                        publishForm.tokenOutChain === item,
                    })}
                  >
                    {item}
                  </AnButton>
                ))}
              </>
            )}
          </div>
        </AnItem>
        <AnItem label={<Trans id="Out Token Address"></Trans>}>
          <AnInput
            full
            value={publishForm.tokenOutAddress}
            onChange={value => {
              setPublishForm(draft => {
                draft.tokenOutAddress = value;
              });
            }}
            suffix={
              <>
                {publishForm.tokenOutChain && publishForm.tokenOutAddress && (
                  <AnButton
                    onClick={() => {
                      queryTokenInfo();
                    }}
                    size="small"
                    disabled={loadTokenInfo}
                  >
                    {loadTokenInfo ? <Trans id="Loading..."></Trans> : <Trans id="Qeury"></Trans>}
                  </AnButton>
                )}
              </>
            }
          ></AnInput>
        </AnItem>
        {publishForm.tokenOutChain && publishForm.tokenOutAddress && (
          <>
            <AnItem label={<Trans id="Out Token Symbol"></Trans>}>
              <AnInput
                full
                value={publishForm.tokenOutName}
                onChange={value => {
                  setPublishForm(draft => {
                    draft.tokenOutName = value;
                  });
                }}
                placeholder={loadTokenInfo ? 'Loading...' : ''}
              ></AnInput>
            </AnItem>
            <AnItem label={<Trans id="Out Token Decimals"></Trans>}>
              <AnInput
                full
                value={publishForm.exchangeRateDecimals}
                mode="integer"
                onChange={value => {
                  setPublishForm(draft => {
                    draft.exchangeRateDecimals = value;
                  });
                }}
                placeholder={loadTokenInfo ? 'Loading...' : ''}
              ></AnInput>
            </AnItem>
          </>
        )}
        <AnItem label={<Trans id="Exchange Rate"></Trans>}>
          <AnInput
            full
            value={publishForm.exchangeRate}
            mode="decimal"
            decimals={6}
            onChange={value => {
              setPublishForm(draft => {
                draft.exchangeRate = value;
              });
            }}
          ></AnInput>
        </AnItem>
        {/* <AnItem label={<Trans id="Rrder Type"></Trans>}>
          <AnInput
            full
            value={publishForm.orderType + ''}
            onChange={value => {
              setPublishForm(draft => {
                if (['0', '1'].includes(value)) {
                  draft.orderType = value;
                } else {
                  draft.orderType = '';
                }
              });
            }}
            placeholder="0: ERC20 | 1: ERC3525"
            suffix={
              <div>
                {!publishForm.orderType ? '' : publishForm.orderType === '0' ? 'ERC20' : 'ERC3525'}
              </div>
            }
          ></AnInput>
        </AnItem> */}
        <AnItem className="!mt-[4rem]">
          <AnButton
            full
            onClick={async () => {
              await onPublishOrder(publishForm);
              close?.();
            }}
            disabled={!aloowSubmit ? true : false}
          >
            <Trans id="Publish"></Trans>
          </AnButton>
        </AnItem>
      </AnList>
    </div>
  );
}

const PublishDreamExchangeOrderMemo = memo(PublishDreamExchangeOrderComp);

export function PublishDreamExchangeOrder() {
  return <PublishDreamExchangeOrderMemo />;
}
