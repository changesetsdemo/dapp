import { useImmerAtom } from 'jotai/immer';
import { useCallback, useEffect } from 'react';
import { UserState, userStateAtom } from './index';

const STORAGE_USER = 'STORAGE_USER';

export function getUserInfo(): UserState | undefined {
  try {
    const userStorage = window.localStorage.getItem(STORAGE_USER);
    return userStorage ? JSON.parse(userStorage) : undefined;
  } catch (error) {
    return undefined;
  }
}

function setUserInfo(userState: UserState) {
  window.localStorage.setItem(STORAGE_USER, JSON.stringify(userState));
}

export function useUserStateAtom() {
  const [userState, setUserStateAtom] = useImmerAtom(userStateAtom);

  const setUserState = useCallback(
    (userOptions: UserState) => {
      const { selectedWallet, selectedWalletBackfilled } = userOptions;
      const storageUserInfo = getUserInfo();
      setUserStateAtom(draft => {
        if (selectedWallet) {
          draft.selectedWallet = selectedWallet;
        }
        draft.selectedWalletBackfilled =
          (selectedWalletBackfilled ?? '') === '' ? true : selectedWalletBackfilled;
      });
      if (storageUserInfo) {
        storageUserInfo.selectedWallet = selectedWallet;
        storageUserInfo.selectedWalletBackfilled =
          (selectedWalletBackfilled ?? '') === '' ? true : selectedWalletBackfilled;
        setUserInfo(storageUserInfo);
      } else {
        setUserInfo({
          selectedWallet,
          selectedWalletBackfilled,
        });
      }
    },
    [setUserStateAtom]
  );

  const init = useCallback(() => {
    const userStorage = getUserInfo();

    setUserStateAtom(draft => {
      if (userStorage) {
        draft.selectedWallet = !userStorage.selectedWallet ? undefined : userStorage.selectedWallet;
        draft.selectedWalletBackfilled = userStorage.selectedWalletBackfilled;
      }
    });
  }, [setUserStateAtom]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    userState,
    setUserState,
  };
}
