import { LitElement, html } from '../../../deps/lit-all.min.js';
import { getSheet } from '../../../../tools/utils/utils.js';

const styles = await getSheet('/libs/blocks/bulk-publish/components/popup.css');

class Popup extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      disable: { type: Boolean },
      show: { state: true },
    };
  }

  constructor() {
    super();
    this.show = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styles];
    this.setupEvents(this.parentElement);
  }

  setupEvents(trigger) {
    trigger.style.setProperty('position', 'relative');
    const toggle = () => { this.show = !this.show; };
    trigger.addEventListener('mouseover', toggle, false);
    trigger.addEventListener('mouseout', toggle, false);
  }

  render() {
    return html`
      <div class="popup${this.show && !this.disable ? ' show' : ' hide'}">
        ${this.text}
      </div>
    `;
  }
}

customElements.define('pop-up', Popup);
