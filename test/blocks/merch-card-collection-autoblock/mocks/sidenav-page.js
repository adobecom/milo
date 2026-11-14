import sinon from 'sinon';
import init from '../../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { getConfig, setConfig } from '../../../../libs/utils/utils.js';

// Collection pages (MERCH_SIDENAV_PAGES) load merch-sidenav.js eagerly. A collection
// without categories never needs it later, so a request proves it started up front.
const BLADE = 'a0b1c2d3-0000-4000-8000-blade0000001';
const originalFetch = window.fetch;
const originalHref = window.location.href;
const locales = { '': { ietf: 'en-US' }, fr: { ietf: 'fr-FR' }, de: { ietf: 'de-DE' } };

export const sidenavRequests = () => performance.getEntriesByType('resource')
  .map(({ name }) => name)
  .filter((name) => name.endsWith('/merch-sidenav.js'));

export function setPage(pathname) {
  window.history.pushState({}, '', pathname);
  setConfig({ locales, miloLibs: '/libs' });
  return getConfig().locale.prefix;
}

export function stubCollection() {
  document.head.append(document.createElement('mas-commerce-service'));
  sinon.stub(window, 'fetch').callsFake(async () => {
    const fragment = await originalFetch('/test/blocks/merch-card-collection-autoblock/mocks/fragment.json')
      .then((res) => res.json());
    const [{ referencesTree: cards }] = fragment.referencesTree;
    const blade = {
      ...fragment,
      id: BLADE,
      fields: { cards: cards.map(({ identifier }) => identifier) },
      referencesTree: cards,
    };
    return new Response(JSON.stringify(blade), { status: 200 });
  });
}

export function restore() {
  window.fetch.restore();
  window.history.pushState({}, '', originalHref);
  document.body.innerHTML = '';
}

export async function mountBlade(hash = '') {
  const content = document.createElement('div');
  const a = document.createElement('a');
  a.setAttribute('href', `https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=${BLADE}${hash}`);
  content.append(a);
  document.body.append(content);
  await init(a);
  return document.querySelector('merch-card-collection');
}
