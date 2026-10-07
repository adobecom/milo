import { html, render, useLayoutEffect, useState } from '../../deps/htm-preact.js';
import { loadStyle } from '../../utils/utils.js';
import { onSidekickAuth } from '../../features/mep/sidekick-auth.js';
import MmmApp from './components/MmmApp.js';
import { consumeTabConfigs } from './utils.js';

function AuthenticatedMmmApp({ tabConfigs }) {
  const [authenticated, setAuthenticated] = useState(null);
  useLayoutEffect(() => onSidekickAuth(setAuthenticated), []);

  if (authenticated) return html`<${MmmApp} tabConfigs=${tabConfigs} />`;
  return html`
    <div class="mmm2-app">
      <div class="mmm2-auth-message" role="status">
        <h2>${authenticated === null ? 'Checking Sidekick sign-in...' : 'Sign in to use MMM-2'}</h2>
        ${authenticated === false && html`<p>Sign into AEM Sidekick or connect to the Adobe internal network to access MMM-2.</p>`}
      </div>
    </div>
  `;
}

export default async function init(el) {
  const tabConfigs = await consumeTabConfigs(el);
  // Preact's render() reconciles into the container but does not clear pre-existing,
  // non-Preact-managed children - without this the raw authored table markup would
  // stay visible alongside the rendered app.
  el.innerHTML = '';

  render(html`<${AuthenticatedMmmApp} tabConfigs=${tabConfigs} />`, el);

  loadStyle('/libs/features/mep/mep-next/mep-next.css');
}
