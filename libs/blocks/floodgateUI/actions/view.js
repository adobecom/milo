import { html } from '../../../deps/htm-preact.js';
import { findFragments } from './index.js';

export default function Actions() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
        ${html`
          <button 
            class=locui-urls-heading-action
            onClick=${findFragments}>Find Fragments
          </button>
        `}
      </div>
    </div>
  `;
}
