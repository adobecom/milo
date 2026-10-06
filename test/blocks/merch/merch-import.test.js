import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Merch module dependencies', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('discovers market.js before service initialization without fetching market or geo data', async () => {
    const fetchSpy = sinon.spy(window, 'fetch');
    await import('../../../libs/blocks/merch/merch.js');

    const marketResource = performance.getEntriesByType('resource')
      .find(({ name }) => new URL(name).pathname === '/libs/utils/market.js');
    expect(marketResource).to.not.be.undefined;
    expect(document.querySelector('mas-commerce-service')).to.be.null;
    expect(fetchSpy.called).to.be.false;
  });
});
