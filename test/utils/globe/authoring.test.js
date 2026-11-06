import { expect } from '@esm-bundle/chai';
import {
  escapeHtml, scatterCards, renderParagraphs, plainQuote, hangParagraphs, onRemoved,
} from '../../../libs/utils/globe/authoring.js';

describe('onRemoved', () => {
  const flush = () => new Promise((resolve) => { setTimeout(resolve); });
  let calls;
  let wrapper;
  let el;

  beforeEach(() => {
    calls = 0;
    wrapper = document.createElement('section');
    el = document.createElement('div');
    wrapper.append(el);
    document.body.append(wrapper);
    onRemoved(el, () => { calls += 1; });
  });

  afterEach(() => wrapper.remove());

  it('fires when the element itself is removed', async () => {
    el.remove();
    await flush();
    expect(calls).to.equal(1);
  });

  it('fires when an ancestor is removed', async () => {
    wrapper.remove();
    await flush();
    expect(calls).to.equal(1);
  });

  it('ignores unrelated mutations and a move within the document', async () => {
    const other = document.createElement('div');
    document.body.append(other);
    other.remove();
    document.body.append(el);
    await flush();
    expect(calls).to.equal(0);
    el.remove();
  });

  it('fires only once', async () => {
    el.remove();
    await flush();
    document.body.append(el);
    el.remove();
    await flush();
    expect(calls).to.equal(1);
  });
});

function makeEl(innerHTML) {
  const el = document.createElement('div');
  el.innerHTML = innerHTML;
  return el;
}

describe('escapeHtml', () => {
  it('escapes HTML-significant characters and nullish values', () => {
    expect(escapeHtml('<a href="x">Tom & Jerry\'s</a>'))
      .to.equal('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;');
    expect(escapeHtml('hello world')).to.equal('hello world');
    expect(escapeHtml(null)).to.equal('');
    expect(escapeHtml(undefined)).to.equal('');
    expect(escapeHtml(42)).to.equal('42');
  });
});

describe('scatterCards', () => {
  it('scatters cards deterministically without mutating the input', () => {
    const cards = ['a', 'b', 'c', 'd', 'e', 'f'].map((name) => ({ name }));
    const snapshot = JSON.parse(JSON.stringify(cards));
    const first = scatterCards(cards);
    const second = scatterCards(cards);
    expect(first.map((c) => c.authoredIndex)).to.deep.equal([2, 0, 4, 5, 1, 3]);
    expect(first.map((c) => c.name)).to.deep.equal(['c', 'a', 'e', 'f', 'b', 'd']);
    expect(second).to.deep.equal(first);
    expect(cards).to.deep.equal(snapshot);
    expect(first[0]).to.not.equal(cards[2]);
    expect(scatterCards([])).to.deep.equal([]);
  });
});

describe('renderParagraphs', () => {
  it('replaces container children with authored paragraphs', () => {
    const container = document.createElement('div');
    container.innerHTML = '<span>old</span>';
    const p = document.createElement('p');
    p.textContent = 'new';
    renderParagraphs(container, [p]);
    expect(container.children).to.have.length(1);
    expect(container.firstElementChild).to.equal(p);
    expect(() => renderParagraphs(null, [p])).to.not.throw();
  });
});

describe('plainQuote and hangParagraphs', () => {
  let host;

  function makeQuote(text, pad = 40) {
    host = makeEl(`<div class="globe-pullquote" style="width:400px;padding-inline:${pad}px">
      <blockquote class="globe-pullquote-quote"
        style="font:16px/1.2 monospace;margin:0">${text}</blockquote></div>`);
    document.body.append(host);
    return host.querySelector('.globe-pullquote-quote');
  }

  afterEach(() => {
    host?.remove();
    host = null;
  });

  it('restores the authored text on every call, whatever the DOM became', () => {
    const quoteEl = makeQuote('alpha beta gamma');
    expect(plainQuote(quoteEl)).to.equal('alpha beta gamma');
    quoteEl.innerHTML = '<span>later markup</span>';
    expect(plainQuote(quoteEl)).to.equal('alpha beta gamma');
    expect(quoteEl.textContent).to.equal('alpha beta gamma');
  });

  it('hangs an opening quote mark with a negative indent, leaving the DOM alone', () => {
    const quoteEl = makeQuote('\u201Calpha beta\u201D');
    plainQuote(quoteEl);
    const indent = quoteEl.style.textIndent;
    plainQuote(quoteEl);
    expect(parseFloat(indent)).to.be.below(0);
    expect(quoteEl.style.textIndent).to.equal(indent);
    expect(quoteEl.children).to.have.length(0);
    expect(quoteEl.textContent).to.equal('\u201Calpha beta\u201D');
  });

  it('keeps the mark inline when there is no gutter to hang it in', () => {
    const quoteEl = makeQuote('\u201Calpha\u201D', 0);
    plainQuote(quoteEl);
    expect(quoteEl.style.textIndent).to.equal('');
  });

  it('still hangs the mark when the element is not laid out yet', () => {
    const quoteEl = makeQuote('\u201Calpha\u201D');
    host.style.display = 'none';
    plainQuote(quoteEl);
    expect(parseFloat(quoteEl.style.textIndent)).to.be.below(0);
  });

  it('keeps inline markup and stays stable when hanging a paragraph twice', () => {
    makeQuote('x');
    const box = makeEl(`<div style="padding-inline-start:40px">
      <p style="font:16px monospace;margin:0">\u201C<a href="#a">alpha</a> beta</p></div>`).firstElementChild;
    const para = box.querySelector('p');
    host.append(box);
    hangParagraphs(box);
    const indent = para.style.textIndent;
    hangParagraphs(box);
    expect(parseFloat(indent)).to.be.below(0);
    expect(para.style.textIndent).to.equal(indent);
    expect(para.querySelector('a').textContent).to.equal('alpha');
  });

  it('hangs again once a loading web font has landed', async () => {
    const quoteEl = makeQuote('\u201Calpha\u201D');
    let resolveReady;
    const ready = new Promise((res) => { resolveReady = res; });
    Object.defineProperty(document.fonts, 'status', { value: 'loading', configurable: true });
    Object.defineProperty(document.fonts, 'ready', { value: ready, configurable: true });
    try {
      plainQuote(quoteEl);
      quoteEl.style.textIndent = '';
      Object.defineProperty(document.fonts, 'status', { value: 'loaded', configurable: true });
      resolveReady();
      await ready;
      await Promise.resolve();
      expect(parseFloat(quoteEl.style.textIndent)).to.be.below(0);
    } finally {
      delete document.fonts.status;
      delete document.fonts.ready;
    }
  });

  it('does not let a pending font re-hang undo a newer gutter', async () => {
    const quoteEl = makeQuote('\u201Calpha\u201D');
    let resolveReady;
    const ready = new Promise((res) => { resolveReady = res; });
    Object.defineProperty(document.fonts, 'status', { value: 'loading', configurable: true });
    Object.defineProperty(document.fonts, 'ready', { value: ready, configurable: true });
    try {
      plainQuote(quoteEl);
      host.firstElementChild.style.paddingInline = '0px';
      plainQuote(quoteEl);
      expect(quoteEl.style.textIndent).to.equal('');
      Object.defineProperty(document.fonts, 'status', { value: 'loaded', configurable: true });
      resolveReady();
      await ready;
      await Promise.resolve();
      expect(quoteEl.style.textIndent).to.equal('');
    } finally {
      delete document.fonts.status;
      delete document.fonts.ready;
    }
  });

  it('hangs again on the next frame when it was measured before layout', async () => {
    const quoteEl = makeQuote('\u201Calpha\u201D');
    host.style.display = 'none';
    plainQuote(quoteEl);
    quoteEl.style.textIndent = '';
    host.style.display = '';
    await new Promise((res) => { requestAnimationFrame(() => { res(); }); });
    await Promise.resolve();
    expect(parseFloat(quoteEl.style.textIndent)).to.be.below(0);
  });

  it('does not hang centered or vertical text', () => {
    const quoteEl = makeQuote('\u201Calpha\u201D');
    quoteEl.style.textAlign = 'center';
    plainQuote(quoteEl);
    expect(quoteEl.style.textIndent).to.equal('');
    quoteEl.style.textAlign = '';
    quoteEl.style.writingMode = 'vertical-rl';
    plainQuote(quoteEl);
    expect(quoteEl.style.textIndent).to.equal('');
  });

  it('leaves an empty quote empty and ignores a missing one', () => {
    const quoteEl = makeQuote('   ');
    expect(plainQuote(quoteEl)).to.equal('');
    expect(quoteEl.textContent).to.equal('');
    expect(plainQuote(null)).to.equal('');
  });
});
