import { getSheet } from '../../../tools/utils/utils.js';
import { LitElement, html } from '../../deps/lit-all.min.js';

const styles = await getSheet('/blocks/bulk-publish/bulk-publish.css');

class BulkPublish extends LitElement {
  static properties = {
    urls: { state: true },
    processType: { state: true },
  };

  constructor() {
    super();
    this.urls = [];
    this.processType = 'preview';
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  getHeader() {
    return html`<div class="header">Header</div>`;
  }

  render() {
    return html`
      <div id="BulkPublishTool">${this.getHeader()}</div>
    `;
  }
}

customElements.define('bulk-publish', BulkPublish);
export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
}
