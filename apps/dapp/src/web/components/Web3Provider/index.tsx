import useEagerlyConnect from '@hooks/useEagerlyConnect';
import useOrderedConnections from '@hooks/useOrderedConnections';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { ReactNode, useMemo } from 'react';
import { Connection } from '../../connection';
import { getConnectionName } from '../../connection/utils';

export default function Web3Provider({ children }: { children: ReactNode }) {
  useEagerlyConnect();
  const connections = useOrderedConnections();
  const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }: any) => [
    connector,
    hooks,
  ]);

  const key = useMemo(
    () => connections.map(({ type }: Connection) => getConnectionName(type)).join('-'),
    [connections]
  );

  return (
    <Web3ReactProvider connectors={connectors} key={key} network={undefined}>
      {children}
    </Web3ReactProvider>
  );
}
