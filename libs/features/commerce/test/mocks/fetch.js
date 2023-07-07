import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

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
          json: () => Promise.reject(),
          text: () => Promise.resolve('Bad WCS request')
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          resolvedOffers: buckets.flatMap((array) => array ?? [])
        }),
        text: () => Promise.resolve('Bad WCS request')
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
