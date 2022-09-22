import { I18nProvider } from '@lib/i18n';
import { FC, memo } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '../routes/index';

const App: FC = (): JSX.Element => {
  const routing = useRoutes(routes);

  return (
    <>
      <I18nProvider>
        <div className="app">{routing}</div>
      </I18nProvider>
    </>
  );
};
export default memo(App);
