import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  provider: JsonRpcProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any);
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const Base64 = {
  encode(str: string) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode(('0x' + p1) as unknown as number);
      })
    );
  },
  decode(str: string) {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  },
};
