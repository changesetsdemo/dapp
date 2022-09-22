import CoinbaseWalletICON from '@assets/images/coinbaseWalletIcon.svg';
import MataMaskICON from '@assets/images/metamask.png';
import WalletConnectICON from '@assets/images/walletConnectIcon.svg';
import WalletICON from '@assets/svg/wallet.svg';
import { AnButton } from '@components/Button';
import { CreateOdid } from '@components/CreateOdid';
import { useSwitchChainModal } from '@components/SwitchChain';
import { SwitchWallet } from '@components/SwitchConnect';
import { ConnectionType } from '@connection/index';
import { getChainInfo } from '@constants/chainInfo';
import { useAdaptive } from '@hooks/useAdaptive';
import { useOdid } from '@hooks/useOdid';
import { Trans } from '@lingui/react';
import { userStateAtom } from '@states/user';
import { useUserStateAtom } from '@states/user/hook';
import { addressFormat } from '@utils/pipe';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import { useImmerAtom } from 'jotai/immer';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function ConnectWallet() {
  const [showSwitchWallet, setShowSweitchWallet] = useState(false);
  const [showSwitchChain, setShowSwitchChain] = useState(false);
  const [showCreateOdid, setShowCreateOdid] = useState(false);
  const [, setUserStateAtom] = useImmerAtom(userStateAtom);
  const { userState } = useUserStateAtom();
  const { isMobile } = useAdaptive();

  const { showSwitchChainModal } = useSwitchChainModal({
    visible: showSwitchChain,
    close: () => {
      setShowSwitchChain(false);
    },
  });

  const { account, chainId, connector, isActive } = useWeb3React();

  useEffect(() => {
    console.log('[Tip] account ===> ', account);
  }, [account]);

  const bindDeactivate = useCallback(() => {
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
    setUserStateAtom(draft => {
      draft.selectedWallet = undefined;
    });
  }, [connector, setUserStateAtom]);

  const { odid, ipfs } = useOdid();

  const connectIcon = useMemo(() => {
    if (userState.selectedWallet === ConnectionType.INJECTED) {
      return MataMaskICON;
    }
    if (userState.selectedWallet === ConnectionType.COINBASE_WALLET) {
      return CoinbaseWalletICON;
    }
    if (userState.selectedWallet === ConnectionType.WALLET_CONNECT) {
      return WalletConnectICON;
    }
    return WalletICON;
  }, [userState.selectedWallet]);

  return (
    <>
      <div className="flex items-center">
        <AnButton
          className={classNames('!h-[2rem] min-w-[6rem]', {
            'min-w-auto': isMobile,
          })}
          onClick={() => {
            setShowSweitchWallet(true);
          }}
        >
          {isActive && account ? (
            <div className="flex items-center">
              <img
                src={ipfs ? ipfs : connectIcon}
                alt=""
                className="w-[1.2rem] h-[1.2rem] mr-[0.6rem]"
              />{' '}
              {odid ? odid : addressFormat(account)}
            </div>
          ) : (
            <Trans id="Connect Wallet"></Trans>
          )}
        </AnButton>
        {!isMobile && (
          <>
            <AnButton
              className={classNames('ml-[1rem]', {
                'border-[#e83939]':
                  isActive && account && chainId ? (!getChainInfo(chainId) ? true : false) : false,
              })}
              size="small"
              onClick={() => {
                setShowSwitchChain(true);
                // showSwitchChainModal();
              }}
            >
              {isActive && account && chainId ? (
                <>
                  {getChainInfo(chainId) ? (
                    <> {getChainInfo(chainId)?.label}</>
                  ) : (
                    <span className="text-[#e83939]">
                      <Trans id="Chain Error"></Trans>
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Trans id="Switch Chain"></Trans>
                </>
              )}
            </AnButton>
            {/* {isActive && account && (
              <>
                <AnButton
                  className="ml-[1rem]"
                  size="small"
                  onClick={() => {
                    setShowCreateOdid(true);
                  }}
                >
                  <Trans id="Create Odid"></Trans>
                </AnButton>
              </>
            )} */}
            <AnButton
              className="ml-[1rem]"
              size="small"
              disabled={!isActive || !account ? true : false}
              onClick={bindDeactivate}
            >
              <Trans id="Deconnect"></Trans>
            </AnButton>
          </>
        )}
      </div>
      {/* <SwitchChain
        visible={showSwitchChain}
        close={() => {
          setShowSwitchChain(false);
        }}
      ></SwitchChain> */}
      <SwitchWallet
        visible={showSwitchWallet}
        close={() => {
          setShowSweitchWallet(false);
        }}
      ></SwitchWallet>
      <CreateOdid
        visible={showCreateOdid}
        close={() => {
          setShowCreateOdid(false);
        }}
      ></CreateOdid>
    </>
  );
}
