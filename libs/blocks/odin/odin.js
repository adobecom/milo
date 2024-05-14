/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */
import { html, css, LitElement, unsafeHTML } from '../../deps/lit-all.min.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/search.js';
import '../../features/spectrum-web-components/dist/button.js';
import '../../features/spectrum-web-components/dist/button-group.js';
import '../../features/spectrum-web-components/dist/picker.js';
import '../../deps/merch-card.js';
import { decorateLinks, loadBlock, loadStyle } from '../../utils/utils.js';

loadStyle('../merch-card/merch-card.css');

class OdinSearch extends LitElement {
  static styles = css`
  :host {
    display: block;
  }
`;

  static properties = { model: { type: String }, result: { type: Object } };

  #csrfToken;

  #bearerToken;

  constructor() {
    super();
    this.query = '';
    this.#csrfToken = localStorage.getItem('csrfToken');
    this.#bearerToken = localStorage.getItem('bearerToken');
  }

  get marquees() {
    return this.result?.marqueeList.items.map((marquee) => html`<li>${marquee.content.html}</li>`) ?? '';
  }

  get merchCards() {
    return this.result?.merchCardList.items.map(({
      _path,
      ctas,
      description,
      icon,
      name,
      prices,
      title,
    }) => (html`
    <div class="one-merch-card catalog" data-milo-block data-aue-label="${title}" data-aue-resource="urn:aemconnection:${_path}/jcr:content/data/master" data-aue-type="container">
     <merch-card variant="catalog" name="${name}" filters="all">
        <merch-icon slot="icons" src="${icon}"></merch-icon>
        <h3 slot="heading-xs">${title}</h3>
        <h2 slot="heading-m">${unsafeHTML(prices.html) ?? ''}</h2>
        <div slot="body-xs">${unsafeHTML(description.html) ?? ''}</div>
        <div slot="footer">
          <p class="action-area">${unsafeHTML(ctas.html) ?? ''}</p>
        </div>
     </merch-card>
     <sp-button-group>
      <sp-button>Use</sp-button>
      <sp-button>Publish</sp-button>
      <sp-button>Unpublish</sp-button>
    </sp-button-group>
  </div>
     `));
  }

  render() {
    return html`
    <sp-theme color="light" scale="medium">
      <sp-search placeholder="Search" value="All Apps"></sp-search>
      <sp-picker placeholder="Refine block type">
        <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/merch-card">Merch Card</sp-menu-item>
        <sp-menu-item value="/conf/sandbox/settings/dam/cfm/models/marquee">Marquee</sp-menu-item>
      </sp-picker>
      <sp-button variant="cta" @click=${this.doSearch}>Search</sp-button>
      <h3>Marquee</h3>
      <ul>
      </ul>
      <h3>Merch card</h3>
      <ul>
      ${this.merchCards}
      </ul>
  `;
  }

  updated(changedProperties) {
    if (changedProperties.has('result')) {
      const blocks = [...this.shadowRoot.querySelectorAll('[data-milo-block]')];
      Promise.all(blocks.map((block) => Promise.all(
        decorateLinks(block).map(loadBlock),
      )));
    }
  }

  async doSearch() {
    // const query = e.target.value;
    const res = await fetch('/libs/blocks/odin/odin-search-result.json');
    const { data } = await res.json();
    this.result = data;
  }
}

customElements.define('odin-search', OdinSearch);

export default async function init(el) {
  return el.replaceWith(document.createElement('odin-search'));
}
