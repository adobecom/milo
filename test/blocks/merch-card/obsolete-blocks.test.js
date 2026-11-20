import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import blockNotifications from '../../../libs/utils/block-notifications.js';

const VARIANTS = [
  'segment',
  'special-offers',
  'plans',
  'catalog',
  'product',
  'inline-heading',
  'image',
  'mini-compare-chart',
  'twp',
];

describe('legacy merch card obsolete notifications', () => {
  let fetchStub;
  const originalFetch = window.fetch;

  before(async () => {
    setConfig({ codeRoot: '/libs' });
    const sheet = JSON.parse(await readFile({ path: './mocks/obsolete-blocks.json' }));
    fetchStub = sinon.stub(window, 'fetch').callsFake(async (url) => {
      if (String(url).endsWith('consonant.json')) {
        return { ok: true, json: async () => sheet };
      }
      return { ok: false, status: 404 };
    });
    window.lana = { log: sinon.stub() };
    document.body.innerHTML = await readFile({ path: './mocks/obsolete-blocks.html' });
    await blockNotifications('/libs');
  });

  after(() => {
    fetchStub.restore();
    window.fetch = originalFetch;
    delete window.lana;
    document.body.innerHTML = '';
    document.body.className = '';
  });

  VARIANTS.forEach((variant) => {
    it(`flags the ${variant} variant as obsolete`, () => {
      const block = document.querySelector(`.merch-card.${variant}`);
      expect(block.dataset.decision).to.equal('obsolete');
      expect(block.dataset.blockNotification).to.equal('true');
      const label = block.querySelector('.notification-label');
      expect(label.textContent).to.equal('obsolete');
      expect(label.title).to.contain('has been marked obsolete');
    });
  });

  ['.merch-card-autoblock', '.merch-card-collection-autoblock', 'merch-card'].forEach((selector) => {
    it(`does not flag ${selector}`, () => {
      const el = document.querySelector(selector);
      expect(el.dataset.blockNotification).to.be.undefined;
      expect(el.querySelector('.notification-label')).to.be.null;
    });
  });
});
