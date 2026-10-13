import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } }, miloLibs: '/libs' });

const spectrumRequests = () => performance.getEntriesByType('resource')
  .map(({ name }) => name)
  .filter((name) => name.includes('/features/spectrum-web-components/'));

const flush = () => new Promise((resolve) => { setTimeout(resolve, 200); });

// The window keeps Spectrum registered once loaded, so the order of these
// tests matters: no Spectrum first, then the secure transaction.
describe('merch-offers', () => {
  let init;

  before(async () => {
    ({ default: init } = await import('../../../libs/blocks/merch-offers/merch-offers.js'));
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not load Spectrum for stock offers', async () => {
    document.body.innerHTML = '<div class="merch-offers twp stock"><div><div><p>ABM</p></div><div><p>PUF</p></div><div><p>M2M</p></div></div></div>';
    await init(document.querySelector('.merch-offers'));
    await flush();
    expect(document.querySelector('merch-stock')).to.exist;
    expect(spectrumRequests()).to.deep.equal([]);
    expect(customElements.get('sp-theme')).to.not.exist;
  });

  it('does not load Spectrum for plain offers', async () => {
    document.body.innerHTML = '<div class="merch-offers"><div><div>offers</div></div><p>Text</p><span data-wcs-osi="abc"></span></div>';
    await init(document.querySelector('.merch-offers'));
    await flush();
    expect(spectrumRequests()).to.deep.equal([]);
    expect(customElements.get('sp-theme')).to.not.exist;
  });

  it('does not load Spectrum for addon offers', async () => {
    document.body.innerHTML = '<div class="merch-offers addon"><div><div><p>Addon</p></div></div></div>';
    await init(document.querySelector('.merch-offers'));
    await flush();
    expect(spectrumRequests()).to.deep.equal([]);
  });

  it('loads Spectrum for the secure transaction', async () => {
    document.body.innerHTML = '<div class="merch-offers secure-transaction"><div><div><h5>Secure transaction</h5><p>Your data is safe</p></div></div></div>';
    const secureTransaction = await init(document.querySelector('.merch-offers'));
    expect(secureTransaction.tagName).to.equal('MERCH-SECURE-TRANSACTION');
    ['theme', 'overlay', 'popover'].forEach((dep) => {
      expect(spectrumRequests().some((name) => name.endsWith(`/${dep}.js`)), dep).to.be.true;
    });
    expect(customElements.get('sp-theme')).to.exist;
  });
});
