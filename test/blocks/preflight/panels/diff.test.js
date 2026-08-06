import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import DiffPanel from '../../../../libs/blocks/preflight/panels/diff.js';

describe('Preflight Content Diff Panel', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    sinon.stub(window, 'fetch').rejects(new Error('blocked in test'));
  });

  afterEach(() => {
    document.body.removeChild(container);
    sinon.restore();
  });

  it('renders the preflight-diff root with a loading indicator initially', () => {
    render(html`<${DiffPanel} />`, container);
    expect(container.querySelector('.preflight-diff')).to.exist;
    expect(container.querySelector('.preflight-diff-loading')).to.exist;
    expect(container.querySelector('.preflight-diff-empty')).to.not.exist;
    expect(container.querySelector('.preflight-diff-panes')).to.not.exist;
  });
});
