import { html, useEffect, useState, render } from '../../../deps/htm-preact.js';
import { cancelProject } from '../utils/miloc.js';
import { urls, syncFragments } from '../utils/state.js';
import { closeActionModal, findFragments, syncFragsLangstore } from './index.js';

function SyncFragments() {
  const [fragments, setFragments] = useState(undefined);
  const [errors, setErrors] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await findFragments();
      if (!cancelled) {
        setFragments(found);
        const invalid = found.filter((frag) => frag[0].valid !== undefined && !frag[0].valid);
        setErrors(invalid.flat(1).map((err) => err.href));
      }
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
    const disabled = !!urls.value.find((url) => url.href === fragment[0].href);
    const checked = syncFragments.value?.find((url) => url[0] === fragment[0].href);
    const url = fragment[0];
    if (errors.includes(url.href)) {
      return html`
        <div class=error-label>
          <label>not found</label> ${url.pathname}
        </div>
      `;
    }
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
    const validFragments = fragments?.filter((url) => !errors.includes(url[0].href));
    const selected = syncFragments.value?.length
      && syncFragments.value?.length === validFragments?.length;
    const toggle = () => {
      syncFragments.value = selected ? [] : validFragments.map((fragment) => [fragment[0].href]);
    };
    if (!validFragments?.length) return '';
    return html`
      <div 
        class="select-all${selected ? ' selected' : ''}" 
        title="Select All Valid"
        onClick=${toggle}>✓</div>
    `;
  };

  const syncing = html`<div class=inline-loading>Scanning project for un-synced fragments</div>`;
  const allFound = html`<div>✓ All valid fragments have been added to this project.</div>`;
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
    ${errors?.length ? html`<div class=locui-fragment-errors>
      Some fragments returned errors during validation. To sync these fragments, please fix errors and try again.
    </div>` : ''}
  `;
}

function SyncLangStoreModal() {
  return html`
    <div class=locui-modal-container>
      <div class=locui-modal-content>
        <h2 class=locui-modal-title>
          Sync to Langstore (${urls.value[0].langstore.lang})?
        </h2>
        <div class=locui-sync-modal-content>
          <strong>This will create the project.</strong> <i>You will no longer be able to add URLs.</i>
          <${SyncFragments} />
          <div class=locui-sync-actions>
            <button 
              class=locui-urls-heading-action
              onClick=${syncFragsLangstore}>Start Sync
            </button>
            <button 
              class="locui-urls-heading-action cancel"
              onClick=${() => { closeActionModal(); }}>Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ConfirmCancelModal() {
  return html`
    <div class=locui-modal-container>
      <div class=locui-modal-content>
        <h2 class=locui-modal-title>
          Are you sure you want to cancel this project?
        </h2>
        <div class=locui-sync-modal-content>
          <strong>There is no turning back.</strong> <i>You will no longer be able to make updates.</i>
          <div class=locui-sync-actions>
            <button 
              class=locui-urls-heading-action
              onClick=${() => { cancelProject(); closeActionModal(); }}>Yes, cancel this project
            </button>
            <button 
              class="locui-urls-heading-action cancel"
              onClick=${() => { closeActionModal(); }}>Nevermind
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function Modal({ type }) {
  if (type === 'cancel') {
    return html`<${ConfirmCancelModal} />`;
  }
  return html`<${SyncLangStoreModal} />`;
}

export default function renderModal(el, type = 'sync') {
  render(html`<${Modal} type=${type} />`, el);
  return el;
}
