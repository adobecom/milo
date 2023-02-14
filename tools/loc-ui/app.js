import { html } from '../../libs/deps/htm-preact.js';
import ErrorBoundary from './wrappers/ErrorBoundary.js';
import LayoutWrapper from './wrappers/LayoutWrapper.js';

import Subprojects from './components/Subprojects/index.js';
import ContentItems from './components/ContentItems/index.js';

function LocUIApp() {
  return html`
    <${ErrorBoundary}>
      <${LayoutWrapper}>
        <${Subprojects} />
        <${ContentItems} />
      </${LayoutWrapper}>
    </${ErrorBoundary}>
  `;
}

export default LocUIApp;
