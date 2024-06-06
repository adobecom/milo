/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */

import { html, css, LitElement } from '../../deps/lit-all.min.js';
import '../spectrum-web-components/dist/theme.js';
import '../spectrum-web-components/dist/dialog.js';
import '../spectrum-web-components/dist/search.js';
import '../spectrum-web-components/dist/action-button.js';
import '../spectrum-web-components/dist/button-group.js';
import '../spectrum-web-components/dist/overlay.js';
import '../spectrum-web-components/dist/button.js';
import '../spectrum-web-components/dist/picker.js';
import { createTag, loadScript } from '../../utils/utils.js';
import './mas.js';

if (window.self === window.top) {
  document.getElementById('openAUE').style.display = 'block';
}

const bucket = 'author-p22655-e59341';

const meta = createTag('meta', {
  name: 'urn:adobe:aue:system:aemconnection',
  content: `aem:https://${bucket}.adobeaemcloud.com`,
});

let accessToken;

window.addEventListener('message', (e) => {
  if (e.data.type === 'mas:updateAccessToken') {
    accessToken = e.data.accessToken;
  }
});

const headers = () => ({
  Authorization: `Bearer ${accessToken}`,
  pragma: 'no-cache',
  'cache-control': 'no-cache',
});

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

  static properties = { items: { type: Array }, source: { type: Object } };

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
    if (e.detail.patch.name === 'title') {
      e.target.dataset.aueLabel = e.detail.patch.value;
    }
    const dataSource = e.target.querySelector('merch-datasource');
    dataSource.refresh();
  }

  async prepareItems(items) {
    const wrap = async ({ cfTitle, title, path }, content, merchType) => `
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
  </sp-action-group>
    <div
    data-merch-type="${merchType}"
    data-odin-path="${path}"
    data-aue-label="${title ?? cfTitle}"
    data-aue-resource="urn:aemconnection:${path}/jcr:content/data/master"
    data-aue-type="reference">${content}</li>`;

    const list = await Promise.all(items.map(
      ({ path, title, fields, model: { path: modelPath } }) => {
        const item = {
          path,
          cfTitle: title,
          ...Object.fromEntries(
            fields.map(({ name, values: [value] }) => [name, value]),
          ),
        };
        switch (modelPath) {
          case '/conf/sandbox/settings/dam/cfm/models/merch-card': {
            const content = `
            <div class="one-merch-card ${item.type}">
            <merch-card variant="${item.type}">
              <merch-datasource source="odin-author" path="${path}"></merch-datasource>
            </merch-card>
          </div>
            `;
            return wrap(item, content, 'merch-card');
          }
          default:
            return '';
        }
      },
    ));

    this.querySelector('ul')?.remove();
    const ul = document.createElement('ul');
    ul.innerHTML = list.join('');
    this.appendChild(ul);
  }

  async confirm() {
    const title = this.querySelector('sp-dialog-wrapper sp-textfield').value;
    const name = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    console.log('Duplicating', this.source.odinPath, 'to', this.source.destParentPath, name, title);

    const item = this.items.find(({ path }) => path === this.source.odinPath);
    if (!item) return;

    const resp = await fetch(
      `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments`,
      {
        method: 'POST',
        headers: {
          ...headers(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          name,
          description: `This is a duplicate of ${this.source.odinPath}`,
          modelId: item.model.id,
          parentPath: this.source.destParentPath,
          fields: item.fields,
        }),
      },
    );
    await resp.json();
    this.doSearch();
  }

  onClick(e) {
    if (e.target?.id === 'copy') {
      const { dataset: { merchType, odinPath, aueLabel } } = e.target.closest('li').querySelector('[data-odin-path]');
      window.top.postMessage({ type: 'odin:copy', data: { merchType, odinPath, aueLabel } }, '*');
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
        <h1>Merch at Scale Studio</h1>
        <div>
        <sp-search placeholder="Search" value="Photoshop" size="m"></sp-search>
        <sp-picker label="Fragment model" size="m">
          <sp-menu-item value="all">All</sp-menu-item>
          <sp-menu-item value="L2NvbmYvc2FuZGJveC9zZXR0aW5ncy9kYW0vY2ZtL21vZGVscy9tZXJjaC1jYXJk">Merch Card</sp-menu-item>
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
    const params = { filter: { path: '/content/dam/sandbox/mas', fullText: { text: query, queryMode: 'EXACT_WORDS' } } };
    if (modelId && modelId !== 'all') {
      params.filter.modelIds = [
        modelId,
      ];
    }
    const queryString = escape(JSON.stringify(params));
    const url = `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments/search?query=${queryString}`;
    const res = await fetch(
      url,
      { headers: headers() },
    );
    const { items } = await res.json();
    this.items = items;
    this.prepareItems(items);
  }
}

customElements.define('odin-search', OdinSearch);
