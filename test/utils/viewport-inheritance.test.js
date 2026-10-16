import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createTag, loadArea, setConfig } from '../../libs/utils/utils.js';

// `hide-block` makes loadBlock drop the block without running its JS, which isolates
// what decorateSection did: the late fallback in decorate.js never runs here.
const blockHtml = `
  <div class="quote hide-block">
    <div><div>mobile-viewport</div></div>
    <div>
      <div><p>Shared <a href="/shared#_evt-login">link</a></p></div>
      <div><p>Mobile only</p></div>
    </div>
    <div><div>tablet-viewport (variant-a)</div></div>
    <div><div></div><div><p>Tablet only</p></div></div>
    <div><div>desktop-viewport</div></div>
    <div><div></div><div></div></div>
  </div>`;

async function loadBlockArea(html = blockHtml) {
  const area = createTag('div');
  area.innerHTML = `<div>${html}</div>`;
  const block = area.querySelector('.hide-block');
  document.body.append(area);
  await loadArea(area);
  area.remove();
  const cell = (row, col) => block.children[row].children[col];
  return { block, cell };
}

describe('C2 viewport inheritance in decorateSection', () => {
  let meta;

  before(() => {
    setConfig({ codeRoot: '/libs', locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
  });

  afterEach(() => {
    meta?.remove();
    meta = null;
    delete window.adobeIMS;
  });

  const enableC2 = () => {
    meta = createTag('meta', { name: 'foundation', content: 'c2' });
    document.head.append(meta);
  };

  it('fills empty cells with raw clones that get decorated on their own', async () => {
    enableC2();
    window.adobeIMS = { signIn: sinon.spy() };
    const { block, cell } = await loadBlockArea(blockHtml.replace('<div><div></div><div></div></div>', '<div><div id="keep"></div><div></div></div>'));

    const links = [cell(1, 0), cell(3, 0), cell(5, 0)].map((c) => c.querySelector('a'));
    expect(block.children.length).to.equal(6);
    expect(cell(5, 0).id).to.equal('keep');
    expect(cell(3, 0).textContent).to.equal('Shared link');
    expect(cell(3, 1).textContent).to.equal('Tablet only');
    expect(cell(5, 0).textContent).to.equal('Shared link');
    expect(cell(5, 1).textContent).to.equal('Tablet only');
    expect(new Set(links).size).to.equal(3);

    // A late cloneNode would copy the cleaned href but not the click listener
    block.addEventListener('click', (e) => e.preventDefault());
    links.forEach((a) => {
      expect(a.href.includes('#_evt-login')).to.be.false;
      a.click();
    });
    expect(window.adobeIMS.signIn.callCount).to.equal(3);
  });

  it('fills every empty cell of every row and keeps authored cells', async () => {
    enableC2();
    const { cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>mA</p></div><div><p>mB</p></div></div>
        <div><div><p>mC</p></div><div><p>mD</p></div></div>
        <div><div>tablet-viewport</div></div>
        <div><div></div><div><p>tB</p></div></div>
        <div><div></div><div></div></div>
      </div>`);

    expect([cell(4, 0), cell(4, 1), cell(5, 0), cell(5, 1)].map((c) => c.textContent))
      .to.deep.equal(['mA', 'tB', 'mC', 'mD']);
  });

  it('does not skip an empty middle viewport when inheriting', async () => {
    enableC2();
    const { block, cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>A</p></div><div><p>B</p></div></div>
        <div><div>tablet-viewport</div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div><div></div></div>
      </div>`);

    expect(block.children.length).to.equal(5);
    expect([cell(4, 0), cell(4, 1)].map((c) => c.innerHTML)).to.deep.equal(['', '']);
  });

  it('runs on any block whose first row is the mobile delimiter', async () => {
    enableC2();
    const { cell } = await loadBlockArea(`
      <div class="any-block hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div></div>
      </div>`);

    expect(cell(3, 0).textContent).to.equal('m0');
  });

  it('ignores multi-cell keyword rows and rows without cells', async () => {
    enableC2();
    const { block, cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div><div><p>m1</p></div></div>
        <div></div>
        <div><div>desktop-viewport</div><div>x</div></div>
        <div><div></div><div></div></div>
      </div>`);

    expect(block.children.length).to.equal(5);
    expect(cell(4, 0).innerHTML).to.equal('');
    expect(cell(4, 1).innerHTML).to.equal('');
  });

  it('skips blocks whose first row is not the mobile delimiter', async () => {
    enableC2();
    const { cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div><p>Intro</p></div></div>
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div></div>
      </div>`);

    expect(cell(4, 0).innerHTML).to.equal('');
  });

  it('runs on blocks whose first row is the mobile delimiter after a mep-lingo row', async () => {
    enableC2();
    const { block } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mep-lingo</div><div><a href="/fragments/lingo">swap</a></div></div>
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div></div>
      </div>`);

    expect(block.lastElementChild.textContent).to.equal('m0');
  });

  it('recognizes a delimiter whose variants wrap onto a second line', async () => {
    enableC2();
    const { block, cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div></div>
        <div><div><p>tablet-viewport (title-3,</p>
          <p>body-lg)</p></div></div>
        <div><div><p>t0</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div></div>
      </div>`);

    expect(block.children.length).to.equal(6);
    expect(cell(5, 0).textContent).to.equal('t0');
  });

  it('copies text that only starts with a viewport keyword into a single-cell row', async () => {
    enableC2();
    const { block, cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><h3>Desktop benefits</h3></div><div><p>m1</p></div></div>
        <div><div>tablet-viewport</div></div>
        <div><div></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div><p>d0</p></div></div>
      </div>`);

    expect(block.children.length).to.equal(6);
    expect(cell(3, 0).textContent).to.equal('Desktop benefits');
    expect(cell(5, 0).textContent).to.equal('d0');
  });

  it('still copies keyword-like text from a single-cell row', async () => {
    enableC2();
    const { block, cell } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><h3>Mobile apps</h3></div></div>
        <div><div>tablet-viewport</div></div>
        <div><div></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div></div>
      </div>`);

    expect(block.children.length).to.equal(6);
    expect(cell(3, 0).textContent).to.equal('Mobile apps');
    expect(cell(5, 0).textContent).to.equal('Mobile apps');
  });

  it('does nothing on non-C2 pages', async () => {
    const { cell } = await loadBlockArea();

    expect(cell(3, 0).innerHTML).to.equal('');
    expect(cell(5, 1).innerHTML).to.equal('');
  });

  it('ignores mep-lingo rows so they are not copied and do not shift row pairing', async () => {
    enableC2();
    const { block } = await loadBlockArea(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div><p>m0</p></div><div><p>m1</p></div></div>
        <div><div>mep-lingo</div><div><a href="/fragments/lingo">swap</a></div></div>
        <div><div><p>Extra A</p></div><div><p>Extra B</p></div></div>
        <div><div>tablet-viewport</div></div>
        <div><div><p>t0</p></div><div><p>t1</p></div></div>
        <div><div></div><div></div></div>
      </div>`);

    const rows = [...block.children];
    expect(rows.filter((r) => r.children[0]?.textContent.trim() === 'mep-lingo').length).to.be.at.most(1);
    expect(rows.at(-1).textContent).to.equal('Extra AExtra B');
  });

  const mepFrag = '<div><div class="frag"><div><div><p><a href="/shared#_evt-login">Frag link</a></p></div><div><p>Frag text</p></div></div></div></div>';
  const mepRow = '<div data-mep-replace-type="row"><div><a href="/fragments/mep">frag</a></div></div>';
  const mobileRow = /<div>\s*<div><p>Shared[\s\S]*?Mobile only<\/p><\/div>\s*<\/div>/;

  async function loadWithFrag(html, frag) {
    enableC2();
    const fetchStub = sinon.stub(window, 'fetch').callThrough();
    fetchStub.withArgs(sinon.match(/\/fragments\/mep\.plain\.html/))
      .callsFake(() => Promise.resolve(new Response(frag)));
    try {
      return await loadBlockArea(html);
    } finally {
      fetchStub.restore();
    }
  }

  async function loadMepArea(html, frag = mepFrag) {
    window.adobeIMS = { signIn: sinon.spy() };
    const area = await loadWithFrag(html, frag);
    const { block, cell } = area;
    const links = [cell(1, 0), cell(3, 0), cell(5, 0)].map((c) => c.querySelector('a'));
    expect(block.children.length).to.equal(6);
    expect(block.querySelector('[data-mep-replace-type], .frag')).to.not.exist;
    links.forEach((a) => expect(a.textContent).to.equal('Frag link'));
    expect(new Set(links).size).to.equal(3);
    block.addEventListener('click', (e) => e.preventDefault());
    links.forEach((a) => a.click());
    expect(window.adobeIMS.signIn.callCount).to.equal(3);
    return area;
  }

  it('resolves a MEP cell fragment separately in every inherited cell', async () => {
    const { cell } = await loadMepArea(blockHtml.replace(
      '<div><p>Shared <a href="/shared#_evt-login">link</a></p></div>',
      '<div data-mep-replace-type="cell"><a href="/fragments/mep">frag</a></div>',
    ), mepFrag.replace('<div><p>Frag text</p></div>', ''));
    expect(cell(3, 1).textContent).to.equal('Tablet only');
  });

  it('resolves a MEP row fragment separately in every empty inherited row', async () => {
    const { cell } = await loadMepArea(blockHtml.replace(mobileRow, mepRow)
      .replace('<div><div></div><div><p>Tablet only</p></div></div>', '<div><div></div><div></div></div>'));
    expect(cell(3, 1).textContent).to.equal('Frag text');
    expect(cell(5, 1).textContent).to.equal('Frag text');
  });

  it('fills a partly authored row from the resolved MEP row fragment', async () => {
    const { cell } = await loadMepArea(blockHtml.replace(mobileRow, mepRow));
    expect(cell(1, 1).textContent).to.equal('Frag text');
    expect(cell(3, 1).textContent).to.equal('Tablet only');
    expect(cell(5, 1).textContent).to.equal('Tablet only');
  });

  it('does not overwrite a row holding only bare text with a MEP row fragment', async () => {
    const { block } = await loadWithFrag(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        ${mepRow}
        <div><div>tablet-viewport</div></div>
        <div>Bare text</div>
      </div>`, mepFrag);

    expect([...block.children].map((r) => r.textContent.trim()))
      .to.deep.equal(['mobile-viewport', 'Frag linkFrag text', 'tablet-viewport', 'Bare text']);
  });

  it('keeps authored rows aligned when a multi-row MEP fragment is copied above them', async () => {
    const { block } = await loadWithFrag(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        ${mepRow}
        <div><div><p>M2a</p></div><div><p>M2b</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div><div></div></div>
        <div><div></div><div><p>Desktop B</p></div></div>
      </div>`, '<div><div class="frag"><div><div><p>R1a</p></div><div><p>R1b</p></div></div><div><div><p>R2a</p></div><div><p>R2b</p></div></div></div></div>');

    expect([...block.children].map((r) => r.textContent.trim())).to.deep.equal([
      'mobile-viewport', 'R1aR1b', 'R2aR2b', 'M2aM2b',
      'desktop-viewport', 'R1aR1b', 'R2aR2b', 'M2aDesktop B',
    ]);
  });

  it('fills an inline fragment block before its nested fragments load', async () => {
    enableC2();
    window.adobeIMS = { signIn: sinon.spy() };
    const frag = `<div><div class="quote hide-block">
      <div><div>mobile-viewport</div></div>
      <div><div><p>Shared <a href="/shared#_evt-login">link</a></p></div><div><p><a href="/fragments/nested">nested</a></p></div></div>
      <div><div>tablet-viewport</div></div>
      <div><div></div><div><p>Tablet only</p></div></div>
      <div><div>desktop-viewport</div></div>
      <div><div></div><div><p>Desktop only</p></div></div>
    </div></div>`;
    const fetchStub = sinon.stub(window, 'fetch').callThrough();
    fetchStub.withArgs(sinon.match(/\/fragments\/inline-vp\.plain\.html/))
      .callsFake(() => Promise.resolve(new Response(frag)));
    fetchStub.withArgs(sinon.match(/\/fragments\/nested\.plain\.html/))
      .callsFake(() => Promise.resolve(new Response('<div><p>Nested</p></div>')));

    const area = createTag('div');
    area.innerHTML = '<div><div><a href="/fragments/inline-vp#_inline">frag</a></div></div>';
    const added = [];
    const observer = new MutationObserver((records) => records
      .forEach((r) => added.push(...r.addedNodes)));
    observer.observe(area, { childList: true, subtree: true });
    document.body.append(area);
    try {
      await loadArea(area);
    } finally {
      fetchStub.restore();
      observer.disconnect();
      area.remove();
    }
    added.push(...observer.takeRecords().flatMap((r) => [...r.addedNodes]));

    const block = added.find((node) => node.classList?.contains('quote'));
    const links = [1, 3, 5].map((row) => block.children[row].children[0].querySelector('a'));
    expect(links.map((a) => a?.textContent)).to.deep.equal(['link', 'link', 'link']);
    expect(new Set(links).size).to.equal(3);
    block.addEventListener('click', (e) => e.preventDefault());
    links.forEach((a) => a.click());
    expect(window.adobeIMS.signIn.callCount).to.equal(3);
  });

  it('keeps authored cells aligned when a multi-cell MEP fragment is copied before them', async () => {
    const { block } = await loadWithFrag(`
      <div class="quote hide-block">
        <div><div>mobile-viewport</div></div>
        <div><div data-mep-replace-type="cell"><a href="/fragments/mep">frag</a></div><div><p>Mobile B</p></div></div>
        <div><div>desktop-viewport</div></div>
        <div><div></div><div><p>Desktop B</p></div></div>
      </div>`, '<div><div class="frag"><div><div><p>Label</p></div><div><p>Frag B</p></div></div></div></div>');

    expect([...block.children[3].children].map((c) => c.textContent.trim()))
      .to.deep.equal(['Label', 'Frag B', 'Desktop B']);
  });
});
