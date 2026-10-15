import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Martech from '../../../../libs/blocks/preflight/panels/martech.js';

const waitFor = async (fn, tries = 60) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight panels martech', () => {
  let main;
  let container;

  beforeEach(() => {
    main = document.createElement('main');
    main.innerHTML = `
      <h1>Hero Heading</h1>
      <a href="/learn">Learn more</a>
      <a href="/learn">Learn more</a>
      <div class="metadata"><h3>skip me</h3></div>
      <a href="https://adobe.com">https://adobe.com</a>
    `;
    document.body.append(main);
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    render(null, container);
    container.remove();
    main.remove();
    sinon.restore();
  });

  it('builds a de-duplicated martech metadata table from main content', async () => {
    render(html`<${Martech} />`, container);
    await waitFor(() => container.querySelector('.martech-table table'));
    const tableText = container.querySelector('.martech-table').textContent;
    expect(tableText).to.contain('martech metadata');
    expect(tableText).to.contain('Hero Heading');
    expect(tableText).to.contain('Learn more');
    // http-prefixed text and .metadata content are excluded.
    expect(tableText).to.not.contain('adobe.com');
    expect(tableText).to.not.contain('skip me');
  });

  it('copies the table to the clipboard and confirms via the button label', async () => {
    const writeStub = sinon.stub(navigator.clipboard, 'write').resolves();
    render(html`<${Martech} />`, container);
    await waitFor(() => container.querySelector('.preflight-action'));
    container.querySelector('.preflight-action').click();
    expect(writeStub.calledOnce).to.be.true;
    await waitFor(() => container.querySelector('.preflight-action').textContent.includes('Copied'));
  });

  it('shows an error label when copying fails', async () => {
    const OriginalClipboardItem = window.ClipboardItem;
    window.ClipboardItem = function ClipboardItemThrows() { throw new Error('no clipboard'); };
    try {
      render(html`<${Martech} />`, container);
      await waitFor(() => container.querySelector('.preflight-action'));
      container.querySelector('.preflight-action').click();
      await waitFor(() => container.querySelector('.preflight-action').textContent.includes('Error'));
    } finally {
      window.ClipboardItem = OriginalClipboardItem;
    }
  });
});
