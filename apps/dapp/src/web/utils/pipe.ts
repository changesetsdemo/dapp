import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import type { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask';
  if (connector instanceof WalletConnect) return 'WalletConnect';
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet';
  if (connector instanceof Network) return 'Network';
  return 'Unknown';
}

type BeautyAmountProps = {
  value: string | number | BigNumber;
  thousands?: boolean;
  mantissa?: boolean;
  poly?: boolean;
  fixed?: number;
};

export function isEmpty(value: string | number | boolean) {
  return (value ?? '') === '';
}

export function isGreaterThanOrEqualTo(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  return (
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1 ||
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 0
  );
}

export function isGreaterThan(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  const res = new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1;
  return res;
}

export function getCurrentTimestamp(): number {
  const currentDateTime: number = new Date().getTime();
  return Math.floor(currentDateTime / 1000);
}

export function viewTokenAmount(value: number | string, decimals: number, fixed = 6) {
  if (isEmpty(value) || value === '0') {
    return '0';
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber('10').pow(decimals);
  const res: string = bigVal.dividedBy(pow).toFixed(fixed, 1);

  return res === 'NaN' ? '0' : res;
}

export function inputTokenAmount(value: number | string, decimals: number) {
  if (isEmpty(value) || value === '0') {
    return '0';
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber('10').pow(decimals);
  const res: string = bigVal.multipliedBy(pow).toString(10);

  return res === 'NaN' ? '0' : res;
}

export function outputTokenAmount(value: number | string, decimals: number) {
  if (isEmpty(value) || value === '0') {
    return '0';
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber('10').pow(decimals);
  const res: string = bigVal.dividedBy(pow).toString(10);

  return res === 'NaN' ? '0' : res;
}

export function comp(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  const res = new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1;
  return res;
}

export function equal(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  return new BigNumber(val1).comparedTo(new BigNumber(val2)) == 0;
}

export function compOrEqual(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  return (
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1 ||
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 0
  );
}

export function addressFormat(value: string, digits = 4): string {
  if (isEmpty(value)) {
    return '';
  }
  const data =
    (value.toString().indexOf('0x') > -1 ? '0x' : '') +
    value.toString().substring(value.toString().indexOf('0x') > -1 ? 2 : 0, digits + 2) +
    '...' +
    value.substring(value.length, value.length - digits);
  return data;
}

// 35250000.123400 => 35,250,000.123400
export function thousandsValueFormat(value: string): string {
  const res = value.toString().replace(/\d+/, n => {
    return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
      return $1 + ',';
    });
  });
  return res;
}

// 35250000.123400 => 35250000.1234
export function hideMantissa(value: string): string {
  value = value.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
  return value;
}

// 35250000.123400 => 35.25m | view utils.test.ts
export function beautyAmount(
  { value, fixed, mantissa = true, thousands = true, poly = true }: BeautyAmountProps,
  type = 'token'
): string {
  let data = new BigNumber((value + '').replace('$', ''));

  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'b' },
  ];
  let i = si.length - 1;

  if (poly) {
    for (i = si.length - 1; i > 0; i--) {
      if (compOrEqual(data, si[i].value)) {
        break;
      }
    }
    data = new BigNumber(data).dividedBy(new BigNumber(si[i].value));
  }

  if (type === 'token') {
    fixed = fixed ? fixed : comp('1', value) ? 6 : 4;
  } else {
    fixed = 2;
  }

  let res = data.toFixed(fixed, 1);

  res = res === 'NaN' ? '0' : res;
  res = mantissa ? hideMantissa(res) : res;

  res = res.indexOf('.') == -1 ? new BigNumber(res).toFixed(2, 1) : res;
  res = res.split('.')[1] && res.split('.')[1].length < 2 ? new BigNumber(res).toFixed(2, 1) : res;

  res = thousands ? thousandsValueFormat(res) : res;

  return res + (poly ? si[i].symbol : '');
}
export function tokenDivDecimals(
  value: string | number | BigNumber,
  decimals: number,
  fixed?: number
): string {
  if (!value) {
    return '0';
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber('10').pow(decimals);
  const res: string = fixed
    ? bigVal.dividedBy(pow).toFixed(fixed, 1)
    : bigVal.dividedBy(pow).toString(10);

  return res === 'NaN' ? '0' : res;
}
export function dateFormat(value: string | number, format = 'YYYY-MM-DD'): string {
  if (!value) {
    return '';
  }
  const res: string = dayjs(value).format(format);
  return res;
}

export function dateTimeFormat(value: string | number): string {
  if (!value) {
    return '';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function dateUTCFormat(value: string | number, format = 'YYYY-MM-DD'): string {
  if (!value) {
    return '';
  }
  dayjs.extend(utc);
  const res: string = dayjs(value).utc().format(format);
  return res;
}

export function dateTimeUTCFormat(value: string | number): string {
  if (!value) {
    return '';
  }
  dayjs.extend(utc);
  return dayjs(value).utc().format('YYYY-MM-DD HH:mm:ss');
}

export function viewNull(str?: string) {
  return !str || str == 'N/A' ? '--' : '--';
}
export function getDayjs(date?: string | number, isUTC?: boolean) {
  if (isUTC) {
    dayjs.extend(utc);
  }
  return date ? dayjs(date) : dayjs();
}

export function compareSort<T>(key: string, sortBy = 'desc'): (val1: T, val2: T) => number {
  return function (val1: T, val2: T) {
    const val1Data = val1 as unknown as { [key: string]: number };
    const val2Data = val2 as unknown as { [key: string]: number };
    const id1 = val1Data[key];
    const id2 = val2Data[key];
    return sortBy === 'desc' ? Number(id2) - Number(id1) : Number(id1) - Number(id2);
  };
}
