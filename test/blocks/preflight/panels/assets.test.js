import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Assets from '../../../../libs/blocks/preflight/panels/assets.js';
import { setLikelyLcp } from '../../../../libs/blocks/preflight/checks/performance.js';
import { setConfig } from '../../../../libs/utils/utils.js';

const waitFor = async (fn, tries = 100) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('Preflight Assets Panel', () => {
  let container;
  let originalWindowProps = {};

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    originalWindowProps = {
      runChecksFromAssets: window.runChecksFromAssets,
      isViewportTooSmallFromAssets: window.isViewportTooSmallFromAssets,
    };
    window.runChecksFromAssets = sinon.stub();
    window.isViewportTooSmallFromAssets = sinon.stub().returns(false);
    window.mockImport = true;
  });

  afterEach(() => {
    document.body.removeChild(container);
    window.runChecksFromAssets = originalWindowProps.runChecksFromAssets;
    window.isViewportTooSmallFromAssets = originalWindowProps.isViewportTooSmallFromAssets;
    window.mockImport = false;
    sinon.restore();
  });

  it('displays loading state when check is running', () => {
    const pendingCheck = new Promise(() => {}); // Never resolves, simulates loading
    window.runChecksFromAssets.returns([pendingCheck]);

    render(html`<${Assets} />`, container);

    expect(container.querySelector('.assets-item-title').textContent).to.equal('Asset Dimensions');
    expect(container.querySelector('.assets-item-description').textContent).to.equal('Checking...');
  });

  it('shows warning message when viewport is too small', () => {
    window.isViewportTooSmallFromAssets.returns(true);
    render(html`<${Assets} />`, container);

    const tooSmallMessage = container.querySelector('.assets-image-grid-item.full-width');
    expect(tooSmallMessage).to.exist;
    expect(tooSmallMessage.textContent).to.include('Please resize your browser');
  });

  it('renders asset check items when viewport is appropriate', () => {
    window.isViewportTooSmallFromAssets.returns(false);
    const pendingCheck = new Promise(() => {});
    window.runChecksFromAssets.returns([pendingCheck]);
    render(html`<${Assets} />`, container);

    expect(container.querySelector('.assets-columns')).to.exist;
    expect(container.querySelector('.assets-item')).to.exist;
    expect(container.querySelector('.assets-item-title')).to.exist;
    expect(container.querySelector('.assets-item-description')).to.exist;
  });
});

describe('Preflight Assets Panel (render paths)', () => {
  let container;

  afterEach(() => {
    render(null, container);
    container.remove();
    document.querySelectorAll('main, .preflight-return-popover').forEach((n) => n.remove());
    sinon.restore();
  });

  const mount = () => {
    container = document.createElement('div');
    document.body.append(container);
  };

  it('shows the resize prompt when the viewport becomes too small', async () => {
    sinon.stub(window, 'matchMedia').returns({ matches: false }); // isViewportTooSmall -> true
    mount();
    render(html`<${Assets} />`, container);
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => container.textContent.includes('Please resize'));
    expect(container.querySelector('.assets-image-grid-item.full-width').textContent).to.contain('1200px');
  });

  it('renders the three asset groups (empty) for an excluded page', async () => {
    sinon.stub(window, 'matchMedia').returns({ matches: true }); // viewport ok
    sinon.stub(window, 'fetch').callsFake((url) => {
      if (String(url).includes('preflight-exclusions')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ path: '**' }] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
    });
    mount();
    render(html`<${Assets} />`, container);
    await new Promise((r) => { setTimeout(r, 50); }); // let the effect attach its resize listener
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => container.querySelector('.assets-columns') && !container.textContent.includes('Please resize'));
    await waitFor(() => container.querySelectorAll('.grid-heading').length >= 3);
    expect(container.textContent).to.contain('No critical asset issues.');
  });

  it('drops removed images when the report re-renders after an edit', async function test() {
    this.timeout(15000);
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' } });
    sinon.stub(window, 'matchMedia').returns({ matches: true });
    sinon.stub(window, 'fetch').resolves({ ok: true, json: () => Promise.resolve({ data: [] }) });
    const canvas = Object.assign(document.createElement('canvas'), { width: 800, height: 400 });
    const main = document.createElement('main');
    main.innerHTML = `<picture><img src="${canvas.toDataURL()}" width="800" height="400"></picture>`;
    document.body.prepend(main);
    await main.querySelector('img').decode();
    setLikelyLcp();
    const listedImages = () => container.querySelectorAll('.assets-image-grid-item:not(.full-width)');
    mount();
    render(html`<${Assets} />`, container);
    await new Promise((r) => { setTimeout(r, 50); });
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => listedImages().length === 1, 600);

    main.innerHTML = '';
    render(null, container);
    render(html`<${Assets} />`, container);
    await waitFor(() => container.textContent.includes('No assets found in the main content.'), 600);
    expect(listedImages().length).to.equal(0);
  });
});
