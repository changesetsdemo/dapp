import { CommonWrapper } from '@components/wrapper/CommonWrapper';
import { Trans } from '@lingui/react';
import { Outlet } from 'react-router-dom';

export default function ABIParser() {
  return (
    <CommonWrapper title={<Trans id="ABI Parser"></Trans>}>
      <Outlet />
    </CommonWrapper>
  );
}
