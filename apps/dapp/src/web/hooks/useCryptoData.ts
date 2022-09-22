import { cryptoSecretAtom } from '@states/crypto-data';
import { messageAtom } from '@states/message';
import CryptoJS from 'crypto-js';
import { useImmerAtom } from 'jotai/immer';
import { useCallback } from 'react';

export function useCryptoData() {
  const [cryptoSecret, setCryptoSecret] = useImmerAtom(cryptoSecretAtom);
  const [, setMessageAtom] = useImmerAtom(messageAtom);

  const cryptoEncrypt = useCallback(
    (str: string, secret?: string | CryptoJS.lib.WordArray) => {
      if (!cryptoSecret.value && !secret) return str;
      try {
        const encrypted = CryptoJS.AES.encrypt(str, secret || cryptoSecret.value || 'web3-ouid');
        return encrypted.toString();
      } catch (error) {
        return str;
      }
    },
    [cryptoSecret]
  );

  const cryptoDecode = useCallback(
    (
      encrypted: string | CryptoJS.lib.CipherParams,
      secret?: string | CryptoJS.lib.WordArray
    ): {
      value: string;
      valid: boolean;
    } => {
      if (!cryptoSecret.value && !secret)
        return {
          value: encrypted as string,
          valid: false,
        };
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          secret || cryptoSecret.value || 'web3-ouid'
        );
        const value = decrypted.toString(CryptoJS.enc.Utf8) as string;
        if (!value) {
          return {
            value: encrypted as string,
            valid: false,
          };
        }
        return {
          value: value,
          valid: true,
        };
      } catch (error) {
        setCryptoSecret(draft => {
          draft.show = true;
        });
        setMessageAtom(draft => {
          draft.type = 'error';
          draft.show = true;
          draft.message = 'Password wrong';
        });
        return {
          value: encrypted as string,
          valid: false,
        };
      }
    },
    [cryptoSecret, setCryptoSecret, setMessageAtom]
  );

  return {
    cryptoSecret,
    setCryptoSecret,
    cryptoEncrypt,
    cryptoDecode,
  };
}
