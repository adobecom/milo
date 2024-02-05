import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

// eslint-disable-next-line no-promise-executor-return
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: '/libs', queryIndexCardPath: '/test' };
setConfig(conf);

const getVisibleCards = (merchCards) => [...merchCards.querySelectorAll('merch-card')]
  .filter((merchCard) => merchCard.style.display !== 'none')
  .sort((a, b) => Number(a.style.order) - Number(b.style.order));

describe('Merch Cards', async () => {
  let init;
  let pageContent;

  let cards = [];

  before(async () => {
    window.lana = { log: () => {} };
    const originalFetch = window.fetch;
    window.fetch = sinon.stub(window, 'fetch').callsFake((url) => {
      let data;
      if (url) {
        data = {
          total: 0,
          offset: 0,
          limit: 0,
          data: cards,
        };
      }
      return Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
    ({ default: init } = await import('../../../libs/blocks/merch-cards/merch-cards.js'));
    // this allows to run the test in the normal browser.
    pageContent = await originalFetch(new URL('./mocks/merch-cards.html', import.meta.url).href).then((r) => r.text());
  });

  beforeEach(async () => {
    document.location.hash = '';
    cards = [];
    document.body.innerHTML = pageContent;
  });

  it('should require a type', async () => {
    const el = document.getElementById('default');
    const merchCards = await init(el);
    expect(merchCards.tagName).to.equal('DIV');
  });

  it('should set "all" as default filter', async () => {
    const el = document.getElementById('defaultFilter');
    const merchCards = await init(el);
    expect(merchCards.tagName).to.equal('MERCH-CARDS');
    expect(merchCards.getAttribute('filter')).to.equal('all');
  });

  it('should parse "filter", "show more text" and default "limit"', async () => {
    const el = document.getElementById('filterShowMoreText');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('all');
    expect(merchCards.getAttribute('limit')).to.equal('24');
  });

  it('should parse the "limit"', async () => {
    const el = document.getElementById('filterShowMoreTextLimit');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('all');
    expect(merchCards.getAttribute('limit')).to.equal('9');
  });

  it('should freeze the filter"', async () => {
    const el = document.getElementById('onlyPhoto');
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

    const merchCards = await init(el);
    expect(merchCards.getAttribute('filtered')).to.equal('photo');

    document.location.hash = '#filter=video';
    await delay();
    expect(merchCards.filter).to.equal('photo');
    expect(merchCards.filtered).to.equal('photo');

    const [photoshop, cc, express] = getVisibleCards(merchCards);
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(express.name).to.be.equal('express');
  });

  it('should parse multiple filters', async () => {
    const el = document.getElementById('multipleFilters');
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

    const merchCards = await init(el);
    expect(merchCards.filter).to.equal('all');
    await delay(500);
    let [cc, photoshop, express] = getVisibleCards(merchCards);
    expect(cc.size).to.be.equal('super-wide');
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(express.name).to.be.equal('express');
    document.location.hash = '#filter=photo';
    await delay(500);
    ([photoshop, cc, express] = getVisibleCards(merchCards));
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(cc.size).to.undefined;
    expect(express.name).to.be.equal('express');
  });

  it('should parse literals', async () => {
    const merchCards = await init(document.getElementById('placeholders'));
    await delay(500);
    expect(merchCards.outerHTML).to.equal(merchCards.nextElementSibling.outerHTML);
  });
});
