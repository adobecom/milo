/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */

import { html, css, LitElement } from '../../libs/deps/lit-all.min.js';
import '../../libs/features/spectrum-web-components/dist/theme.js';
import '../../libs/features/spectrum-web-components/dist/search.js';
import '../../libs/features/spectrum-web-components/dist/button.js';
import '../../libs/features/spectrum-web-components/dist/button-group.js';
import '../../libs/features/spectrum-web-components/dist/picker.js';
import '../../libs/deps/merch-icon.js';
import { initJSON as initMerchCard } from '../../libs/blocks/merch-card/merch-card.js';
import { initJSON as initMarquee } from '../../libs/blocks/marquee/marquee.js';
import {
  createTag, decorateLinks, getConfig, loadBlock, loadScript, loadStyle,
} from '../../libs/utils/utils.js';

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

  async prepareItems(items) {
    const wrap = async (blockName, block, { cfTitle, title, path }, classes = '') => {
      const el = await block;
      return `
    <li>
    <p class="path">${path}</p>
    <sp-button-group>
      <sp-button variant="accent">Copy</sp-button>
      <sp-button variant="secondary">Publish</sp-button>
      <sp-button variant="secondary">Unpublish</sp-button>
  </sp-button-group>
    <div
    data-milo-block="${blockName}"
    data-odin-path="${path}"
    data-aue-label="${title ?? cfTitle}"
    data-aue-resource="urn:aemconnection:${path}/jcr:content/data/master"
    data-aue-type="reference"
    class="block ${classes}">${el}</div></li>`;
    };

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
            return wrap('merch-card', initMerchCard(item), item, `merch-card-collection ${item.type ?? 'catalog'} one-merch-card`);
          case '/conf/sandbox/settings/dam/cfm/models/marquee':
            return wrap('marquee', initMarquee(item), item);
          default:
            return '';
        }
      },
    ));

    this.querySelector('ul')?.remove();
    const ul = document.createElement('ul');
    ul.innerHTML = list.join('');
    this.appendChild(ul);

    const blocks = [...ul.querySelectorAll('li > *')];
    Promise.all(
      blocks.map((block) => Promise.all(decorateLinks(block).map(loadBlock))),
    );
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
        <div>
        <sp-search placeholder="Search" value="Photoshop" size="m"></sp-search>
        <sp-picker placeholder="Refine block type" size="m">
          <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/merch-card"
            >Merch Card</sp-menu-item
          >
          <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/marquee"
            >Marquee</sp-menu-item
          >
        </sp-picker>
        <sp-button variant="cta" @click=${this.doSearch}>Search</sp-button>
      </div>
        <slot @click=${this.onClick}></slot>
      </sp-theme>
    `;
  }

  get search() {
    return this.shadowRoot.querySelector('sp-search');
  }

  async doSearch() {
    const query = encodeURIComponent(this.search.value);
    const res = await fetch(
      `https://author-p22655-e59341.adobeaemcloud.com/adobe/sites/cf/fragments/search?query=%7B%22filter%22%3A%7B%22path%22%3A%20%22%2Fcontent%2Fdam%2Fsandbox%2Filyas%22%2C%20%22fullText%22%3A%7B%22text%22%3A%22${query}%22%2C%22queryMode%22%3A%22EXACT_WORDS%22%7D%7D%7D`,
      { headers: { Authorization: `Bearer ${this.#bearerToken}` } },
    );
    const { items } = await res.json();
    this.prepareItems(items);
  }
}

customElements.define('odin-search', OdinSearch);
