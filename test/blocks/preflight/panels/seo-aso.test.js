import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import SEO from '../../../../libs/blocks/preflight/panels/seo.js';
import { asoCache } from '../../../../libs/blocks/preflight/checks/asoApi.js';
import { setConfig } from '../../../../libs/utils/utils.js';

// Isolated file so preflightApi's memoized getChecksSuite starts uncached and
// resolves to the ASO suite here (a shared file would cache OG from other tests).
describe('preflight panels seo - ASO suite', () => {
  let container;
  let clock;

  const resetAso = () => Object.assign(asoCache, {
    identify: null,
    identifyFinished: false,
    suggest: null,
    suggestFinished: false,
    sessionToken: null,
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    clock = sinon.useFakeTimers({ shouldAdvanceTime: false });
    resetAso();
    setConfig({ imsClientId: 'aso-client' });
    sinon.stub(window, 'fetch').callsFake((url) => {
      const u = String(url);
      if (u.includes('preflight-exclusions')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ path: '**' }] }) });
      }
      if (u.includes('preflight-config.json')) {
        return Promise.resolve({ json: () => Promise.resolve({ data: [{ value: 'aso-client' }] }) });
      }
      return Promise.reject(new Error(`unexpected fetch ${u}`));
    });
  });

  afterEach(() => {
    render(null, container);
    container.remove();
    clock.restore();
    sinon.restore();
    resetAso();
  });

  it('maps ASO identify results to pass/fail/limbo icons and shows an AI suggestion', async () => {
    asoCache.sessionToken = 'session-token';
    asoCache.identify = [
      { id: 'title', status: 'fail', title: 'Title size', description: 'Too long' },
      { id: 'h1-count', status: 'pass', title: 'H1 count', description: 'One H1' },
      { id: 'body-size', status: 'limbo', title: 'Body size', description: 'Pending' },
    ];
    asoCache.identifyFinished = true;
    asoCache.suggest = [{ id: 'title', aiSuggestion: 'A better title' }];
    asoCache.suggestFinished = true;

    render(html`<${SEO} />`, container);
    await clock.tickAsync(1500);

    const icons = [...container.querySelectorAll('.result-icon')].map((el) => el.className);
    expect(icons.some((c) => c.includes('red'))).to.be.true;
    expect(icons.some((c) => c.includes('green'))).to.be.true;
    expect(icons.some((c) => c.includes('orange'))).to.be.true;
    expect(container.textContent).to.contain('A better title');
  });

  it('shows the sign-in prompt and triggers IMS sign-in when unauthenticated', async () => {
    window.asoIMS = { getAccessToken: () => null, signIn: sinon.stub().resolves() };
    try {
      render(html`<${SEO} />`, container);
      await clock.tickAsync(50);
      const signInBtn = container.querySelector('.preflight-auth-error .preflight-action');
      expect(signInBtn, 'sign-in button should render').to.exist;
      expect(container.textContent).to.contain('authenticated with IMS');
      signInBtn.click();
      await clock.tickAsync(50);
      expect(window.asoIMS.signIn.calledOnce).to.be.true;
    } finally {
      delete window.asoIMS;
    }
  });
});
