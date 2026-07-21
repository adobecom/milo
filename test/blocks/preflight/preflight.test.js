import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../libs/deps/htm-preact.js';
import { Preflight } from '../../../libs/blocks/preflight/preflight.js';

const TAB_TITLES = ['General', 'SEO', 'Martech', 'M@S', 'Accessibility', 'Performance', 'Assets'];
// Signal-driven re-renders (tab switch) and useEffect checks resolve on a later tick.
const tick = () => new Promise((resolve) => { setTimeout(resolve, 50); });

describe('Preflight modal (isolation)', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'preflight';
    document.body.appendChild(container);
    // Silence the async checks that the panels fire from useEffect; every check
    // is wrapped in a .catch(), so a rejected fetch keeps the initial render intact.
    sinon.stub(window, 'fetch').rejects(new Error('blocked in test'));
    if (!navigator.clipboard) navigator.clipboard = {};
    sinon.stub(navigator.clipboard, 'write').resolves();
  });

  afterEach(() => {
    document.body.removeChild(container);
    sinon.restore();
  });

  it('renders all seven tabs with the correct labels', () => {
    render(html`<${Preflight} />`, container);
    const buttons = [...container.querySelectorAll('.preflight-tab-button')];
    expect(buttons).to.have.lengthOf(TAB_TITLES.length);
    expect(buttons.map((b) => b.textContent.trim())).to.eql(TAB_TITLES);
  });

  it('selects General by default', () => {
    render(html`<${Preflight} />`, container);
    expect(container.querySelector('#tab-1').getAttribute('aria-selected')).to.equal('true');
    expect(container.querySelector('#panel-1').getAttribute('aria-selected')).to.equal('true');
  });

  it('switches the active panel when each tab is clicked and surfaces content', async () => {
    render(html`<${Preflight} />`, container);
    /* eslint-disable no-await-in-loop */
    for (let idx = 0; idx < TAB_TITLES.length; idx += 1) {
      const button = container.querySelector(`#tab-${idx + 1}`);
      button.click();
      await tick();
      const panel = container.querySelector(`#panel-${idx + 1}`);
      expect(button.getAttribute('aria-selected'), `tab ${idx + 1} selected`).to.equal('true');
      expect(panel.getAttribute('aria-selected'), `panel ${idx + 1} visible`).to.equal('true');
      // The selected panel must actually render something.
      expect(panel.childElementCount, `panel ${idx + 1} has content`).to.be.greaterThan(0);
    }
    /* eslint-enable no-await-in-loop */
  });

  it('exposes a clickable CTA in the Martech panel', async () => {
    render(html`<${Preflight} />`, container);
    container.querySelector('#tab-3').click(); // Martech
    await tick();
    const cta = container.querySelector('#panel-3 .preflight-action');
    expect(cta, 'martech CTA exists').to.exist;
    expect(() => cta.click()).to.not.throw();
  });
});
