import { ConnectionType } from '@connection/index';
import { getConnection } from '@connection/utils';
import { BACKFILLABLE_WALLETS, userStateAtom } from '@states/user';
import { useImmerAtom } from 'jotai/immer';
import { useMemo } from 'react';

const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS];

export default function useOrderedConnections() {
  const [userState] = useImmerAtom(userStateAtom);

  const selectedWallet: ConnectionType | undefined = userState.selectedWallet;

  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = [];

    // Always attempt to use to Gnosis Safe first, as we can't know if we're in a SafeContext.
    // orderedConnectionTypes.push(ConnectionType.GNOSIS_SAFE);

    // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet);
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter(wallet => wallet !== selectedWallet));

    return orderedConnectionTypes.map(getConnection);
  }, [selectedWallet]);
}
