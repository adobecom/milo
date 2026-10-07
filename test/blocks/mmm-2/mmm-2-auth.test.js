import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import { render } from '../../../libs/deps/htm-preact.js';
import { setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/blocks/mmm-2/mmm-2.js';
import { delay, waitFor } from '../../helpers/waitfor.js';

function mountSidekick(authed = false) {
  const sk = document.createElement('aem-sidekick');
  const bar = document.createElement('plugin-action-bar');
  const user = document.createElement('login-button');
  user.id = 'user';
  user.classList.toggle('not-authorized', !authed);
  sk.attachShadow({ mode: 'open' }).appendChild(bar);
  bar.attachShadow({ mode: 'open' }).appendChild(user);
  document.body.appendChild(sk);
  return { sk, user };
}

const pages = {
  result: [{
    pageId: 1,
    url: 'https://www.adobe.com/auth-test',
    target: 'on',
    numOfActivities: 0,
  }],
  totalRecords: 1,
};

describe('MMM-2 Sidekick auth gate', () => {
  let block;
  let fetchStub;
  let originalUrl;
  const dataRequests = () => fetchStub.getCalls()
    .filter(({ args }) => !args[0].includes('mep-auth-check.awesome-sites.corp.adobe.com'));

  beforeEach(async () => {
    originalUrl = window.location.href;
    localStorage.clear();
    setConfig({ miloLibs: '/libs', env: { name: 'prod' } });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    block = document.querySelector('.mmm-2');
    fetchStub = sinon.stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('mep-auth-check.awesome-sites.corp.adobe.com')) throw new Error('offline');
      if (url.includes('.plain.html')) {
        return { ok: true, text: async () => '<body><div class="mmm"></div></body>' };
      }
      if (url.includes('/get-pages')) return { ok: true, json: async () => pages };
      if (url.includes('/get-report')) {
        return { ok: true, json: async () => ({ result: [], totalRecords: 0 }) };
      }
      if (url.includes('/get-target-history')) {
        return { ok: true, json: async () => ({ breakdown: true, result: [] }) };
      }
      if (url.includes('metadata.json')) return { ok: true, json: async () => ({ data: [] }) };
      throw new Error(`Unmocked fetch: ${url}`);
    });
  });

  afterEach(() => {
    render(null, block);
    block.remove();
    document.querySelectorAll('aem-sidekick, helix-sidekick').forEach((el) => el.remove());
    sinon.restore();
    window.history.replaceState({}, '', originalUrl);
    setConfig({ miloLibs: '/libs', env: { name: 'stage' } });
    localStorage.clear();
  });

  ['search', 'inactivity', 'metadata-lookup'].forEach((tab) => {
    it(`protects the ${tab} entry URL without making data requests`, async () => {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url);
      await init(block);
      await waitFor(() => block.textContent.includes('Sign in to use MMM-2'));
      expect(block.querySelector('.mmm2-tabpanel')).to.not.exist;
      expect(block.querySelector('[role="status"]').textContent).to.include('AEM Sidekick');
      expect(dataRequests()).to.have.length(0);
    });
  });

  it('does not mount the app while a signed-out Sidekick is resolving', async () => {
    mountSidekick();
    await init(block);
    expect(block.textContent).to.include('Checking Sidekick sign-in...');
    expect(dataRequests()).to.have.length(0);
    await waitFor(() => block.textContent.includes('Sign in to use MMM-2'), 2000);
    expect(dataRequests()).to.have.length(0);
    expect(block.querySelector('.mmm2-tabpanel')).to.not.exist;
  });

  it('loads immediately for an already signed-in author', async () => {
    mountSidekick(true);
    await init(block);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('.mmm2-auth-message')).to.not.exist;
    expect(block.querySelector('.mmm2-page-item').textContent).to.include('/auth-test');
  });

  it('loads when Sidekick mounts after the denied prompt', async () => {
    await init(block);
    await waitFor(() => block.textContent.includes('Sign in to use MMM-2'));
    expect(dataRequests()).to.have.length(0);
    mountSidekick(true);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('.mmm2-auth-message')).to.not.exist;
  });

  it('removes loaded data on logout and reloads a fresh app on login', async () => {
    const { user } = mountSidekick(true);
    await init(block);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    const originalItem = block.querySelector('.mmm2-page-item');
    const requestsBeforeLogout = fetchStub.getCalls()
      .filter(({ args }) => args[0].includes('/get-pages')).length;
    user.classList.add('not-authorized');
    await waitFor(() => block.textContent.includes('Sign in to use MMM-2'));
    expect(block.querySelector('.mmm2-tabpanel')).to.not.exist;
    expect(block.textContent).to.not.include('/auth-test');
    await delay(150);
    expect(fetchStub.getCalls().filter(({ args }) => args[0].includes('/get-pages')))
      .to.have.length(requestsBeforeLogout);
    user.classList.remove('not-authorized');
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('.mmm2-page-item')).to.not.equal(originalItem);
    expect(fetchStub.getCalls().filter(({ args }) => args[0].includes('/get-pages')))
      .to.have.length(requestsBeforeLogout + 1);
  });

  it('does not restore the app when a pending API response arrives after logout', async () => {
    const { sk } = mountSidekick(true);
    let resolvePages;
    fetchStub.withArgs(sinon.match('/get-pages')).returns(new Promise((resolve) => {
      resolvePages = resolve;
    }));
    await init(block);
    await waitFor(() => fetchStub.calledWith(sinon.match('/get-pages')));
    sk.dispatchEvent(new CustomEvent('logged-out'));
    await waitFor(() => block.textContent.includes('Sign in to use MMM-2'));
    resolvePages({ ok: true, json: async () => pages });
    await delay(150);
    expect(block.querySelector('.mmm2-tabpanel')).to.not.exist;
    expect(block.textContent).to.not.include('/auth-test');
  });

  it('cleans up its auth subscription when unmounted', async () => {
    const { sk, user } = mountSidekick();
    const removeListener = sinon.spy(sk, 'removeEventListener');
    await init(block);
    render(null, block);
    user.classList.remove('not-authorized');
    sk.dispatchEvent(new CustomEvent('logged-in'));
    await delay(150);
    expect(block.childElementCount).to.equal(0);
    expect(dataRequests()).to.have.length(0);
    ['status-fetched', 'logged-in', 'logged-out'].forEach((type) => {
      expect(removeListener.calledWith(type), type).to.be.true;
    });
  });

  it('preserves ungated localhost access without Sidekick', async () => {
    setConfig({ miloLibs: '/libs', env: { name: 'stage' } });
    await init(block);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('.mmm2-auth-message')).to.not.exist;
  });

  it('preserves prodDomains gating even when env is stage', async () => {
    setConfig({
      miloLibs: '/libs',
      env: { name: 'stage' },
      prodDomains: [window.location.hostname],
    });
    await init(block);
    await waitFor(() => block.textContent.includes('Sign in to use MMM-2'));
    expect(dataRequests()).to.have.length(0);
  });

  it('preserves the stage firewall bypass without requiring Sidekick', async () => {
    fetchStub.withArgs(sinon.match('mep-auth-check.awesome-sites.corp.adobe.com'))
      .resolves({});
    await init(block);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('.mmm2-auth-message')).to.not.exist;
  });
});
