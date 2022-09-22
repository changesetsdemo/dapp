import classNames from 'classnames';
import { ReactNode } from 'react';

export type AnItemProps = {
  full?: boolean;
  className?: string;
  children: ReactNode;
};

export function AnList({ children, full, className }: AnItemProps) {
  return <div className={classNames('an-list', { 'w-full': full }, className)}>{children}</div>;
}
