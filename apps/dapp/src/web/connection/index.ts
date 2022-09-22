import { SupportedChainId } from '@constants/chains';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';

import { RPC_URLS } from '@constants/networks';
import UNISWAP_LOGO_URL from '../assets/svg/logo.svg';

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

// const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
//   actions => new Network({ actions, urlMap: RPC_URLS, defaultChainId: 1 })
// );
// export const networkConnection: Connection = {
//   connector: web3Network,
//   hooks: web3NetworkHooks,
//   type: ConnectionType.NETWORK,
// };

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  actions => new MetaMask({ actions, onError })
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
};

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
  actions =>
    new WalletConnect({
      actions,
      options: {
        rpc: RPC_URLS,
        qrcode: true,
      },
      onError,
    })
);
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URLS[SupportedChainId.MAINNET],
        appName: 'Uniswap',
        appLogoUrl: UNISWAP_LOGO_URL,
        reloadOnDisconnect: false,
      },
      onError,
    })
);
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
};
