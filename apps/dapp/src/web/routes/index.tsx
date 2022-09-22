import Loading from '@components/Loading';
import Layout from '@layouts/Layout';
import ABIParser from '@pages/ABIParser';
import PublicParser from '@pages/ABIParser/PublicParser';
import Builder from '@pages/Builder';
import DreamExchange from '@pages/DreamExchange';
import DreamExchangeOrders from '@pages/DreamExchange/DreamExchangeOrders';
import { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

const LayoutDom = () => (
  <Suspense fallback={<Loading />}>
    <Layout />
  </Suspense>
);

const Routes: RouteObject[] = [];
const mainRoutes = {
  path: '/',
  element: <LayoutDom />,
  children: [{ path: '/', element: <Navigate to="/builder/home"></Navigate> }],
};

const DreamVouchers = lazy(() => import('@pages/DreamExchange/DreamVouchers'));

const builderRouters = {
  path: '/builder',
  element: <LayoutDom />,
  children: [
    { path: '/builder/home', element: <Builder /> },
    {
      path: '/builder/dream-exchange',
      element: <DreamExchange />,
      children: [
        { path: '/builder/dream-exchange', element: <DreamExchangeOrders /> },
        { path: '/builder/dream-exchange/publish-order', element: <DreamVouchers /> },
      ],
    },
    {
      path: '/builder/abiparser',
      element: <ABIParser />,
      children: [{ path: '/builder/abiparser', element: <PublicParser /> }],
    },
  ],
};

Routes.push(mainRoutes);
Routes.push(builderRouters);

export default Routes;
