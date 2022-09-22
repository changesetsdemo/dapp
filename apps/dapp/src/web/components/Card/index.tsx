import classNames from 'classnames';
import { ReactNode } from 'react';

type AcCardProps = {
  children: ReactNode;
  border?: boolean;
  full?: boolean;
  className?: string;
  style?: { [key: string]: string };
};

export default function AnCard({ children, border = true, full, className, style }: AcCardProps) {
  return (
    <div
      className={classNames(
        'p-[0.75rem]',
        {
          'border border-solid border-[#e1e1e1] rounded-[4px]': border,
        },
        {
          'w-full': full,
        },
        className
      )}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}
