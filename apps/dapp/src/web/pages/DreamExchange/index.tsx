import { CommonWrapper, NavMenu } from '@components/wrapper/CommonWrapper';
import { Trans } from '@lingui/react';
import { Outlet } from 'react-router-dom';

export default function DreamExchange() {
  const menus: NavMenu[] = [
    {
      label: <Trans id="Publish Order"></Trans>,
      key: 'publishOrder',
      type: 'router',
      path: '/builder/dream-exchange/publish-order',
      isActive: false,
    },
  ];

  return (
    <CommonWrapper title={<Trans id="Dream Exchange"></Trans>} menus={menus}>
      <Outlet />
    </CommonWrapper>
  );
}
