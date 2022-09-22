import { AnButton } from '@components/Button';
import { CopyHelper } from '@components/CopyHelper';
import { AnDialog } from '@components/Dialog';
import { AnColProps, AnTable } from '@components/Table';
import {
  DreamExchangeOrderInfo,
  DreamExchangeReacordInfo,
  useDreamMarketplaceRecords,
} from '@hooks/useDreamExchangeMarketplace';
import { Trans } from '@lingui/react';
import { exportCSV } from '@utils/ExportCSV';
import { addressFormat, beautyAmount, dateTimeUTCFormat, tokenDivDecimals } from '@utils/pipe';
import { memo, useCallback, useEffect } from 'react';

type CompProps = {
  orderInfo: DreamExchangeOrderInfo;
  visible: boolean;
  close: () => void;
};

export function DreamExchangeRecordsComp({ orderInfo, close }: CompProps) {
  const { dreamExchangeReacordsData, getDreamExchangeRecrods } = useDreamMarketplaceRecords();

  const recordsColumns: AnColProps<DreamExchangeReacordInfo>[] = [
    {
      key: 'voucherId',
      label: <Trans id="Voucher ID"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return <>#{row.voucherId}</>;
      },
    },
    {
      key: 'voucherValue',
      label: <Trans id="Voucher Value"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return (
          <>
            {beautyAmount({
              value: tokenDivDecimals(row.voucherValue, Number(orderInfo.exchangeRateDecimals)),
              poly: false,
            })}
          </>
        );
      },
    },
    {
      key: 'deservedAmount',
      label: <Trans id="Deserved Amount"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return (
          <>
            {beautyAmount({
              value: tokenDivDecimals(row.deservedAmount, Number(orderInfo.exchangeRateDecimals)),
              poly: false,
            })}
            {` ${orderInfo.tokenOutName}`}
          </>
        );
      },
    },
    {
      key: 'taker',
      label: <Trans id="Taker"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return (
          <div title={row.taker} className="cursor-pointer">
            <CopyHelper data={row.taker}>{addressFormat(row.taker)}</CopyHelper>
          </div>
        );
      },
    },
    {
      key: 'chain',
      label: <Trans id="Chain"></Trans>,
      colNode: () => {
        return <>{orderInfo.tokenOutChain}</>;
      },
    },
    {
      key: 'receiverAddress',
      label: <Trans id="Receiver Address"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return (
          <div title={row.receiverAddress} className="cursor-pointer">
            <CopyHelper data={row.receiverAddress}>{addressFormat(row.receiverAddress)}</CopyHelper>
          </div>
        );
      },
    },
    {
      key: 'exchangeTime',
      label: <Trans id="Exchange Time"></Trans>,
      colNode: (row: DreamExchangeReacordInfo) => {
        return <div>{dateTimeUTCFormat(Number(row.exchangeTime) * 1000)}</div>;
      },
    },
  ];

  const exportRecords = useCallback(() => {
    const data: { voucher: string; account: string; chain: string; amount: string }[] = [];

    dreamExchangeReacordsData.list.forEach(item => {
      data.push({
        voucher: orderInfo.voucherIn,
        account: item.receiverAddress,
        chain: orderInfo.tokenOutChain,
        amount: tokenDivDecimals(item.deservedAmount, Number(orderInfo.exchangeRateDecimals)),
      });
    });

    exportCSV(
      {
        voucher: 'Exchange Voucher',
        chain: 'Claim Chain',
        account: 'Claim Account',
        amount: 'Claim Amount',
      },
      data
    );
  }, [
    dreamExchangeReacordsData.list,
    orderInfo.exchangeRateDecimals,
    orderInfo.tokenOutChain,
    orderInfo.voucherIn,
  ]);

  useEffect(() => {
    if (orderInfo) {
      getDreamExchangeRecrods(orderInfo.orderId);
    }
  }, [getDreamExchangeRecrods, orderInfo]);

  return (
    <AnDialog
      title={
        <div>
          <Trans id="Dream Exchange Records"></Trans>
          {` (NO.${orderInfo.orderId})`}
        </div>
      }
      width="80%"
      footer={false}
      close={() => {
        close?.();
      }}
      top="10%"
      center={false}
    >
      {dreamExchangeReacordsData.loadFinished ? (
        <>
          {dreamExchangeReacordsData.list.length > 0 && (
            <div className="mb-[2rem] flex justify-end">
              <AnButton onClick={exportRecords} size="small">
                <Trans id="Export Records"></Trans>
                <svg
                  className="ml-[0.4rem]"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5356"
                  width="18"
                  height="18"
                >
                  <path
                    d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9z"
                    p-id="5357"
                    fill="#111827"
                  ></path>
                  <path
                    d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6 0.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4 14.9-19.2 32.6-35.9 52.4-49.9 41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7-23.4 23.4-54.5 36.3-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"
                    p-id="5358"
                    fill="#111827"
                  ></path>
                </svg>
              </AnButton>
            </div>
          )}
          <AnTable<DreamExchangeReacordInfo>
            data={dreamExchangeReacordsData.list}
            columns={recordsColumns}
          ></AnTable>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </AnDialog>
  );
}

const DreamExchangeRecordsMemo = memo(DreamExchangeRecordsComp);

export function DreamExchangeRecords(props: CompProps) {
  return <>{props.visible && <DreamExchangeRecordsMemo {...props} />}</>;
}
