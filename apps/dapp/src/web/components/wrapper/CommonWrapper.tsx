import { AnButton } from '@components/Button';
import { useAdaptive } from '@hooks/useAdaptive';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CloseICON from '@assets/svg/close.svg';

export type NavMenu = {
  label: string | ReactNode;
  key: string;
  type: 'router' | 'href' | 'menu';
  path: string;
  value?: string;
  isActive: boolean;
  onTap?: (data: any) => void;
  onClose?: () => void;
  children?: NavMenu[];
};

export function NavMenuModule({ menus, active }: { menus: NavMenu[]; active?: string }) {
  const navigate = useNavigate();
  const pathdata = useLocation();

  return (
    <div
      className="mb-[2rem] pb-[1rem] border-b border-theme-300 flex items-center"
      style={{ borderBottomStyle: 'solid' }}
    >
      {menus.map(item => (
        <div className="ml-[1rem] first:ml-0" key={item.key}>
          <AnButton
            key={item.key}
            size="small"
            onClick={() => {
              if (item.type === 'menu') {
                item?.onTap?.(item.value);
              } else {
                item.type === 'router' ? navigate(item.path) : window.open(item.path, '_blank');
              }
            }}
            className={classNames({
              '!border-[#4c4c8f] text-purple-500':
                (item.type === 'router' && pathdata.pathname.indexOf(item.path) > -1
                  ? true
                  : false) ||
                (item.type === 'menu' && active === item.key),
            })}
          >
            <div className={classNames('relative', { 'pr-[2.6rem]': item.onClose })}>
              {item.label}
              {item.onClose && (
                <img
                  src={CloseICON}
                  alt=""
                  onClick={event => {
                    event.stopPropagation();
                    item?.onClose?.();
                  }}
                  className="absolute top-[50%] translate-y-[-50%] right-[0.6rem] cursor-pointer opacity-[0.6] hover:opacity-[1]"
                />
              )}
            </div>
          </AnButton>
        </div>
      ))}
    </div>
  );
}

const NavMenuModuleMemo = memo(NavMenuModule);

export function CommonWrapper({
  title,
  menus,
  full,
  children,
}: {
  title?: string | ReactNode;
  menus?: NavMenu[];
  full?: boolean;
  center?: boolean;
  children: ReactNode;
}) {
  const { isMobile, adaptive } = useAdaptive();

  return (
    <>
      <div
        className={classNames('w-full', { 'p-[2rem]': !full, 'p-[1rem]': isMobile }, 'mb-[7.5rem]')}
      >
        {/* {title && <div className="text-[1.6rem] mb-[2rem]">{title}</div>} */}
        {menus && menus.length > 0 && <NavMenuModuleMemo menus={menus} />}
        <div className={classNames('w-full')}>{children}</div>
      </div>
    </>
  );
}
