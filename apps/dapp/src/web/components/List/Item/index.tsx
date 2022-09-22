import classNames from 'classnames';
import { ReactNode } from 'react';

export type AnItemProps = {
  label?: string | ReactNode;
  row?: boolean;
  full?: boolean;
  children: ReactNode;
  className?: string;
};

export function AnItem({ label, row, children, className, full = true }: AnItemProps) {
  return (
    <div
      className={classNames('an-item', { 'w-full': full }, { 'flex items-center': row }, className)}
    >
      {label && <div className="text-[1rem] text-theme-600">{label}</div>}
      <div
        className={classNames('flex items-center text-theme-900', {
          'flex-1 ml-[1rem]': row,
          'w-full mt-[0.6rem]': !row,
        })}
      >
        {children}
      </div>
    </div>
  );
}
