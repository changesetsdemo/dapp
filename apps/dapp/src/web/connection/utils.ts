import { Connector } from '@web3-react/types';
import {
  coinbaseWalletConnection,
  ConnectionType,
  injectedConnection,
  // networkConnection,
  walletConnectConnection,
} from './index';

import { getChainInfo } from '@constants/chainInfo';
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '@constants/chains';
import { RPC_URLS } from '@constants/networks';

export function getIsInjected(): boolean {
  return Boolean(window.ethereum);
}

export function getIsMetaMask(): boolean {
  return (window.ethereum as { isMetaMask: boolean })?.isMetaMask ?? false;
}

export function getIsCoinbaseWallet(): boolean {
  return (window.ethereum as { isCoinbaseWallet: boolean })?.isCoinbaseWallet ?? false;
}

const CONNECTIONS = [injectedConnection, coinbaseWalletConnection, walletConnectConnection];
export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find(item => item.connector === c);
    if (!connection) {
      throw Error('unsupported connector');
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection;
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
      // case ConnectionType.NETWORK:
      //   return networkConnection;
    }
  }
}

export function getConnectionName(connectionType: ConnectionType, isMetaMask?: boolean) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? 'MetaMask' : 'Injected';
    case ConnectionType.COINBASE_WALLET:
      return 'Coinbase Wallet';
    case ConnectionType.WALLET_CONNECT:
      return 'WalletConnect';
  }
}

function getRpcUrls(chainId: SupportedChainId): [string] {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.RINKEBY:
    case SupportedChainId.ROPSTEN:
    case SupportedChainId.GOERLI:
      return [RPC_URLS[chainId]];
    case SupportedChainId.OPTIMISM:
      return ['https://mainnet.optimism.io'];
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return ['https://kovan.optimism.io'];
    case SupportedChainId.ARBITRUM_ONE:
      return ['https://arb1.arbitrum.io/rpc'];
    case SupportedChainId.ARBITRUM_RINKEBY:
      return ['https://rinkeby.arbitrum.io/rpc'];
    case SupportedChainId.POLYGON:
      return ['https://polygon-rpc.com/'];
    case SupportedChainId.POLYGON_MUMBAI:
      return ['https://rpc-endpoints.superfluid.dev/mumbai'];
    default:
  }
  // Our API-keyed URLs will fail security checks when used with external wallets.
  throw new Error('RPC URLs must use public endpoints');
}

export function isChainAllowed(connector: Connector, chainId: number) {
  switch (connector) {
    case injectedConnection.connector:
    case coinbaseWalletConnection.connector:
    case walletConnectConnection.connector:
      return ALL_SUPPORTED_CHAIN_IDS.includes(chainId);
    default:
      return false;
  }
}

export const switchChain = async (
  connector: Connector,
  chainId: SupportedChainId,
  account?: string
) => {
  if (!isChainAllowed(connector, chainId)) {
    throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`);
  } else if (connector === walletConnectConnection.connector) {
    await connector.activate(chainId);
  } else {
    const info = getChainInfo(chainId);

    const addChainParameter = {
      chainId,
      chainName: info.label,
      rpcUrls: getRpcUrls(chainId),
      nativeCurrency: info.nativeCurrency,
      blockExplorerUrls: [info.explorer],
    };
    try {
      await connector.activate(addChainParameter);
    } catch (error) {
      console.log('[Tip] error ===> ', error);
    }
  }
};
