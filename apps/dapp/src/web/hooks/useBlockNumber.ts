import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';

let intervalAg: any;

export function useBlockNumber() {
  const { provider, chainId } = useWeb3React();

  const [latestBlockNumber, setLatestBlockNumber] = useState(0);

  const onBlock = useCallback(() => {
    if (provider) {
      provider.getBlockNumber().then(block => {
        setLatestBlockNumber(block);
      });
    }
  }, [provider]);

  useEffect(() => {
    if (provider && chainId) {
      onBlock();
      clearInterval(intervalAg);
      intervalAg = setInterval(() => {
        onBlock();
      }, 2000);
    }
  }, [chainId, onBlock, provider]);

  return {
    latestBlockNumber,
  };
}
