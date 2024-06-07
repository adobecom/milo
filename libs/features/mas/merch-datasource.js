import { createTag } from '../../utils/utils.js';

const ODIN = 'odin';
const ODIN_AUTHOR = 'odin-author';

let accessToken;

const cardContent = {
  catalog: {
    name: 'catalog',
    title: {
      tag: 'h3',
      slot: 'heading-xs',
    },
    prices: {
      tag: 'h3',
      slot: 'heading-xs',
    },
    description: {
      tag: 'div',
      slot: 'body-xs',
    },
    ctas: { size: 'l' },
  },
  ah: {
    name: 'ah',
    title: {
      tag: 'h3',
      slot: 'heading-xxs',
    },
    prices: {
      tag: 'h3',
      slot: 'heading-xs',
    },
    description: {
      tag: 'div',
      slot: 'body-xxs',
    },
    ctas: { size: 's' },
  },
};

let cb = `?cb=${Math.round(Math.random() * 1000000)}`;

const fetchCache = new Map();

const fetchSmart = async (url, options) => {
  if (fetchCache.has(url)) {
    const res = fetchCache.get(url);
    await res;
    return res;
  }
  const res = fetch(url, options).then((res) => res.json());
  fetchCache.set(url, res);
  await res;
  return res;
};

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
  const cardType = cardContent[type] || cardContent.catalog;

  merchCard.setAttribute('variant', type);
  cardJson.icon?.forEach((icon) => {
    const merchIcon = createTag('merch-icon', { slot: 'icons', src: icon, alt: '', href: '', size: 'l' });
    merchCard.append(merchIcon);
  });

  if (cardJson.title) {
    merchCard.append(createTag(cardType.title.tag, { slot: cardType.title.slot }, cardJson.title));
  }

  if (cardJson.prices?.html) {
    const prices = await parseMerchLinks(cardJson.prices.html);
    const headingM = createTag(cardType.prices.tag, { slot: cardType.prices.slot }, prices);
    merchCard.append(headingM);
  }

  merchCard.append(createTag('p', { slot: 'body-xxs', id: 'individuals1' }, 'Desktop'));

  if (cardJson.description?.html) {
    const body = createTag(
      cardType.description.tag,
      { slot: cardType.description.slot },
      cardJson.description.html,
    );
    merchCard.append(body);
  }

  if (cardJson.ctas?.html) {
    let ctas = await parseMerchLinks(cardJson.ctas.html);
    ctas = ctas.flatMap((cta) => {
      cta.style.display = 'none';
      const variant = cta.classList.contains('blue') ? 'accent' : 'primary';
      const treatment = variant === 'primary' ? 'outline' : '';
      const spButton = createTag('sp-button', { variant, treatment, size: cardType.ctas.size });
      spButton.innerHTML = cta.innerHTML;
      spButton.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        const inApp = merchCard.getAttribute('in-app') === '';
        if (inApp) {
          const [{ productArrangementCode }] = cta.value;
          const checkoutUrl = escape(cta.href);
          const actionData = {
            type: 'deep-link',
            //target: `inapp://ccd?workflow=routeToPath&routePath=%2FeditPlan%3Fpa%3D${productArrangementCode}%26cli%3Dcc_desktop%26co%3DUS%26landing_page%3D${checkoutUrl}`,
            target: `inapp://ccd?workflow=routeToPath&routePath=%2FeditPlan%3Fpa%3D${productArrangementCode}%26cli%3Dcc_desktop%26co%3DUS%26landing_page%3Dhttps%3A%2F%2Fcommerce-stg.adobe.com%2Fstore%2Fsegmentation%26ctx%3Da`,
          };
          cta.dispatchEvent(new CustomEvent('deep-link', { detail: actionData, bubbles: true }));
        } else {
          cta.click();
        }
      });

      return [cta, spButton];
    });
    const color = merchCard.getAttribute('color') ?? 'light';
    const theme = createTag('sp-theme', { theme: 'spectrum', color, scale: 'medium' }, ctas);
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
    cb = `?cb=${Math.round(Math.random() * 1000000)}`;
    setTimeout(() => {
      this.parentElement.querySelectorAll('[slot]').forEach((el) => el.remove());
      this.fetchData();
    }, 500);
  }

  async fetchData() {
    const source = this.getAttribute('source') ?? ODIN;
    let path = this.getAttribute('path');
    const originalPath = path;
    if (!path) return;

    if (![ODIN, ODIN_AUTHOR].includes(source)) return;

    let baseUrl = 'https://dev-odin.adobe.com';
    let headers = {};
    const mepSource = this.getAttribute('mep');
    let mepRules;
    if (mepSource) {
      mepRules = await (fetchSmart(mepSource).then(({ experiences: { data } }) => data));
    }
    if (source === ODIN && mepRules) {
      path = mepRules.filter(({ action }) => action === 'replaceFragment').find(({ selector }) => selector === path)?.all ?? path;
    } else if (source === ODIN_AUTHOR) {
      baseUrl = 'https://author-p22655-e59341.adobeaemcloud.com';
      headers = { Authorization: `Bearer ${accessToken}` };
    }
    let response;
    response = await fetchSmart(`${baseUrl}${path}.cfm.gql.json${cb}`, { headers });
    if (response.status === 404) {
      response = await fetchSmart(`${baseUrl}${originalPath}.cfm.gql.json${cb}`, { headers });
    }

    const { data: { merchCardByPath: { item } } } = await response;
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
