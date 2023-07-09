import { readFile } from '@web/test-runner-commands';
import { sinon } from '../utils';

export async function mockFetch() {
  const { fetch } = window;
  const offers = JSON.parse(await readFile({ path: './mocks/offers.json' }));
  return sinon.stub(window, 'fetch').callsFake((...args) => {
    const { searchParams, pathname } = new URL(String(args[0]));

    if (pathname === '/web_commerce_artifact') {
      const language = searchParams.get('language').toLowerCase()
      const buckets = searchParams.get('offer_selector_ids')
        .split(',')
        .map((osi) => offers[`${osi}-${language}`]?.map((offer) => ({
          ...offer,
          offerSelectorIds: [osi],
        })));
      if (buckets.some(bucket => bucket == null)) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.reject(),
          text: () => Promise.resolve('Some osis were not found')
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          resolvedOffers: buckets.flatMap((array) => array ?? [])
        }),
        text: () => Promise.resolve('Unexpected error')
      });
    }
    
    if (pathname === '/literals/price/en.json') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }

    return fetch.apply(window, args);
  });
}

export function unmockFetch() {
  // @ts-ignore
  window.fetch.restore?.();
}
