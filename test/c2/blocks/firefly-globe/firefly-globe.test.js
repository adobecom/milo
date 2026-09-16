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
  fetchFireflyAssets,
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
describe('firefly-globe: parseAuthoredContent — positional rows', () => {
  // Row layout: [cardsRow, hintTextRow, a11yRow, pullQuoteRow]
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

  it('parses "categoryId || cgenId || ctaLabel" from the cards cell', () => {
    const el = makeEl(`
      ${makeRow('<div><p>cat-123 || promo-9 || Open in Firefly</p></div>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
    `);
    const { categoryId, cgenId, ctaLabel, fragmentHref } = parseAuthoredContent(el);
    expect(categoryId).to.equal('cat-123');
    expect(cgenId).to.equal('promo-9');
    expect(ctaLabel).to.equal('Open in Firefly');
    expect(fragmentHref).to.be.null;
  });

  it('categoryId is null for a fragment-link cards row', () => {
    const { categoryId } = parseAuthoredContent(makeBlock());
    expect(categoryId).to.be.null;
  });

  it('parses the optional pull-quote row', () => {
    const el = makeEl(`
      ${makeRow('<a href="https://x.com/c#_dnb">Cards</a>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
      ${makeRow('<blockquote>A quote</blockquote><p>Name</p><p>Role</p>')}
    `);
    const { pullQuote } = parseAuthoredContent(el);
    expect(pullQuote).to.deep.equal({ quote: 'A quote', name: 'Name', role: 'Role' });
  });

  it('pullQuote is null without a fourth row', () => {
    expect(parseAuthoredContent(makeBlock()).pullQuote).to.be.null;
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

  it('drops the pullquote-pin when no pull quote is authored', () => {
    expect(el.querySelector('.firefly-globe-pullquote-pin')).to.be.null;
  });

  it('renders the pull quote when authored', () => {
    const other = document.createElement('div');
    buildGlobeDom(other, LABELS, {
      touchHint: TOUCH_HINT,
      pullQuote: { quote: 'Q', name: 'N', role: 'R' },
    });
    expect(other.querySelector('.firefly-globe-pullquote-quote').textContent).to.equal('Q');
    expect(other.querySelector('.firefly-globe-pullquote-name').textContent).to.equal('N');
    expect(other.querySelector('.firefly-globe-pullquote-role').textContent).to.equal('R');
  });

  it('renders the CTA label into the modal CTA', () => {
    const other = document.createElement('div');
    buildGlobeDom(other, LABELS, { touchHint: TOUCH_HINT, ctaLabel: 'Open <it>' });
    const cta = other.querySelector('.firefly-globe-modal-cta');
    expect(cta.textContent).to.equal('Open <it>');
    expect(cta.hidden).to.be.true;
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
            <p><em>A prompt</em></p>
            <p><strong>Artist One</strong></p>
          </div>
        </div>
      </body></html>
    `;
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, text: async () => html });
    const cards = await fetchFragmentCards('https://example.com/cards');
    expect(cards).to.be.an('array').with.length(1);
    expect(cards[0].name).to.equal('Artist One');
    expect(cards[0].prompt).to.equal('A prompt');
    expect(cards[0].alt).to.equal('Artist 1');
    expect(cards[0].img).to.include('media_card1.jpg');
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: fetchFireflyAssets', () => {
  let fetchStub;

  afterEach(() => {
    fetchStub?.restore();
  });

  const asset = (over = {}) => ({
    urn: 'urn:aaid:sc:1',
    _links: { rendition: { href: 'https://cdn.cp.adobe.io/x/{format}/{dimension}/{size}', max_width: 2048 } },
    custom: { input: { 'firefly#prompts': { 'en-US': 'English', 'fr-FR': 'Français', 'de-DE': 'Deutsch' } } },
    machine_tags: ['modelId:firefly', 'modelVersionName:Firefly Image 4'],
    ...over,
  });

  function stubAssets(assets) {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ _embedded: { assets } }),
    });
  }

  it('returns null when the request fails', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false });
    expect(await fetchFireflyAssets('cat')).to.be.null;
  });

  it('maps an asset to a card with a capped rendition URL and model tags', async () => {
    stubAssets([asset()]);
    const [card] = await fetchFireflyAssets('cat', 'en-US');
    expect(card.img).to.equal('https://cdn.cp.adobe.io/x/jpg/width/1024');
    expect(card.modelId).to.equal('firefly');
    expect(card.modelVersionName).to.equal('Firefly Image 4');
    expect(card.fireflyUrl).to.include('id=urn:aaid:sc:1');
    expect(card.crossOrigin).to.equal('anonymous');
  });

  it('localizes the prompt: exact, language-only, then en-US', async () => {
    stubAssets([asset()]);
    expect((await fetchFireflyAssets('cat', 'fr-FR'))[0].prompt).to.equal('Français');
    fetchStub.restore(); stubAssets([asset()]);
    expect((await fetchFireflyAssets('cat', 'de-AT'))[0].prompt).to.equal('Deutsch');
    fetchStub.restore(); stubAssets([asset()]);
    expect((await fetchFireflyAssets('cat', 'ja-JP'))[0].prompt).to.equal('English');
    fetchStub.restore(); stubAssets([asset()]);
    expect((await fetchFireflyAssets('cat'))[0].prompt).to.equal('English');
  });

  it('uses the prompt as the alt fallback', async () => {
    stubAssets([asset()]);
    expect((await fetchFireflyAssets('cat', 'en-US'))[0].alt).to.equal('English');
  });

  it('skips assets without a rendition', async () => {
    stubAssets([asset({ _links: {} }), asset()]);
    expect(await fetchFireflyAssets('cat')).to.have.length(1);
  });
});

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: frame state', () => {
  it('createFrame initialises dtScale=1 with a monomorphic shape', () => {
    const frame = TL.createFrame();
    const expected = {
      scrollY: 0,
      scrollVel: 0,
      dtScale: 1,
      entryT: 0,
      scrollT: 0,
      sphereFormed: false,
      interactive: false,
      activeCamera: null,
      sphereRotActive: false,
      sphGroupZ: 0,
    };
    expect(frame).to.deep.equal(expected);
  });

  const derive = (scrollY, extra = {}) => TL.deriveFrame(TL.createFrame(), {
    ...TL.createFrameInput(),
    scrollY,
    blockDocTop: 1000,
    blockHeight: 2000,
    viewportH: 800,
    ...extra,
  });

  it('entryT runs over the viewport before the block top and reaches 1 at the pin', () => {
    expect(derive(200).entryT).to.equal(0);
    expect(derive(600).entryT).to.be.closeTo(0.5, 1e-9);
    expect(derive(1000).entryT).to.equal(1);
    expect(derive(999).sphereFormed).to.equal(false);
    expect(derive(1000).sphereFormed).to.equal(true);
  });

  it('interactive opens at SPHERE_INTERACTIVE_T of the entry, before the pin', () => {
    const at = (entryT) => derive(1000 - 800 * (1 - entryT));
    expect(at(0).interactive).to.equal(false);
    expect(at(TL.SPHERE_INTERACTIVE_T).interactive).to.equal(true);
    expect(at(0.5).interactive).to.equal(true);
    expect(at(0.5).sphereFormed).to.equal(false);
  });

  it('scrollT is 0 at the pin and 1 when the block bottom passes the viewport top', () => {
    expect(derive(600).scrollT).to.equal(0);
    expect(derive(1000).scrollT).to.equal(0);
    expect(derive(2000).scrollT).to.be.closeTo(0.5, 1e-9);
    expect(derive(3000).scrollT).to.equal(1);
    expect(derive(4000).scrollT).to.equal(1);
  });

  it('scrollVel is the per-frame delta scaled by dtScale', () => {
    const f = derive(1300, { prevScrollY: 1240, now: 33.333, prevNow: 0 });
    expect(f.dtScale).to.equal(1);
    expect(f.scrollVel).to.equal(60);
    const g = derive(1300, { prevScrollY: 1240, now: 33.333, prevNow: 0.0001 });
    expect(g.dtScale).to.be.closeTo(2, 1e-3);
    expect(g.scrollVel).to.be.closeTo(30, 1e-1);
  });

  it('reduced motion pins the input to the formed position', () => {
    const f = derive(200, { reducedMotion: true, prevScrollY: 5000 });
    expect(f.scrollY).to.equal(1000);
    expect(f.entryT).to.equal(1);
    expect(f.scrollT).to.equal(0);
    expect(f.sphereFormed).to.equal(true);
    expect(f.scrollVel).to.equal(0);
  });

  it('camZAtTravelT / travelTAtCamZ are inverses', () => {
    for (const t of [0, 0.1, 0.35, 0.5, 0.9, 1]) {
      const z = TL.camZAtTravelT(t, 70, -14);
      expect(TL.travelTAtCamZ(z, 70, -14)).to.be.closeTo(t, 1e-9);
    }
    expect(TL.travelTAtCamZ(200, 70, -14)).to.equal(0);
    expect(TL.travelTAtCamZ(-50, 70, -14)).to.equal(1);
  });

  it('dtScale clamps are sane', () => {
    expect(TL.DT_SCALE_MIN).to.be.below(1);
    expect(TL.DT_SCALE_MAX).to.be.above(1);
  });

  it('FRAME_MS is ~16.67ms (60fps target)', () => {
    expect(TL.FRAME_MS).to.be.closeTo(16.667, 0.001);
  });
});
