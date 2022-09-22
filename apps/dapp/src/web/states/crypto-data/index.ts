import { atomWithImmer } from 'jotai/immer';

export const cryptoSecretAtom = atomWithImmer({
  show: false,
  value: '',
});
