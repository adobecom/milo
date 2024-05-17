/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */

import { html, css, LitElement } from '../../libs/deps/lit-all.min.js';
import '../../libs/features/spectrum-web-components/dist/theme.js';
import '../../libs/features/spectrum-web-components/dist/dialog.js';
import '../../libs/features/spectrum-web-components/dist/search.js';
import '../../libs/features/spectrum-web-components/dist/action-button.js';
import '../../libs/features/spectrum-web-components/dist/action-group.js';
import '../../libs/features/spectrum-web-components/dist/button-group.js';
import '../../libs/features/spectrum-web-components/dist/overlay.js';
import '../../libs/features/spectrum-web-components/dist/button.js';
import '../../libs/features/spectrum-web-components/dist/picker.js';
import '../../libs/deps/merch-icon.js';
import { createTag, getConfig, loadBlock, loadScript, loadStyle } from '../../libs/utils/utils.js';

const { base } = getConfig();
loadStyle(`${base}/blocks/merch-card/merch-card.css`);

const meta = createTag('meta', {
  name: 'urn:adobe:aue:system:aemconnection',
  content: 'aem:https://author-p22655-e59341.adobeaemcloud.com',
});

const headers = {
  Authorization: `Bearer ${localStorage.getItem('bearerToken')}`,
  pragma: 'no-cache',
  'cache-control': 'no-cache',
};

document.head.appendChild(meta);

loadScript('https://universal-editor-service.experiencecloud.live/corslib/LATEST');

class OdinSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    sp-theme {
      display: contents;
    }
  `;

  static properties = { source: { type: Object } };

  constructor() {
    super();
    this.query = '';
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('confirm', this.confirm);
  }

  onKeydown(e) {
    e.stopPropagation();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('aue:content-patch', this.onContentPatch);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('aue:content-patch', this.onContentPatch);
  }

  onContentPatch(e) {
    e.stopPropagation();
    const { miloBlock, odinPath } = e.target.dataset;
    e.target.innerHTML = `<div class="${miloBlock}"><a class="odin" href="?fragment=${odinPath}"></a></div>`;
    loadBlock(e.target.firstElementChild);
  }

  async prepareItems(items) {
    const wrap = async (block, { cfTitle, title, path }, classes = '') => `
    <li>
    <p class="path">${path}</p>
    <sp-action-group>
      <sp-action-button id="copy" emphasized><sp-icon-copy slot="icon"></sp-icon-copy>Copy</sp-action-button>
      <overlay-trigger type="modal">
      <sp-dialog-wrapper
          slot="click-content"
          headline="New fragment title"
          underlay
          size="m"
          confirm-label="Duplicate"
          cancel-label="Cancel"
      >
        <sp-textfield size="l" value="${cfTitle || title}"></sp-textfield>
      </sp-dialog-wrapper>
      <sp-action-button slot="trigger" id="duplicate"><sp-icon-duplicate slot="icon"></sp-icon-duplicate>Duplicate</sp-action-button>
    </overlay-trigger>
      <sp-action-button quiet>Publish</sp-action-button>
      <sp-action-button quiet>Unpublish</sp-action-button>
  </sp-action-group>
    <div
    data-milo-block="${block}"
    data-odin-path="${path}"
    data-aue-label="${title ?? cfTitle}"
    data-aue-resource="urn:aemconnection:${path}/jcr:content/data/master"
    data-aue-type="reference"
    class="block ${classes}"><div class="${block}"><a class="odin" href="?fragment=${path}"></a></div></li>`;

    const list = await Promise.all(items.map(
      ({ path, title, fields, model: { path: modelPath } }) => {
        const item = {
          modelPath,
          path,
          cfTitle: title,
          ...Object.fromEntries(
            fields.map(({ name, values: [value] }) => [name, value]),
          ),
        };
        switch (modelPath) {
          case '/conf/sandbox/settings/dam/cfm/models/merch-card':
            return wrap('merch-card', item, `merch-card-collection ${item.type ?? 'catalog'} one-merch-card`);
          case '/conf/sandbox/settings/dam/cfm/models/marquee':
            return wrap('marquee', item, 'marquee');
          default:
            return '';
        }
      },
    ));

    this.querySelector('ul')?.remove();
    const ul = document.createElement('ul');
    ul.innerHTML = list.join('');
    this.appendChild(ul);

    ul.querySelectorAll('[data-odin-path] > *').forEach(loadBlock);
  }

  async confirm(e) {
    const title = this.querySelector('sp-textfield').value;
    const name = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    console.log('Duplicating', this.source.odinPath, 'to', this.source.destParentPath, name, title);
    const bodyContent = new FormData();
    bodyContent.append('cmd', 'copyPage');
    bodyContent.append('srcPath', this.source.odinPath);
    bodyContent.append('destParentPath', this.source.destParentPath);
    bodyContent.append('shallow', 'false');
    bodyContent.append('_charset_', 'UTF-8');
    bodyContent.append('destName', name);
    bodyContent.append('destTitle', title);

    const response = await fetch('https://author-p22655-e59341.adobeaemcloud.com/bin/wcmcommand', {
      method: 'POST',
      body: bodyContent,
      headers: {
        ...headers,
        'X-Api-Key': 'aem-headless-cf-admin',
        'x-aem-affinity-type': 'api',
      },
    });

    e.target.open = false;
    await response.text();
    this.doSearch();
  }

  onClick(e) {
    if (e.target?.id === 'copy') {
      const { dataset: { miloBlock, odinPath, aueLabel } } = e.target.closest('li').querySelector('.block');
      window.top.postMessage({ type: 'odin:copy', data: { miloBlock, odinPath, aueLabel } }, '*');
    }
    if (e.target?.id === 'duplicate') {
      const { dataset: { odinPath, aueLabel } } = e.target.closest('li').querySelector('.block');
      const pathArray = odinPath.split('/');
      pathArray.pop();
      const destParentPath = pathArray.join('/');
      this.source = {
        odinPath,
        destParentPath,
        aueLabel,
      };
    }
    return false;
  }

  render() {
    return html`
      <sp-theme color="light" scale="medium">
        <h1>Merch at Scale Fragments</h1>
        <div>
        <sp-search placeholder="Search" value="Photoshop" size="m"></sp-search>
        <sp-picker label="Fragment model" size="m">
          <sp-menu-item value="all">All</sp-menu-item>
          <sp-menu-item value="L2NvbmYvc2FuZGJveC9zZXR0aW5ncy9kYW0vY2ZtL21vZGVscy9tZXJjaC1jYXJk">Merch Card</sp-menu-item>
          <sp-menu-item value="L2NvbmYvc2FuZGJveC9zZXR0aW5ncy9kYW0vY2ZtL21vZGVscy9tYXJxdWVl">Marquee</sp-menu-item>
        </sp-picker>
        <sp-button @click=${this.doSearch}>Search</sp-button>
      </div>
        <slot @click=${this.onClick}></slot>
      </sp-theme>
    `;
  }

  get search() {
    return this.shadowRoot.querySelector('sp-search');
  }

  get picker() {
    return this.shadowRoot.querySelector('sp-picker');
  }

  async doSearch() {
    const query = encodeURIComponent(this.search.value);
    const modelId = encodeURIComponent(this.picker.value);
    const params = { filter: { path: '/content/dam/sandbox/ilyas', fullText: { text: query, queryMode: 'EXACT_WORDS' } } };
    if (modelId && modelId !== 'all') {
      params.filter.modelIds = [
        modelId,
      ];
    }
    const queryString = escape(JSON.stringify(params));
    let url = `https://author-p22655-e59341.adobeaemcloud.com/adobe/sites/cf/fragments/search?query=${queryString}`;
    // url = '/tools/odin/search.json';
    const res = await fetch(
      url,
      { headers },
    );
    const { items } = await res.json();
    this.prepareItems(items);
  }
}

customElements.define('odin-search', OdinSearch);
