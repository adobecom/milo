import sinon from 'sinon';
import { applyPlanType } from '../../../../libs/deps/mas/commerce.js';

const { fetch } = window;

export const readMockJSON = async (path) => {
  const json = await fetch(path).then((res) => res.json());
  return json;
};

export const readMockText = async (path) => {
  const text = await fetch(path).then((res) => res.text());
  return text;
};

// Mock loadScript to prevent external script loading
function mockLoadScript() {
  const originalLoadScript = window.loadScript;

  // Mock the loadScript function used by MAS libraries
  window.loadScript = sinon.stub().callsFake((src) => {
    if (src.includes('mas.js') || src.includes('mas/libs')) {
      // Mock MAS library loading
      return Promise.resolve({
        default: {
          // Mock MAS functionality that tests might expect
          createCheckoutLink: sinon.stub(),
          createInlinePrice: sinon.stub(),
        },
      });
    }
    // For other scripts, return a resolved promise
    return Promise.resolve();
  });

  return originalLoadScript;
}

// Mock mas-commerce-service element
function mockMasCommerceService() {
  if (!customElements.get('mas-commerce-service')) {
    class MockMasCommerceService extends HTMLElement {
      constructor() {
        super();
        this.readyPromise = Promise.resolve(this);
        this.imsSignedInPromise = Promise.resolve(false);
      }

      registerCheckoutAction() {
        // Mock implementation
        return this;
      }

      createCheckoutLink(contextParam, text) {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = '#';
        link.setAttribute('is', 'checkout-link');

        // Mock methods that tests expect
        link.onceSettled = () => Promise.resolve(link);
        link.value = [{ offerType: 'TRIAL' }];
        link.dataset = {};

        return link;
      }

      createInlinePrice() {
        const span = document.createElement('span');
        span.textContent = '$9.99/mo';
        span.onceSettled = () => Promise.resolve(span);
        span.dataset = {};
        return span;
      }

      get Log() {
        return {
          module: () => ({
            debug: () => {},
            warn: () => {},
            error: () => {},
          }),
        };
      }
    }

    customElements.define('mas-commerce-service', MockMasCommerceService);
  }
}

export async function mockFetch() {
  // Mock loadScript to prevent external script loading
  const originalLoadScript = mockLoadScript();
  
  // Mock mas-commerce-service custom element
  mockMasCommerceService();
  
  // this path allows to import this mock from tests for other blocks (e.g. commerce)
  const basePath = '/test/blocks/merch/mocks/';
  const offers = await readMockJSON(`${basePath}offers.json`);
  const namedOffers = await readMockJSON(`${basePath}named-offers.json`);

  namedOffers.forEach(({ resolvedOffers: [offer] }) => {
    const {
      offerSelectorIds,
      productArrangement: { productFamily },
      offerType,
      customerSegment,
      marketSegments: [
        marketSegment,
      ],
      language,
    } = offer;
    // eslint-disable-next-line no-nested-ternary
    const segment = customerSegment === 'TEAM' ? 'cct' : marketSegment === 'COM' ? 'cci' : 'cce';
    const { planType } = applyPlanType(offer);
    const osi = `${productFamily}-${offerType}-${planType}-${language}-${segment}`.toLowerCase();
    offerSelectorIds.unshift(osi);
  });

  let checkoutLinkConfigs;
  const setCheckoutLinkConfigs = (data) => {
    checkoutLinkConfigs = data === null ? null : Promise.resolve(data);
  };

  let subscriptionsData;
  const setSubscriptionsData = (data) => {
    subscriptionsData = Promise.resolve(data);
  };

  sinon.stub(window, 'fetch').callsFake((...args) => {
    const { pathname, searchParams } = new URL(String(args[0]));

    // wcs mock
    if (pathname.endsWith('/web_commerce_artifact')) {
      const osis = searchParams.get('offer_selector_ids').split(',');
      const firstOsi = osis[0];
      const namedOffer = namedOffers
        .find(({ resolvedOffers: [offer] }) => offer.offerSelectorIds.includes(firstOsi));
      return Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve(
          namedOffer ?? {
            resolvedOffers: osis.map((osi) => {
              let index = Number.parseInt(osi, 10);
              if (Number.isNaN(index) || !Number.isFinite(index) || index < 0) index = 0;
              return {
                ...offers[index % offers.length],
                offerSelectorIds: [osi],
              };
            }),
          },
        ),
      });
    }

    // entitlements data mock
    if (/checkout-link.json/.test(pathname)) {
      if (checkoutLinkConfigs === null) {
        return Promise.reject(new Error('Error while retrieving checkout-link configs'));
      }
      return Promise.resolve(checkoutLinkConfigs ? {
        ok: true,
        status: 200,
        json: () => checkoutLinkConfigs,
      } : { ok: false, status: 404 });
    }

    // user entitlements mock
    if (/subscriptions/.test(pathname)) {
      return Promise.resolve(subscriptionsData ? {
        ok: true,
        status: 200,
        json: () => subscriptionsData,
      } : { ok: false, status: 404 });
    }
    // fallback to original fetch, should not happen!

    // placeholder mock
    if (/placeholders.json$/.test(pathname)) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [] }),
      });
    }
    return fetch.apply(window, args);
  });

  return { 
    setCheckoutLinkConfigs, 
    setSubscriptionsData,
    originalLoadScript
  };
}

export function unmockFetch() {
  window.fetch.restore?.();
  window.loadScript?.restore?.();
}
