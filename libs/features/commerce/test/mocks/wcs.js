import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

export async function mockWcs() {
  const { fetch } = window;
  const offers = JSON.parse(await readFile({ path: './mocks/offers.json' }));
  sinon.stub(window, 'fetch').callsFake((...args) => {
    const { searchParams, pathname } = new URL(String(args[0]));

    if (pathname === '/web_commerce_artifact') {
      const osi = searchParams.get('offer_selector_ids');
      const offer = offers[osi];
      return Promise.resolve({
        ok: !!offer,
        json: () => Promise.resolve(offers[osi] ?? {
          resolvedOffers: [],
        }),
        text: () => Promise.resolve('Bad WCS request')
      });
    } else if (pathname === '/literals/price/en.json') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }

    return fetch.apply(window, args);
  });
}

export function unmockWcs() {
  // @ts-ignore
  window.fetch.restore?.();
}
