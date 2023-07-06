import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

export async function mockWcs() {
  const { fetch } = window;
  const offers = JSON.parse(await readFile({ path: './mocks/offers.json' }));
  sinon.stub(window, 'fetch').callsFake((...args) => {
    const { searchParams, pathname } = new URL(args[0]);

    if (pathname === '/web_commerce_artifact') {
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

    return fetch.apply(window, args);
  });
}

export function unmockWcs() {
  window.fetch.restore?.();
}
