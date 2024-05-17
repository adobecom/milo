/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */

import { html, css, LitElement } from '../../libs/deps/lit-all.min.js';
import '../../libs/features/spectrum-web-components/dist/theme.js';
import '../../libs/features/spectrum-web-components/dist/search.js';
import '../../libs/features/spectrum-web-components/dist/action-button.js';
import '../../libs/features/spectrum-web-components/dist/action-group.js';
import '../../libs/features/spectrum-web-components/dist/picker.js';
import '../../libs/deps/merch-icon.js';
import { createTag, getConfig, loadBlock, loadScript, loadStyle } from '../../libs/utils/utils.js';

const { base } = getConfig();
loadStyle(`${base}/blocks/merch-card/merch-card.css`);

const meta = createTag('meta', {
  name: 'urn:adobe:aue:system:aemconnection',
  content: 'aem:https://author-p22655-e59341.adobeaemcloud.com',
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

  static properties = { model: { type: String } };

  #bearerToken;

  constructor() {
    super();
    this.query = '';
    this.#bearerToken = localStorage.getItem('bearerToken');
    this.addEventListener('keydown', this.onKeydown);
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
      <sp-action-button emphasized><sp-icon-copy slot="icon"></sp-icon-copy>Copy</sp-button>
      <sp-action-button><sp-icon-duplicate slot="icon"></sp-icon-duplicate>Duplicate</sp-button>
      <sp-action-button quiet>Publish</sp-button>
      <sp-action-button quiet>Unpublish</sp-button>
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

  onClick(e) {
    if (e.target?.variant === 'accent') {
      const { dataset: { miloBlock, odinPath, aueLabel } } = e.target.closest('li').querySelector('.block');
      // create a link with the above params and copy it to clipboard both as text and html
      const link = document.createElement('a');
      link.href = `https://milo.adobe.com/tools/odin/index.html?fragment=${odinPath}`;
      link.innerHTML = `<strong>${miloBlock}</strong>: ${aueLabel}`;
      link.style.display = 'none';

      const linkBlob = new Blob([link.outerHTML], { type: 'text/html' });
      const textBlob = new Blob([link.href], { type: 'text/plain' });
      // eslint-disable-next-line no-undef
      const data = [new ClipboardItem({ [linkBlob.type]: linkBlob, [textBlob.type]: textBlob })];
      navigator.clipboard.write(data, console.log, console.error);
    }
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
        <sp-button cta @click=${this.doSearch}>Search</sp-button>
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
    const res = await fetch(
      `https://author-p22655-e59341.adobeaemcloud.com/adobe/sites/cf/fragments/search?query=${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${this.#bearerToken}`,
          pragma: 'no-cache',
          'cache-control': 'no-cache',
        },
      },
    );
    const { items } = await res.json();
    this.prepareItems(items);
  }
}

customElements.define('odin-search', OdinSearch);
