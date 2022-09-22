import ABIParserActiveICON from '@assets/svg/abi-parser-active.svg';
import ABIParserHoverICON from '@assets/svg/abi-parser-hover.svg';
import ABIParserICON from '@assets/svg/abi-parser.svg';
import DreamExchangeActiveICON from '@assets/svg/dream-exchange-active.svg';
import DreamExchangeHoverICON from '@assets/svg/dream-exchange-hover.svg';
import DreamExchangeICON from '@assets/svg/dream-exchange.svg';
import HomeActiveICON from '@assets/svg/home-active.svg';
import HomeHoverICON from '@assets/svg/home-hover.svg';
import HomeICON from '@assets/svg/home.svg';
import { useImmer } from '@hooks/useImmer';
import { Trans } from '@lingui/react';
import classNames from 'classnames';
import { Fragment, ReactNode, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SidebarItem = {
  label: string | ReactNode;
  icon?: string;
  iconHover?: string;
  iconActive?: string;
  key: string;
  type: 'router' | 'href';
  path: string;
  isActive: boolean;
  hidden?: boolean;
  children?: SidebarItem[];
};

export function Sidebar() {
  const navigate = useNavigate();
  const pathdata = useLocation();

  const [sidebarList, setSidebarList] = useImmer<SidebarItem[]>([
    {
      icon: HomeICON,
      iconHover: HomeHoverICON,
      iconActive: HomeActiveICON,
      type: 'router',
      label: <Trans id="Home"></Trans>,
      key: 'home',
      path: '/builder/home',
      isActive: false,
    },
    {
      icon: DreamExchangeICON,
      iconHover: DreamExchangeHoverICON,
      iconActive: DreamExchangeActiveICON,
      type: 'router',
      label: <Trans id="Dream Exchange"></Trans>,
      key: 'DreamExchange',
      path: '/builder/dream-exchange',
      isActive: false,
    },
    {
      icon: ABIParserICON,
      iconHover: ABIParserHoverICON,
      iconActive: ABIParserActiveICON,
      type: 'router',
      label: <Trans id="ABI Parser"></Trans>,
      key: 'ABIParser',
      path: '/builder/abiparser',
      isActive: false,
      hidden: true,
    },
  ]);

  const onPage = useCallback(
    (item: SidebarItem) => {
      item.type === 'router' ? navigate(item.path) : window.open(item.path, '_blank');
    },
    [navigate]
  );

  return (
    <div className="py-[2rem] px-[1rem] text-theme-500">
      {sidebarList.map(item => (
        <Fragment key={item.key}>
          {!item.hidden && (
            <div
              className={classNames(
                'cursor-pointer group',
                'px-[1rem] py-[0.6rem] rounded-[20px] select-none',
                'mb-[1rem]',
                'hover:text-purple-500',
                {
                  'border-[#4c4c8f] bg-purple-500 !text-theme-50':
                    item.type === 'router' && pathdata.pathname.indexOf(item.path) > -1
                      ? true
                      : false,
                }
              )}
              onClick={() => {
                onPage(item);
              }}
              key={item.key}
            >
              <div className="w-full flex items-center">
                {(item.type === 'router' && pathdata.pathname.indexOf(item.path) > -1) === true ? (
                  <>
                    <img src={item.iconActive} alt="" className="w-[1.1rem] mr-[1rem]" />
                  </>
                ) : (
                  <>
                    <img
                      src={item.icon}
                      alt=""
                      className="w-[1.1rem] mr-[1rem] group-hover:hidden"
                    />
                    <img
                      src={item.iconHover}
                      alt=""
                      className="w-[1.1rem] mr-[1rem] hidden group-hover:block"
                    />
                  </>
                )}
                <span>{item.label}</span>
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
