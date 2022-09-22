import '@assets/css/theme.css';
import Web3Provider from '@components/Web3Provider';
import App from '@pages/App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './style.css';

import './wdyr';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(
  <>
    <Web3Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3Provider>
  </>
);
