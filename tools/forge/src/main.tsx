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
import { Deck } from './deck/Deck';
import { DeckBoundary } from './deck/DeckBoundary';
import './deck/deck.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

// THROWAWAY demo flag: `?deck` swaps the app for the leadership slideshow, which
// embeds the real UI inside slides. Same providers, so live components just work.
// Check BOTH the query string AND the hash — inside the DA shell
// (da.live/app/.../page-forge?ref=local#...) our params ride on the hash, not search.
const isDeck = /[?&#]deck\b/.test(window.location.search + window.location.hash);

createRoot(root).render(
  <StrictMode>
    <ConfigProvider>
      <DaSdkProvider>
        <UiStateProvider>
          <SessionsProvider>
            <Provider colorScheme="light">
              {isDeck ? <DeckBoundary><Deck /></DeckBoundary> : <App />}
            </Provider>
          </SessionsProvider>
        </UiStateProvider>
      </DaSdkProvider>
    </ConfigProvider>
  </StrictMode>
);
