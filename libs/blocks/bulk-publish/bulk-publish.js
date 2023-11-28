import { getSheet } from '../../../tools/utils/utils.js';
import { LitElement, html } from '../../deps/lit-all.min.js';

const sheet = await getSheet('/libs/blocks/bulk-publish/bulk-publish-wc.css');
const TYPES = [
  'Preview',
  'Publish',
  'Preview & Publish',
  'Unpublish',
  'Delete',
  'Index',
];

customElements.define(
  'bulk-publish',
  class extends LitElement {
    static properties = {
      urls: { state: true },
      processType: { state: true },
      results: { state: true },
    };

    constructor() {
      super();
      this.urls = [];
      this.processType = 'Preview';
      this.results = null;
    }

    connectedCallback() {
      super.connectedCallback();
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    selectType(e) {
      if (e.target.value !== this.processType) {
        this.processType = e.target.value;
      }
    }

    updateUrls(e) {
      const urls = e.target.value.replace(/\n/g, ' ').split(' ');
      if (urls !== this.urls) this.urls = urls;
    }

    runProcess() {
      console.log(`Run the ${this.processType} process for ${this.urls.length}`);
    }

    render() {
      return html`
        <header>
          <h1>Bulk Publish</h1>
        </header>
        <div class="form">
          <div class="urls">
            <label for="urls">URL(s):</label>
            <textarea 
              id="urls"
              class="url-field"
              placeholder="Ex: https://main--milo--adobecom.hlx.page/mypage"
              @change=${this.updateUrls}></textarea>
          </div>
          <select name="process" @change=${this.selectType}>
            ${TYPES.map((type) => (html`
                <option class="type" value=${type}>
                  ${type}
                </option>
            `))}
          </select>
          <button class="submit-button" @click=${this.runProcess}>Run</button>
        </div>
      `;
    }
  },
);

export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
}
