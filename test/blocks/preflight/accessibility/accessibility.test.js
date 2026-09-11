/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Accessibility from '../../../../libs/blocks/preflight/accessibility/accessibility.js';

const AXE_VIOLATION = {
  id: 'axe-marker',
  impact: 'serious',
  description: 'A sample axe violation',
  helpUrl: 'https://help.example/',
  nodes: [{ html: '<img>' }],
};

const waitFor = async (fn, tries = 60) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight accessibility panel', () => {
  let container;
  let lanaBackup;

  beforeEach(() => {
    lanaBackup = window.lana;
    window.lana = { log: sinon.spy() };
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ json: () => Promise.resolve({}) }));
    window.axe = window.axe || {};
    sinon.stub(window.axe, 'run').resolves({ violations: [AXE_VIOLATION] });
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    render(null, container);
    container.remove();
    sinon.restore();
    window.lana = lanaBackup;
  });

  it('renders the failed results summary once the test completes', async () => {
    render(html`<${Accessibility} />`, container);
    await waitFor(() => container.querySelector('.preflight-item-title'));
    const title = container.querySelector('.preflight-item-title').textContent;
    expect(title).to.contain('Accessibility Test Failed');
    expect(container.querySelector('.summary-list a').getAttribute('href')).to.equal(window.location.href);
    expect(container.textContent).to.contain('wcag2aa');
  });

  it('expands a violation to reveal its details on click', async () => {
    render(html`<${Accessibility} />`, container);
    await waitFor(() => container.querySelector('.violation-summary'));
    const summary = container.querySelector('.violation-summary');
    expect(container.querySelector('.violation-details')).to.be.null;
    summary.click();
    await waitFor(() => container.querySelector('.violation-details'));
    expect(container.querySelector('.violation-details').textContent).to.contain('axe-marker');
  });

  it('renders an error panel when the test run errors', async () => {
    window.axe.run.rejects(new Error('kaboom'));
    render(html`<${Accessibility} />`, container);
    await waitFor(() => container.textContent.includes('Error'));
    expect(container.textContent).to.contain('kaboom');
  });
});
