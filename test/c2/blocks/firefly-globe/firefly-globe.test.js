import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import * as TL from '../../../../libs/c2/blocks/firefly-globe/src/utils.js';
import {
  escapeHtml,
  optimizeImgUrl,
  scatterCards,
  parseAuthoredContent,
  buildGlobeDom,
  fetchFragmentCards,
} from '../../../../libs/c2/blocks/firefly-globe/src/authoring.js';

// Helpers
function makeEl(innerHTML) {
  const el = document.createElement('div');
  el.innerHTML = innerHTML;
  return el;
}

function makeRow(content = '') {
  return `<div>${content}</div>`;
}

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: escapeHtml', () => {
  it('escapes all five special chars', () => {
    expect(escapeHtml('& < > " \'')).to.equal('&amp; &lt; &gt; &quot; &#39;');
  });

  it('passes safe strings through untouched', () => {
    expect(escapeHtml('hello world')).to.equal('hello world');
  });

  it('handles null/undefined safely', () => {
    expect(escapeHtml(null)).to.equal('');
    expect(escapeHtml(undefined)).to.equal('');
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: optimizeImgUrl', () => {
  it('appends width and webply format to media_ URLs', () => {
    const src = 'https://example.aem.live/media_abc123def.png';
    const result = optimizeImgUrl(src, 512);
    expect(result).to.include('width=512');
    expect(result).to.include('format=webply');
  });

  it('appends height param when axis=height', () => {
    const src = 'https://example.aem.live/media_abc123.jpg';
    const result = optimizeImgUrl(src, 256, 'height');
    expect(result).to.include('height=256');
    expect(result).to.not.include('width=');
  });

  it('passes non-media URLs through unchanged', () => {
    const src = 'https://example.com/assets/logo.svg';
    expect(optimizeImgUrl(src, 100)).to.equal(src);
  });

  it('returns the src as-is when src is falsy', () => {
    expect(optimizeImgUrl('', 100)).to.equal('');
    expect(optimizeImgUrl(null, 100)).to.equal(null);
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: scatterCards', () => {
  const INPUT = [
    { img: 'a.jpg', name: 'Alice' },
    { img: 'b.jpg', name: 'Bob' },
    { img: 'c.jpg', name: 'Carol' },
    { img: 'd.jpg', name: 'Dave' },
  ];

  it('returns the same number of cards', () => {
    expect(scatterCards(INPUT)).to.have.length(INPUT.length);
  });

  it('stamps authoredIndex on each card', () => {
    const out = scatterCards(INPUT);
    const indices = out.map((c) => c.authoredIndex).sort((a, b) => a - b);
    expect(indices).to.deep.equal([0, 1, 2, 3]);
  });

  it('is deterministic: same input always produces same order', () => {
    const a = scatterCards(INPUT);
    const b = scatterCards(INPUT);
    expect(a.map((c) => c.authoredIndex)).to.deep.equal(b.map((c) => c.authoredIndex));
  });

  it('does not mutate the input array', () => {
    const copy = [...INPUT];
    scatterCards(INPUT);
    expect(INPUT).to.deep.equal(copy);
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: parseAuthoredContent — 3-row structure', () => {
  // Row layout: [cardsRow, hintTextRow, a11yRow]
  function makeBlock({ fragmentUrl = 'https://example.com/cards', hintCell1 = '', hintCell2 = 'Drag', a11y = '' } = {}) {
    return makeEl(`
      ${makeRow(`<a href="${fragmentUrl}#_dnb">Cards</a>`)}
      ${makeRow(`<div><p>${hintCell1}</p></div><div><p>${hintCell2}</p></div>`)}
      ${makeRow(a11y)}
    `);
  }

  it('parses fragmentHref from first row', () => {
    const el = makeBlock({ fragmentUrl: 'https://example.com/gallery' });
    const { fragmentHref } = parseAuthoredContent(el);
    // Hash stripped
    expect(fragmentHref).to.equal('https://example.com/gallery');
  });

  it('parses hintText from cell 2 of hintTextRow', () => {
    const el = makeBlock({ hintCell2: 'Click & Drag' });
    const { hintText } = parseAuthoredContent(el);
    expect(hintText).to.equal('Click & Drag');
  });

  it('uses default hintText when cell is empty', () => {
    const el = makeBlock({ hintCell2: '' });
    const { hintText } = parseAuthoredContent(el);
    expect(hintText).to.equal('Click & Drag');
  });

  it('returns default instructions when a11yRow is empty', () => {
    const el = makeBlock({ a11y: '' });
    const { instructions } = parseAuthoredContent(el);
    expect(instructions).to.equal('Press Enter to enter the gallery, then Tab through the images.');
  });

  it('parses custom instructions from a11yRow', () => {
    const el = makeBlock({ a11y: 'Enter gallery || Rotate left' });
    const { instructions, labels } = parseAuthoredContent(el);
    expect(instructions).to.equal('Enter gallery');
    expect(labels.rotateLeft).to.equal('Rotate left');
  });

  it('does not crash on a 5-row DOM (old authoring format)', () => {
    // Old format had arc-copy as row 1 and pullquote as row 5.
    // The new parser ignores extra rows gracefully.
    const el = makeEl(`
      ${makeRow('<h2>Arc Title</h2>')}
      ${makeRow('<a href="https://x.com/c">Cards</a>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
      ${makeRow('<blockquote>A quote</blockquote>')}
    `);
    // Should not throw; fragmentHref comes from row 1 of old format (arc-copy), which has no link.
    expect(() => parseAuthoredContent(el)).not.to.throw();
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: buildGlobeDom', () => {
  const LABELS = {
    pauseSpin: 'Pause',
    resumeSpin: 'Resume',
    rotateLeft: 'Left',
    rotateRight: 'Right',
    prevCard: 'Prev',
    nextCard: 'Next',
    closeBtn: 'Close',
    cardLabel: (i, n) => `${i} of ${n}`,
  };
  const TOUCH_HINT = { paras: [], text: 'Drag to rotate' };

  let el;
  beforeEach(() => {
    el = document.createElement('div');
    buildGlobeDom(el, LABELS, { touchHint: TOUCH_HINT });
  });

  it('creates .firefly-globe-world', () => {
    expect(el.querySelector('.firefly-globe-world')).to.exist;
  });

  it('creates the WebGL canvas', () => {
    expect(el.querySelector('.firefly-globe-canvas')).to.exist;
  });

  it('creates the controls container', () => {
    expect(el.querySelector('.firefly-globe-controls')).to.exist;
  });

  it('creates the modal backdrop', () => {
    expect(el.querySelector('.firefly-globe-modal')).to.exist;
  });

  it('creates the modal chrome dialog', () => {
    expect(el.querySelector('.firefly-globe-modal-chrome')).to.exist;
  });

  it('does NOT create arc-copy element', () => {
    expect(el.querySelector('.firefly-globe-arc-copy')).to.be.null;
  });

  it('does NOT create pullquote-pin element', () => {
    expect(el.querySelector('.firefly-globe-pullquote-pin')).to.be.null;
  });

  it('sets hint text content', () => {
    const hintEl = el.querySelector('.firefly-globe-hint-text');
    expect(hintEl).to.exist;
    expect(hintEl.textContent).to.equal('Drag to rotate');
  });

  it('returns a unique numeric gid on each call', () => {
    const el2 = document.createElement('div');
    const gid1 = buildGlobeDom(el, LABELS, { touchHint: TOUCH_HINT });
    const gid2 = buildGlobeDom(el2, LABELS, { touchHint: TOUCH_HINT });
    expect(gid1).to.be.a('number');
    expect(gid2).to.be.a('number');
    expect(gid2).to.be.greaterThan(gid1);
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: fetchFragmentCards', () => {
  let fetchStub;

  afterEach(() => {
    fetchStub?.restore();
  });

  it('returns null when fetch fails', async () => {
    fetchStub = sinon.stub(window, 'fetch').rejects(new Error('network'));
    const result = await fetchFragmentCards('https://example.com/cards');
    expect(result).to.be.null;
  });

  it('returns null when response is not ok', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false });
    const result = await fetchFragmentCards('https://example.com/cards');
    expect(result).to.be.null;
  });

  it('returns null when fragment has no parseable cards', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => '<html><body><div><div><p>No image here</p></div></div></body></html>',
    });
    const result = await fetchFragmentCards('https://example.com/cards');
    expect(result).to.be.null;
  });

  it('parses cards from well-formed fragment HTML', async () => {
    const html = `
      <html><body>
        <div>
          <div>
            <p><img src="https://example.aem.live/media_card1.jpg" alt="Artist 1"></p>
            <h2>Artist One</h2>
            <p><em>Illustrator</em></p>
          </div>
        </div>
      </body></html>
    `;
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, text: async () => html });
    const cards = await fetchFragmentCards('https://example.com/cards');
    expect(cards).to.be.an('array').with.length(1);
    expect(cards[0].name).to.equal('Artist One');
    expect(cards[0].role).to.equal('Illustrator');
    expect(cards[0].img).to.include('media_card1.jpg');
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: frame state', () => {
  it('createFrame initialises sphereFormT=1 and zoomT=0', () => {
    const frame = TL.createFrame();
    expect(frame.sphereFormT).to.equal(1);
    expect(frame.zoomT).to.equal(0);
  });

  it('createFrame initialises dtScale=1', () => {
    const frame = TL.createFrame();
    expect(frame.dtScale).to.equal(1);
  });

  it('globe is always considered formed (sphereFormT >= SPHERE_INTERACTIVE_T)', () => {
    const frame = TL.createFrame();
    expect(frame.sphereFormT).to.be.at.least(TL.SPHERE_INTERACTIVE_T);
  });

  it('FRAME_MS is ~16.67ms (60fps target)', () => {
    expect(TL.FRAME_MS).to.be.closeTo(16.667, 0.001);
  });
});
