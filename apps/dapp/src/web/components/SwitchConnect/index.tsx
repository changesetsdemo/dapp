import { AnDialog } from '@components/Dialog';
import { ConnectionType } from '@connection/index';
import { getConnection } from '@connection/utils';
import { useImmer } from '@hooks/useImmer';
import { Trans } from '@lingui/react';
import { useUserStateAtom } from '@states/user/hook';
import { useWeb3React } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import classNames from 'classnames';
import { memo, useCallback, useEffect } from 'react';

type SwitchConnectProps = { visible: boolean; close: () => void };

type WalletListItem = {
  name: string;
  active: boolean;
  enable: boolean;
  connectionType?: ConnectionType;
  connector?: Connector;
};

function SwitchWalletContent({ close }: SwitchConnectProps) {
  const { userState, setUserState } = useUserStateAtom();
  const { isActive, account } = useWeb3React();

  const [connectorList, setConnectorList] = useImmer([
    {
      name: 'MetaMask',
      active: false,
      enable: true,
      connectionType: ConnectionType.INJECTED,
      connector: getConnection(ConnectionType.INJECTED).connector,
    },
    {
      name: 'Coinbase Wallet',
      active: false,
      enable: true,
      connectionType: ConnectionType.COINBASE_WALLET,
      connector: getConnection(ConnectionType.COINBASE_WALLET).connector,
    },
    {
      name: 'Wallet Connect',
      active: false,
      enable: true,
      connectionType: ConnectionType.WALLET_CONNECT,
      connector: getConnection(ConnectionType.WALLET_CONNECT).connector,
    },
    {
      name: 'Phantom Wallet',
      active: false,
      enable: false,
    },
    {
      name: 'Anacre Wallet',
      active: false,
      enable: false,
    },
  ]);

  const bindActivate = useCallback(
    async (item: WalletListItem) => {
      try {
        await item?.connector?.activate?.();
        setUserState({
          selectedWallet: item?.connectionType,
        });
      } catch (error) {
        setUserState({
          selectedWallet: undefined,
        });
        console.log('[Tip] error ===> ', error);
      }
      close?.();
    },
    [close, setUserState]
  );

  useEffect(() => {
    if (isActive) {
      setConnectorList(draft => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        draft = draft.map(item => {
          item.active = item.connectionType === userState.selectedWallet && account ? true : false;
          return item;
        });
      });
    }
  }, [account, isActive, setConnectorList, userState]);

  return (
    <AnDialog close={close} width="48rem" title={<Trans id="Switch Wallet"></Trans>} footer={false}>
      <div className="">
        {connectorList.map(item => (
          <div
            className={classNames(
              'border border-solid border-[#eee] rounded-[4px] mt-[1rem] first:mt-0 p-[1rem] text-[#656565]',
              'hover:border-[#868686] hover:text-[#333333] cursor-pointer',
              'flex justify-between items-center',
              { '!border-[#4c4c8f] text-[#333333]': item.active },
              { 'opacity-[0.5] !text-[#656565] !border-[#eee] cursor-not-allowed': !item.enable }
            )}
            key={item.name}
            onClick={() => {
              bindActivate(item);
            }}
          >
            <span>{item.name}</span>
            <div
              className={classNames('w-[0.8rem] h-[0.8rem] rounded-[50%]', {
                'bg-[#4c4c8f]': item.active,
              })}
            ></div>
          </div>
        ))}
      </div>
    </AnDialog>
  );
}

const SwitchWalletContentMemo = memo(SwitchWalletContent);

export function SwitchWallet(props: SwitchConnectProps) {
  return <>{props.visible && <SwitchWalletContentMemo {...props} />}</>;
}
