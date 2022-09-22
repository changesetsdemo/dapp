// import { networkConnection } from '@connection/index';
import { getConnection } from '@connection/utils';
import { Connector } from '@web3-react/types';
import { useEffect } from 'react';
// import { BACKFILLABLE_WALLETS } from 'state/connection/constants';
// import { useAppSelector } from 'state/hooks';
import { getUserInfo } from '@states/user/hook';

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  useEffect(() => {
    const selectedWalletBackfilled = getUserInfo()?.selectedWalletBackfilled;
    const selectedWallet = getUserInfo()?.selectedWallet;

    if (selectedWallet) {
      connect(getConnection(selectedWallet).connector);
    } else if (!selectedWalletBackfilled) {
      // BACKFILLABLE_WALLETS.map(getConnection)
      //   .map((connection: any) => connection.connector)
      //   .forEach(connect);
    }
    // The dependency list is empty so this is only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
