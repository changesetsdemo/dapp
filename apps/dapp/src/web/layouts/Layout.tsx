import { DappVersion } from '@components/DappVersion';
import { Header } from '@components/Header';
import { AnMessage } from '@components/Message';
import { Sidebar } from '@components/Sidebar';
import { FC, memo, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout: FC = (): JSX.Element => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [pathname]);

  return (
    <>
      <Header></Header>
      <div className="flex mt-[5rem] h-[calc(100vh-5rem)]">
        <div
          className="w-[16.25rem] border-r-[solid] border-r border-r-theme-300"
          style={{ borderRightStyle: 'solid' }}
        >
          <Sidebar></Sidebar>
        </div>
        <div className="flex-1 h-full overflow-auto scroll-wrapper bg-theme-100">
          <Outlet />
        </div>
      </div>
      <DappVersion></DappVersion>
      <AnMessage></AnMessage>
    </>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
