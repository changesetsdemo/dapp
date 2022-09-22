import { ConnectionType } from '@connection/index';
import { atomWithImmer } from 'jotai/immer';

export const BACKFILLABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.COINBASE_WALLET,
  ConnectionType.WALLET_CONNECT,
];

export type UserState = {
  selectedWallet: ConnectionType | undefined;
  selectedWalletBackfilled?: boolean;
};

export const userStateAtom = atomWithImmer<UserState>({
  selectedWallet: undefined,
  selectedWalletBackfilled: true,
});
