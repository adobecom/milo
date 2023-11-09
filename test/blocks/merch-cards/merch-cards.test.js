import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// eslint-disable-next-line no-promise-executor-return
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Merch Cards', async () => {
  let init;
  let filterMerchCards;

  before(async () => {
    window.lana = { log: () => {} };
    window.fetch = sinon.stub(window, 'fetch').callsFake((url) => {
      let data;
      if (url) {
        data = {
          total: 0,
          offset: 0,
          limit: 0,
          data: [],
        };
      }
      return Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
    ({ default: init, filterMerchCards } = await import('../../../libs/blocks/merch-cards/merch-cards.js'));
    document.body.innerHTML = await readFile({ path: './mocks/merch-cards.html' });
  });

  it('should require a type', async () => {
    const el = document.getElementById('default');
    const merchCards = await init(el);
    expect(merchCards).to.null;
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
    expect(merchCards.getAttribute('show-more-text')).to.equal('Show more');
    expect(merchCards.getAttribute('limit')).to.equal('24');
  });

  it('should parse the "limit"', async () => {
    const el = document.getElementById('filterShowMoreTextLimit');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('all');
    expect(merchCards.getAttribute('show-more-text')).to.equal('Show more');
    expect(merchCards.getAttribute('limit')).to.equal('9');
  });

  it('should freeze the filter"', async () => {
    const el = document.getElementById('onlyPhoto');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('photo');
    document.location.hash = 'filter=video';
    await delay();
    expect(merchCards.getAttribute('filter')).to.equal('photo');
  });

  it.only('should discard not matching cards if filtered', async () => {
    const merchCards = document.getElementById('merchCardsToFilter');
    filterMerchCards(merchCards);
    expect(merchCards.children.length).to.equal(2);
  });

  it('should parse card preferences of filtered collection"', async () => {
    const merchCards = document.getElementById('onlyPhoto');
    
    throw new Error('Not implemented');
  });
});
