// eslint-disable-next-line import/no-extraneous-dependencies
import { readFile } from '@web/test-runner-commands';
import { sinon } from '../utils.js';

const { fetch } = window;

export async function mockFetch() {
  const literals = JSON.parse(await readFile({ path: './mocks/literals.json' }));
  const offers = JSON.parse(await readFile({ path: './mocks/offers.json' }));

  const stub = sinon.stub().callsFake((...args) => {
    const { searchParams, pathname } = new URL(String(args[0]));

    // mock Wcs responses
    if (pathname.endsWith('/web_commerce_artifact')) {
      const language = searchParams.get('language').toLowerCase();
      const buckets = searchParams.get('offer_selector_ids')
        .split(',')
        .map((osi) => offers[`${osi}-${language}`]?.map((offer) => ({
          ...offer,
          offerSelectorIds: [osi],
        })));

      // 404 if any of requested osis does not exist
      if (buckets.some((bucket) => bucket == null)) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.reject(),
          text: () => Promise.resolve('Some osis were not found'),
        });
      }

      // 200, all osis were found
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ resolvedOffers: buckets.flatMap((array) => array ?? []) }),
        text: () => Promise.resolve('Unexpected error'),
      });
    }

    // mock literals fetches
    if (pathname.endsWith('/literals/price/en.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(literals),
      });
    }

    return fetch.apply(window, args);
  });

  window.fetch = stub;
  return stub;
}

export function unmockFetch() {
  window.fetch = fetch;
}
