import { abiParserStoreAtom, ABIParserStoreItem } from '@states/abi-parser';
import { useImmerAtom } from 'jotai/immer';
import { useCallback, useEffect } from 'react';

const ABI_PARSER_STORE = 'ABI_PARSER_STORE';

export function useABIParser() {
  const [abiParserStore, setABIParserStoreAtom] = useImmerAtom(abiParserStoreAtom);

  const handleLocalStorage = useCallback(() => {
    const data = window.localStorage.getItem(ABI_PARSER_STORE);

    if (data) {
      setABIParserStoreAtom(() => JSON.parse(data));
    }
  }, [setABIParserStoreAtom]);

  const setABIParserStore = useCallback(
    (data: ABIParserStoreItem) => {
      setABIParserStoreAtom(draft => {
        const checkData = draft.find(item => {
          return item.address === data.abi;
        });
        if (!checkData) {
          draft.unshift(data);
        }
        const list: ABIParserStoreItem[] = [];
        draft.forEach(item => {
          list.push(item);
        });
        window.localStorage.setItem(ABI_PARSER_STORE, JSON.stringify(list));
      });
    },
    [setABIParserStoreAtom]
  );

  useEffect(() => {
    handleLocalStorage();
  }, [handleLocalStorage]);

  return {
    abiParserStore,
    setABIParserStore,
  };
}
