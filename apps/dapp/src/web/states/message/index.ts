import { atomWithImmer } from 'jotai/immer';
import { ReactNode } from 'react';

type MessageAtomProps = {
  show: boolean;
  type: 'warn' | 'error' | 'info' | 'success';
  message: string | ReactNode;
  delay?: number;
};

export const messageAtom = atomWithImmer<MessageAtomProps>({
  show: false,
  type: 'info',
  message: '',
  delay: 3600,
});
