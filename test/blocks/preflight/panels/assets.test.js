import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Assets from '../../../../libs/blocks/preflight/panels/assets.js';

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

    expect(container.querySelector('.assets-item-title').textContent).to.equal('Image Dimensions');
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
