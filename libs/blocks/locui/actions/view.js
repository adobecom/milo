import { html } from '../../../deps/htm-preact.js';
import { urls, allowFindFragments, allowSyncToLangstore, allowSendForLoc } from '../utils/state.js';
import { findFragments, syncToLangstore, sendForLoc } from './index.js';

export default function Actions() {
  if (allowFindFragments.value || allowSyncToLangstore.value) {
    return html`
      <div class=locui-section>
        <div class=locui-section-heading>
          <h2 class=locui-section-label>Actions</h2>
        </div>
        <div class=locui-url-heading-actions>
          ${allowFindFragments.value && html`
            <button 
              class=locui-urls-heading-action
              onClick=${findFragments}>Find Fragments
            </button>
          `}
          ${allowSyncToLangstore.value && html`
            <button
              onClick=${syncToLangstore}
              class=locui-urls-heading-action>
              Sync to Langstore <span>(${urls.value[0].langstore.lang})</span>
            </button>
          `}
          ${allowSendForLoc.value && html`
            <button
              onClick=${sendForLoc}
              class=locui-urls-heading-action>
              Send for translation
            </button>
          `}
        </div>
      </div>
    `;
  }
}
