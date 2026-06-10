import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

import { JsonLdGraphManager } from '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

export const PAGE_URL = 'https://www.adobe.com/products/photoshop.html';
export const ORG_ID = 'https://www.adobe.com/#organization';
export const ADOBE_LOGO_URL = 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg';
export const ADOBE_LOGO_OBJECT = {
  '@type': 'ImageObject',
  url: ADOBE_LOGO_URL,
  contentUrl: ADOBE_LOGO_URL,
};

export function setCanonical(url = PAGE_URL) {
  document.head.querySelector('link[rel="canonical"]')?.remove();
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  document.head.appendChild(link);
}

export function makeScript(obj) {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return el;
}

const activeManagers = new Set();

export function trackedManager(...args) {
  const manager = new JsonLdGraphManager(...args);
  activeManagers.add(manager);
  return manager;
}

export function resetManager() {
  activeManagers.forEach((m) => m.destroy?.());
  activeManagers.clear();
  if (window.miloJsonLd) window.miloJsonLd.manager = null;
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  document.body.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
}

export function getManagedGraph() {
  const managed = document.head.querySelector('script[data-milo-jsonld="graph"]');
  return managed ? JSON.parse(managed.textContent) : null;
}

export async function loadFixtureIntoHead(name) {
  const html = await readFile({ path: `./mocks/${name}.html` });
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  [...tpl.content.querySelectorAll('script[type="application/ld+json"]')]
    .forEach((s) => document.head.appendChild(s));
}

// Registers the shared lana stub + canonical link and per-test cleanup so each
// split test file gets the same baseline the original monolith relied on.
export function setupSuite() {
  before(() => {
    window.lana = { log: sinon.stub() };
    setCanonical();
  });

  afterEach(() => {
    resetManager();
    window.lana.log.resetHistory();
  });
}
