import { html, useEffect, useState } from '../../../deps/htm-preact.js';
import { showModal, urls, syncFragments } from '../utils/state.js';
import { findFragments, syncFragsLangstore } from './index.js';

function SyncFragments() {
  const [fragments, setFragments] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const find = await findFragments();
      if (!cancelled) setFragments(find);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleClick = ({ target }) => {
    const fragment = target.hasAttribute('frag-url') ? target : target.parentElement;
    const fragmentUrl = fragment.getAttribute('frag-url');
    if (!syncFragments.value.find((sync) => sync[0] === fragmentUrl)) {
      syncFragments.value = [...syncFragments.value, [fragmentUrl]];
    } else {
      syncFragments.value = syncFragments.value.filter((sync) => sync[0] !== fragmentUrl);
    }
  };

  const locFragment = (fragment) => {
    const disabled = !!urls.value.find((url) => url.href === fragment[0]);
    const checked = syncFragments.value?.find((url) => url[0] === fragment[0]);
    const url = new URL(fragment[0]);
    return html`
      <div
        frag-url=${url.href}
        class="locui-fragment ${disabled ? 'found' : 'needs-sync'}" 
        onClick=${handleClick}>
        <span class="checkbox${checked ? ' checked' : ''}">✓</span>
        ${url.pathname}
      </div>
    `;
  };

  const selectAllButton = () => {
    if (!fragments?.length) return '';
    const selected = syncFragments.value?.length === fragments?.length;
    const toggle = () => { syncFragments.value = selected ? [] : fragments; };
    return html`
      <div 
        class="select-all${selected ? ' selected' : ''}" 
        title="Select All"
        onClick=${toggle}>✓</div>
    `;
  };

  const syncing = html`<div class=inline-loading>Scanning project for un-synced fragments</div>`;
  const allFound = html`<div>✓ All Fragments have been added to this project.</div>`;
  const fragmentStatus = fragments === undefined ? syncing : allFound;

  return html`
    <div class=locui-fragments-container>
    <div class=locui-fragments-list>
        <span class="un-synced-label${fragments?.length ? ' show' : ''}">
          Un-synced fragments found in docs:
        </div>
        ${!fragments?.length ? fragmentStatus : fragments.map((fragment) => locFragment(fragment))}
      </div>
      <div class=locui-fragment-tools>
        ${selectAllButton()}
      </div>
    </div>
  `;
}

export default function SyncLangStoreModal() {
  return html`
    <div class=locui-sync-modal-content>
      <strong>This will start the project.</strong> <i>You will no longer be able to add URLs.</i>
      <${SyncFragments} />
      <div class=locui-sync-actions>
        <button 
          class=locui-urls-heading-action
          onClick=${syncFragsLangstore}>Start Sync
        </button>
        <button 
          class="locui-urls-heading-action cancel"
          onClick=${() => { showModal.value = ''; }}>Cancel
        </button>
      </div>
    </div>
  `;
}
