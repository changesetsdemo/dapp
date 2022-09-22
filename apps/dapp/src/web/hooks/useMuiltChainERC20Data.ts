import { SupportedChainId } from '@constants/chains';
import { INFURA_NETWORK_URLS } from '@constants/infura';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getContract } from '@utils/index';
import { useCallback, useState } from 'react';
import ERC20ABI from '../abi/erc20.json';

export function useEthERC20Data() {
  const [loadTokenInfo, setLoadTokenInfo] = useState(false);

  const getTokenInfo = useCallback(
    async (chain: string, tokenAddress: string): Promise<{ symbol: string; decimals: string }> => {
      const chainRPC: { [key: string]: string } = {
        Solana: '',
        Ethereum: INFURA_NETWORK_URLS[SupportedChainId.MAINNET],
        BSC: 'https://bsc-dataseed.binance.org',
        Polygon: INFURA_NETWORK_URLS[SupportedChainId.POLYGON],
        Arbitrum: INFURA_NETWORK_URLS[SupportedChainId.ARBITRUM_ONE],
        Fantom: 'https://rpc.ankr.com/fantom/',
      };
      if (!chainRPC[chain]) {
        return {
          symbol: '',
          decimals: '',
        };
      }

      try {
        setLoadTokenInfo(true);
        const web3Provider = new JsonRpcProvider(chainRPC[chain]);
        const symbol = await getContract(tokenAddress, ERC20ABI, web3Provider, undefined)?.symbol();
        const decimals = await getContract(
          tokenAddress,
          ERC20ABI,
          web3Provider,
          undefined
        )?.decimals();

        setLoadTokenInfo(false);

        return {
          symbol,
          decimals,
        };
      } catch (error) {
        setLoadTokenInfo(false);
        return {
          symbol: '',
          decimals: '',
        };
      }
    },
    []
  );

  return {
    loadTokenInfo,
    getTokenInfo,
  };
}
