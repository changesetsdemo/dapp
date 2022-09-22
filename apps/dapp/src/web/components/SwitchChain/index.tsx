import { closeModal, showModal } from '@components/Dialog';
import { getConnection, switchChain } from '@connection/utils';
import { getChainInfo } from '@constants/chainInfo';
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES, SupportedChainId } from '@constants/chains';
import useParsedQueryString from '@hooks/useParsedQueryString';
import usePrevious from '@hooks/usePrevious';
import { replaceURLParam } from '@lib/routes';
import { useUserStateAtom } from '@states/user/hook';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import { ParsedQs } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SwitchConnectProps = { visible: boolean; close: () => void };

const getChainIdFromName = (name: string) => {
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name);
  const chainId = entry?.[0];
  return chainId ? parseInt(chainId) : undefined;
};

const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain;
  if (!chain || typeof chain !== 'string') return;

  return getChainIdFromName(chain);
};

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || '';
};

export function useSwitchChainModal({ visible, close }: SwitchConnectProps) {
  const { chainId, connector, account } = useWeb3React();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [previousChainId, setPreviousChainId] = useState<number | undefined>(undefined);
  const { setUserState } = useUserStateAtom();

  const parsedQs = useParsedQueryString();
  const urlChainId = getParsedChainId(parsedQs);
  const previousUrlChainId = usePrevious(urlChainId);

  const info = getChainInfo(chainId);

  const replaceURLChainParam = useCallback(() => {
    if (chainId) {
      navigate(
        { search: replaceURLParam(search, 'chain', getChainNameFromId(chainId)) },
        { replace: true }
      );
    }
  }, [chainId, search, navigate]);

  const onSelectChain = useCallback(
    async (targetChain: SupportedChainId, skipClose?: boolean) => {
      if (!connector) return;
      const connectionType = getConnection(connector).type;

      try {
        await switchChain(connector, targetChain, account);
        setUserState({
          selectedWallet: connectionType,
        });
        // // Temporary solution
        setTimeout(() => {
          if (account && targetChain) {
            connector.activate(targetChain);
          }
        }, 1200);
      } catch (error) {
        console.error('Failed to switch networks', error);

        // If we activate a chain and it fails, reset the query param to the current chainId
        // replaceURLChainParam()
      }

      if (!skipClose) {
        closeModal();
        close?.();
      }
    },
    [account, close, connector, setUserState]
  );

  // Can't use `usePrevious` because `chainId` can be undefined while activating.
  useEffect(() => {
    if (chainId && chainId !== previousChainId) {
      setPreviousChainId(chainId);
    }
  }, [chainId, previousChainId]);

  // If there is no chain query param, set it to the current chain
  useEffect(() => {
    const chainQueryUnpopulated = !urlChainId;
    if (chainQueryUnpopulated && chainId) {
      replaceURLChainParam();
    }
  }, [chainId, urlChainId, replaceURLChainParam]);

  // If the chain changed but the query param is stale, update to the current chain
  useEffect(() => {
    const chainChanged = chainId !== previousChainId;
    const chainQueryStale = urlChainId !== chainId;
    if (chainChanged && chainQueryStale) {
      replaceURLChainParam();
    }
  }, [chainId, previousChainId, replaceURLChainParam, urlChainId]);

  const showSwitchChainModal = useCallback(() => {
    showModal({
      visible: visible,
      close: () => {
        close?.();
      },
      footer: false,
      children: (
        <>
          <div className="flex flex-wrap justify-between">
            {ALL_SUPPORTED_CHAIN_IDS.map(item => (
              <div
                className={classNames(
                  'w-[49%]',
                  'border border-solid border-[#eee] rounded-[4px] mb-[1rem] p-[1rem] text-[#656565]',
                  'hover:border-[#868686] hover:text-[#333333] cursor-pointer',
                  'flex justify-between items-center',
                  { '!border-[#4c4c8f] text-[#333333]': Number(item) === chainId ? true : false }
                )}
                key={getChainInfo(Number(item)).label}
                onClick={() => {
                  onSelectChain(Number(item));
                }}
              >
                <span>{getChainInfo(Number(item)).label}</span>
                <div
                  className={classNames('w-[0.8rem] h-[0.8rem] rounded-[50%]', {
                    'bg-[#4c4c8f]': Number(item) === chainId ? true : false,
                  })}
                ></div>
              </div>
            ))}
          </div>
        </>
      ),
    });
  }, [chainId, close, onSelectChain, visible]);

  return {
    showSwitchChainModal,
  };
}
