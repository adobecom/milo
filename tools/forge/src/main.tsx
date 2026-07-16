import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@react-spectrum/s2';
import '@react-spectrum/s2/page.css';
import './forge.css';
import { ConfigProvider } from './config';
import { DaSdkProvider } from './da/DaSdkProvider';
import { UiStateProvider } from './app/UiStateContext';
import { SessionsProvider } from './sessions/SessionsProvider';
import { App } from './app/App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <ConfigProvider>
      <DaSdkProvider>
        <UiStateProvider>
          <SessionsProvider>
            <Provider colorScheme="light">
              <App />
            </Provider>
          </SessionsProvider>
        </UiStateProvider>
      </DaSdkProvider>
    </ConfigProvider>
  </StrictMode>
);
