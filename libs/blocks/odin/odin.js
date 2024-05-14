/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */
import { html, css, LitElement } from '../../deps/lit-all.min.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/search.js';
import '../../features/spectrum-web-components/dist/button.js';
import '../../features/spectrum-web-components/dist/button-group.js';
import '../../features/spectrum-web-components/dist/picker.js';
import { initJSON as initMerchCard } from '../merch-card/merch-card.js';
import { initJSON as initMarquee } from '../marquee/marquee.js';
import { decorateLinks, getConfig, loadBlock, loadStyle } from '../../utils/utils.js';

const { base } = getConfig();
loadStyle(`${base}/blocks/merch-card/merch-card.css`);

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
  }

  async prepareItems(items) {
    const wrap = async (block, { cfTitle, title, path }, classes = '') => {
      const el = await block;
      return `
    <li>
    <p class="path">${path}</p>
    <sp-button-group>
      <sp-button variant="cta">Use</sp-button>
      <sp-button variant="secondary">Publish</sp-button>
      <sp-button variant="secondary">Unpublish</sp-button>
  </sp-button-group>
    <div 
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
            return wrap(initMerchCard(item), item, `merch-card-collection ${item.type ?? 'catalog'} one-merch-card`);
          case '/conf/sandbox/settings/dam/cfm/models/marquee':
            return wrap(initMarquee(item), item);
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

  render() {
    return html`
      <sp-theme color="light" scale="medium">
        <div>
        <sp-search placeholder="Search" value="Photoshop"></sp-search>
        <sp-picker placeholder="Refine block type">
          <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/merch-card"
            >Merch Card</sp-menu-item
          >
          <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/marquee"
            >Marquee</sp-menu-item
          >
        </sp-picker>
        <sp-button variant="cta" @click=${this.doSearch}>Search</sp-button>
      </div>
        <slot></slot>
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

export default async function init(el) {
  return el.replaceWith(document.createElement('odin-search'));
}
