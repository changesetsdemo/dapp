import { AnButton } from '@components/Button';
import { CopyHelper } from '@components/CopyHelper';
import { DreamExchangeRecords } from '@components/DreamExchange/DreamExchangeRecords';
import { AnInput } from '@components/Input';
import { AnColProps, AnTable } from '@components/Table';
import {
  DreamExchangeOrderInfo,
  useDreamExchangeMarketplace,
} from '@hooks/useDreamExchangeMarketplace';
import { useImmer } from '@hooks/useImmer';
import { Trans } from '@lingui/react';
import { addressFormat, compareSort } from '@utils/pipe';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDreamMarketplaceCancelOrder } from '../../hooks/useDreamExchangeMarketplace';

function CancelOrder({ row, onCall }: { row: DreamExchangeOrderInfo; onCall: () => void }) {
  const { txPending, onCancelOrder } = useDreamMarketplaceCancelOrder();
  return (
    <>
      <AnButton
        onClick={async () => {
          await onCancelOrder(row.orderId);
          onCall?.();
        }}
        size="small"
        className="ml-[1rem]"
        disabled={txPending}
      >
        {txPending ? <Trans id="Pending"></Trans> : <Trans id="Cancel"></Trans>}
      </AnButton>
    </>
  );
}

export function DreamExchangeOrdersComp() {
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [orderInfo, setOrderInfo] = useImmer<DreamExchangeOrderInfo | null>(null);
  const [filterData, setFilterData] = useImmer<{ maker: string; data: DreamExchangeOrderInfo[] }>({
    maker: '',
    data: [],
  });
  const { dreamExchangeOrderData, getDreamExchangeOrders } = useDreamExchangeMarketplace();

  const orderColumns: AnColProps<DreamExchangeOrderInfo>[] = [
    {
      key: 'orderId',
      label: <Trans id="Order Number"></Trans>,
      colNode: (row: DreamExchangeOrderInfo) => {
        return <>NO.{row.orderId}</>;
      },
    },
    {
      key: 'maker',
      label: <Trans id="Maker"></Trans>,
      colNode: (row: DreamExchangeOrderInfo) => {
        return (
          <>
            <div title={row.maker} className="cursor-pointer">
              <CopyHelper data={row.maker}>{addressFormat(row.maker)}</CopyHelper>
            </div>
          </>
        );
      },
    },
    {
      key: 'voucher',
      label: <Trans id="Voucher"></Trans>,
      colNode: (row: DreamExchangeOrderInfo) => {
        return (
          <>
            <div title={row.voucherIn} className="cursor-pointer">
              <CopyHelper data={row.voucherIn}>{addressFormat(row.voucherIn)}</CopyHelper>
            </div>
          </>
        );
      },
    },
    {
      key: 'outChain',
      label: <Trans id="Out Chain"></Trans>,
      prop: 'tokenOutChain',
    },
    {
      key: 'outAddress',
      label: <Trans id="Out Address"></Trans>,
      colNode: (row: DreamExchangeOrderInfo) => {
        return (
          <>
            <div title={row.tokenOutAddress} className="cursor-pointer">
              <CopyHelper data={row.tokenOutAddress}>
                {addressFormat(row.tokenOutAddress)}
              </CopyHelper>
            </div>
          </>
        );
      },
    },
    {
      key: 'outToken',
      label: <Trans id="Out Token"></Trans>,
      prop: 'tokenOutName',
    },
    {
      key: 'status',
      label: <Trans id="Status"></Trans>,
      colNode: (row: DreamExchangeOrderInfo) => {
        return (
          <>
            {row.isValid ? (
              <span className="border border-green-800 text-green-800 py-[0.4rem] px-[0.4rem] rounded-[4px] text-[0.6rem]">
                <Trans id="Open"></Trans>
              </span>
            ) : (
              <span className="border border-theme-500 text-theme-500 py-[0.4rem] px-[0.4rem] rounded-[4px] text-[0.6rem]">
                <Trans id="Close"></Trans>
              </span>
            )}
          </>
        );
      },
    },
    {
      key: 'operate',
      label: '',
      colNode: (row: DreamExchangeOrderInfo) => {
        return (
          <>
            <div className="flex justify-start  w-[12.5rem]">
              <AnButton
                size="small"
                onClick={() => {
                  setVisibleDialog(true);
                  setOrderInfo(row);
                }}
              >
                <Trans id="Record"></Trans>
              </AnButton>
              {row.isValid && (
                <CancelOrder
                  row={row}
                  onCall={() => {
                    getDreamExchangeOrders(false);
                  }}
                ></CancelOrder>
              )}
            </div>
          </>
        );
      },
    },
  ];

  const onFilterData = useCallback(() => {
    const list = dreamExchangeOrderData.list.filter(item => {
      return (
        item.maker.toLowerCase() === filterData.maker.toLowerCase() ||
        item.voucherIn.toLowerCase() === filterData.maker.toLowerCase() ||
        item.tokenOutAddress.toLowerCase() === filterData.maker.toLowerCase() ||
        item.tokenOutChain.toLowerCase() === filterData.maker.toLowerCase() ||
        item.orderId.toLowerCase() === filterData.maker.toLowerCase() ||
        item.tokenOutName.toLowerCase() === filterData.maker.toLowerCase()
      );
    });
    setFilterData(draft => {
      draft.data = list;
    });
  }, [dreamExchangeOrderData.list, filterData.maker, setFilterData]);

  const handleOrderLists = useCallback((data: DreamExchangeOrderInfo[]) => {
    const list: DreamExchangeOrderInfo[] = JSON.parse(JSON.stringify(data));
    const openList = list.filter(item => {
      return item.isValid;
    });
    const closeList = list.filter(item => {
      return !item.isValid;
    });
    openList.sort(compareSort('orderId'));
    return openList.concat(closeList);
  }, []);

  useEffect(() => {
    if (filterData.maker && dreamExchangeOrderData.list.length > 0) {
      const list = handleOrderLists(dreamExchangeOrderData.list);
      setFilterData(draft => {
        draft.data = list;
      });
    }
  }, [dreamExchangeOrderData.list, filterData.maker, handleOrderLists, setFilterData]);

  useEffect(() => {
    if (!filterData.maker && dreamExchangeOrderData.list.length > 0) {
      setFilterData(draft => {
        const list = handleOrderLists(dreamExchangeOrderData.list);
        draft.data = list;
      });
    }
  }, [dreamExchangeOrderData.list, filterData.maker, handleOrderLists, setFilterData]);

  return (
    <div>
      <div className="flex mb-[2rem]">
        <AnInput
          value={filterData.maker}
          onChange={value => {
            setFilterData(draft => {
              draft.maker = value;
            });
          }}
          placeholder="filter"
          className="w-[30%] h-[3rem]"
        ></AnInput>
        <AnButton
          onClick={onFilterData}
          disabled={!filterData.maker}
          className="h-[3rem] ml-[1rem]"
        >
          <Trans id="Query"></Trans>
        </AnButton>
      </div>
      {dreamExchangeOrderData.loadFinished ? (
        <div className="grid">
          <AnTable<DreamExchangeOrderInfo>
            data={filterData.data}
            columns={orderColumns}
            gridTemplateColumns="12% 12% 12% 12% 12% 12% 12% 16%"
          ></AnTable>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {orderInfo && (
        <DreamExchangeRecords
          visible={visibleDialog}
          close={() => {
            setVisibleDialog(false);
          }}
          orderInfo={orderInfo}
        ></DreamExchangeRecords>
      )}
    </div>
  );
}

const DreamExchangeOrdersMemo = memo(DreamExchangeOrdersComp);

export default function DreamExchangeOrders() {
  return <DreamExchangeOrdersMemo></DreamExchangeOrdersMemo>;
}
