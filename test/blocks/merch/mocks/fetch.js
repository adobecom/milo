import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

import { priceLiteralsURL } from '../../../../libs/blocks/merch/merch.js';

export async function mockFetch() {
  // this path allows to import this mock from tests for other blocks (e.g. commerce)
  const literals = JSON.parse(await readFile({ path: '../merch/mocks/literals.json' }));
  const offers = JSON.parse(await readFile({ path: '../merch/mocks/offers.json' }));

  const { fetch } = window;
  sinon.stub(window, 'fetch').callsFake((...args) => {
    const { href, pathname, searchParams } = new URL(String(args[0]));
    // literals mock
    if (href === priceLiteralsURL) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(literals),
      });
    }
    // wcs mock
    if (pathname.endsWith('/web_commerce_artifact')) {
      const osis = searchParams.get('offer_selector_ids').split(',');
      return Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve({
          resolvedOffers: osis.map((osi) => {
            let index = Number.parseInt(osi, 10);
            if (Number.isNaN(index) || !Number.isFinite(index) || index < 0) index = 0;
            return {
              ...offers[index % offers.length],
              offerSelectorIds: [osi],
            };
          }),
        }),
      });
    }
    // fallback to original fetch, should not happen!
    return fetch.apply(window, args);
  });
}

export function unmockFetch() {
  window.fetch.restore?.();
}
