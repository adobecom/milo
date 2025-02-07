import { MasElement } from "./mas-element.js";
import { useService } from "./utilities.js";

/**
 * Universal Promo Terms Link
 */
export class UptLink extends HTMLAnchorElement {
  static is = 'upt-link';
  static tag = 'a';

  // static createUptLink(options = {}, innerHTML = '') {
  //     return createCheckoutElement(UptLink, options, innerHTML);
  // }

  masElement = new MasElement(this);

  connectedCallback() {
      this.masElement.connectedCallback();
      this.addEventListener('click', this.clickHandler);
  }

  disconnectedCallback() {
      this.masElement.disconnectedCallback();
      this.removeEventListener('click', this.clickHandler);
  }

  get isUptLink() {
      return true;
  }

  clickHandler(e) {
      const service = useService();
      console.log('Service', e, service);
  }
}

// Define custom DOM element
if (!window.customElements.get(UptLink.is)) {
  window.customElements.define(UptLink.is, UptLink, {
      extends: UptLink.tag,
  });
}