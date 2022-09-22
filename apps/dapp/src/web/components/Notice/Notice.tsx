import classNames from 'classnames';
import { ReactNode } from 'react';

export function AnNotice({ children }: { children: ReactNode }) {
  return (
    <div className={classNames('fixed right-[3rem] top-[10%] z-[1999]')}>
      <div className="min-h-[5rem] p-[1.5rem] bg-[#ffffff] border-[#eeeeee] border rounded-[4px]">
        {children}
      </div>
    </div>
  );
}
