import { createTag } from '../../utils/utils.js';

const ODIN = 'odin';
const ODIN_AUTHOR = 'odin-author';

let accessToken;

window.addEventListener('message', (e) => {
  if (e.data.type === 'mas:updateAccessToken') {
    accessToken = e.data.accessToken;
  }
});

async function parseMerchLinks(merchLinkHTML) {
  await parseMerchLinks.init;
  const { default: initMerchLink } = await import('../../blocks/merch/merch.js');
  const div = document.createElement('div');
  div.innerHTML = merchLinkHTML;
  const merchLinks = [...div.querySelectorAll('a[href*="/tools/ost?"]')].map((link) => {
    link.classList.add('merch');
    return initMerchLink(link);
  });
  return Promise.all(merchLinks);
}

async function parseMerchCard(cardJson, merchCard) {
  const { type = 'catalog' } = cardJson;
  merchCard.setAttribute('variant', type);
  cardJson.icon?.forEach((icon) => {
    const merchIcon = createTag('merch-icon', { slot: 'icons', src: icon, alt: '', href: '', size: 'l' });
    merchCard.append(merchIcon);
  });

  if (cardJson.title) {
    merchCard.append(createTag('h4', { slot: 'heading-xs' }, cardJson.title));
  }

  if (cardJson.prices?.html) {
    const prices = await parseMerchLinks(cardJson.prices.html);
    const headingM = createTag('h3', { slot: 'heading-m' }, prices);
    merchCard.append(headingM);
  }

  merchCard.append(createTag('p', { slot: 'body-xxs', id: 'individuals1' }, 'Desktop'));

  if (cardJson.description?.html) {
    const bodyXS = createTag('div', { slot: 'body-xs' }, cardJson.description.html);
    merchCard.append(bodyXS);
  }

  if (cardJson.ctas?.html) {
    let ctas = await parseMerchLinks(cardJson.ctas.html);
    ctas = ctas.flatMap((cta) => {
      cta.style.display = 'none';
      const variant = cta.classList.contains('blue') ? 'accent' : 'primary';
      const treatment = variant === 'primary' ? 'outline' : '';
      const spButton = createTag('sp-button', { variant, treatment });
      spButton.innerHTML = cta.innerHTML;
      spButton.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        cta.click();
      });
      return [cta, spButton];
    });
    const theme = createTag('sp-theme', { theme: 'spectrum', color: 'light', scale: 'medium' }, ctas);
    theme.style.display = 'contents';
    const footer = createTag('div', { slot: 'footer' }, theme);
    merchCard.append(footer);
  }
}

/**
 * Custom element representing a MerchDatasource.
 *
 * @attr {string} source - Specifies the data source for the component.
 *                         Possible values: "odin".
 */
class MerchDatasource extends HTMLElement {
  data = {};

  static get observedAttributes() {
    return ['source', 'path'];
  }

  connectedCallback() {
    this.fetchData();
    this.parentElement.style.opacity = 0;
  }

  refresh() {
    this.parentElement.querySelectorAll('[slot]').forEach((el) => el.remove());
    this.fetchData();
  }

  async fetchData() {
    const source = this.getAttribute('source') ?? ODIN;
    const path = this.getAttribute('path');
    if (!path) return;

    if (![ODIN, ODIN_AUTHOR].includes(source)) return;

    let baseUrl = 'https://dev-odin.adobe.com';
    let headers = {};
    let cb = '';
    if (source === ODIN_AUTHOR) {
      baseUrl = 'https://author-p22655-e59341.adobeaemcloud.com';
      cb = `?cb=${Math.round(Math.random() * 1000000)}`;
      headers = { Authorization: `Bearer ${accessToken}` };
    }
    const response = await fetch(`${baseUrl}${path}.cfm.gql.json${cb}`, { headers });
    const { data: { merchCardByPath: { item } } } = await response.json();
    this.data = item;
    this.render();
  }

  render() {
    if (!this.isConnected) return;
    if (this.parentElement.tagName !== 'MERCH-CARD') return;
    parseMerchCard(this.data, this.parentElement).then(async () => {
      await Promise.all([...this.parentElement.querySelectorAll('[is="inline-price"],[is="checkout-link"]')].map((el) => el.onceSettled()));
      this.parentElement.style.opacity = 1;
    });
  }
}

customElements.define('merch-datasource', MerchDatasource);
