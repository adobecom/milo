import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadArea, setConfig, getConfig } from '../../../../libs/utils/utils.js';
import { waitFor, waitForElement } from '../../../helpers/waitfor.js';

describe('MEP preview initialization', () => {
  let fetchStub;

  beforeEach(() => {
    document.body.innerHTML = '<header></header><main></main><div data-path="/fragments/default"></div>';
    document.querySelector('header').getBoundingClientRect = () => ({ bottom: 50 });
    setConfig({
      codeRoot: '/libs',
      miloLibs: '/libs',
      env: { name: 'stage' },
      locale: { ietf: 'en-US', prefix: '', region: 'us', regions: {} },
      marketsConfig: { languages: { data: [] } },
      mep: {
        preview: true,
        experiments: [],
        prefix: '',
        consentState: { performance: true, advertising: true },
      },
    });
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] }),
      text: async () => '',
    });
  });

  afterEach(() => {
    fetchStub.restore();
    document.body.replaceChildren();
    localStorage.removeItem('mep-align-left');
  });

  it('loads the overlay and fragment highlighting without a mepnext flag', async () => {
    expect(new URLSearchParams(window.location.search).has('mepnext')).to.be.false;
    await loadArea();
    await waitForElement('.mep-fab');
    await waitFor(() => document.querySelector('[data-fragment-default]'));
    expect(document.querySelector('#mep-drawer')).to.exist;
    expect(document.querySelector('.mep-popup')).to.not.exist;
    expect(document.querySelector('[data-fragment-default]').dataset.fragmentDisplay)
      .to.equal('/fragments/default');
  });

  it('does not initialize preview UI or badges when preview is disabled', async () => {
    getConfig().mep.preview = false;
    await loadArea();
    expect(document.querySelector('.mep-fab, #mep-drawer')).to.not.exist;
    expect(document.querySelector('[data-fragment-default]')).to.not.exist;
  });
});
