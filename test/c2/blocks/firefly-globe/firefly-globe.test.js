import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import * as TL from '../../../../libs/c2/blocks/firefly-globe/src/utils.js';
import {
  escapeHtml,
  fireflyRenditionUrl,
  scatterCards,
  parseAuthoredContent,
  buildGlobeDom,
  fetchFireflyAssets,
  layoutQuote,
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
describe('firefly-globe: fireflyRenditionUrl', () => {
  const card = (over = {}) => ({
    renditionHref: 'https://cdn.cp.adobe.io/x/{format}/{dimension}/{size}',
    maxWidth: 600,
    maxHeight: 600,
    ...over,
  });

  it('fills the template as a jpg rendition at the requested width', () => {
    expect(fireflyRenditionUrl(card(), 512))
      .to.equal('https://cdn.cp.adobe.io/x/jpg/width/512');
  });

  it('measures by height when axis=height', () => {
    expect(fireflyRenditionUrl(card(), 256, 'height'))
      .to.equal('https://cdn.cp.adobe.io/x/jpg/height/256');
  });

  it('does not clamp the requested size — the CDN caps at native', () => {
    // The component's true resolution is unknown here (max* describe the preview), so we ask big
    // and let the CDN re-serve native for anything larger.
    expect(fireflyRenditionUrl(card(), 2048)).to.equal('https://cdn.cp.adobe.io/x/jpg/width/2048');
  });

  it('rounds a fractional px request', () => {
    expect(fireflyRenditionUrl(card(), 383.6)).to.equal('https://cdn.cp.adobe.io/x/jpg/width/384');
  });

  it('returns an empty string when there is no rendition template', () => {
    expect(fireflyRenditionUrl({ maxWidth: 600 }, 512)).to.equal('');
    expect(fireflyRenditionUrl(null, 512)).to.equal('');
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
  function makeBlock({ cards = 'cat-123', hintCell1 = '', hintCell2 = 'Drag', a11y = '' } = {}) {
    return makeEl(`
      ${makeRow(`<div><p>${cards}</p></div>`)}
      ${makeRow(`<div><p>${hintCell1}</p></div><div><p>${hintCell2}</p></div>`)}
      ${makeRow(a11y)}
    `);
  }

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

  it('parses "categoryId || machineTag || cgenId || ctaLabel" from the cards cell', () => {
    const el = makeEl(`
      ${makeRow('<div><p>cat-123 || acom_ff_globe_assets || promo-9 || Open in Firefly</p></div>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
    `);
    const { categoryId, machineTag, cgenId, ctaLabel } = parseAuthoredContent(el);
    expect(categoryId).to.equal('cat-123');
    expect(machineTag).to.equal('acom_ff_globe_assets');
    expect(cgenId).to.equal('promo-9');
    expect(ctaLabel).to.equal('Open in Firefly');
  });

  it('machineTag is null when omitted', () => {
    const el = makeEl(`
      ${makeRow('<div><p>cat-123</p></div>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
    `);
    expect(parseAuthoredContent(el).machineTag).to.be.null;
  });

  // Authors can skip the machineTag slot with an empty field and keep the
  // later slots in place: "cat || || cgen || cta" or "cat |||| cgen || cta".
  ['cat-123 || || promo-9 || Open in Firefly', 'cat-123 |||| promo-9 || Open in Firefly']
    .forEach((cards) => {
      it(`treats an empty machineTag slot as none: "${cards}"`, () => {
        const el = makeEl(`
          ${makeRow(`<div><p>${cards}</p></div>`)}
          ${makeRow('<div></div><div><p>Drag</p></div>')}
          ${makeRow('')}
        `);
        const { categoryId, machineTag, cgenId, ctaLabel } = parseAuthoredContent(el);
        expect(categoryId).to.equal('cat-123');
        expect(machineTag).to.be.null;
        expect(cgenId).to.equal('promo-9');
        expect(ctaLabel).to.equal('Open in Firefly');
      });
    });

  it('categoryId is null when the cards cell is empty', () => {
    const { categoryId } = parseAuthoredContent(makeBlock({ cards: '' }));
    expect(categoryId).to.be.null;
  });

  it('parses the optional pull-quote row', () => {
    const el = makeEl(`
      ${makeRow('<div><p>cat-123</p></div>')}
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
      ${makeRow('<div><p>cat-123</p></div>')}
      ${makeRow('<div></div><div><p>Drag</p></div>')}
      ${makeRow('')}
      ${makeRow('<blockquote>A quote</blockquote>')}
    `);
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
describe('firefly-globe: fetchFireflyAssets', () => {
  let fetchStub;

  afterEach(() => {
    fetchStub?.restore();
    delete window.lana;
  });

  const asset = (over = {}) => ({
    id: 'asset-1',
    urn: 'urn:aaid:sc:1',
    _links: {
      rendition: {
        href: 'https://cdn.cp.adobe.io/content/2/rendition/asset-1/version/0/format/{format}/dimension/{dimension}/size/{size}',
        max_width: 600,
        max_height: 600,
      },
    },
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

  it('logs the status and request URL and returns null when the request fails', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 503 });
    const log = sinon.spy();
    window.lana = { log };
    expect(await fetchFireflyAssets('cat', 'en-US', 'acom_ff_globe_assets')).to.be.null;
    expect(log.calledOnce).to.be.true;
    const [msg, opts] = log.firstCall.args;
    expect(msg).to.include('503');
    expect(msg).to.include('category_id=cat');
    expect(msg).to.include('machine_tag=acom_ff_globe_assets');
    expect(opts).to.deep.equal({ tags: 'firefly-globe', severity: 'error' });
  });

  it('logs and returns null on a network or JSON error', async () => {
    fetchStub = sinon.stub(window, 'fetch').rejects(new Error('boom'));
    const log = sinon.spy();
    window.lana = { log };
    expect(await fetchFireflyAssets('cat')).to.be.null;
    expect(log.calledOnce).to.be.true;
    expect(log.firstCall.args[0]).to.include('boom');
  });

  it('maps an asset to a card with the high-res component-rendition template and model tags', async () => {
    stubAssets([asset()]);
    const [card] = await fetchFireflyAssets('cat', 'en-US');
    // Built from the asset id, targeting the full-res output/resource component — not the preview.
    expect(card.renditionHref).to.equal(
      'https://cdn.cp.adobe.io/content/2/dcx/asset-1/rendition/output/resource/version/0/format/{format}/dimension/{dimension}/size/{size}',
    );
    expect(card.maxWidth).to.equal(600);
    expect(card.modelId).to.equal('firefly');
    expect(card.modelVersionName).to.equal('Firefly Image 4');
    expect(card.fireflyUrl).to.include('id=urn:aaid:sc:1');
    expect(card.crossOrigin).to.equal('anonymous');
  });

  it('skips an asset that has no id even if it has a rendition', async () => {
    stubAssets([asset({ id: undefined }), asset()]);
    expect(await fetchFireflyAssets('cat')).to.have.length(1);
  });

  it('derives the CDN base from the preview href rather than hardcoding it', async () => {
    stubAssets([asset({
      _links: {
        rendition: {
          href: 'https://example-cdn.test/content/9/rendition/asset-1/version/0/format/{format}/dimension/{dimension}/size/{size}',
          max_width: 600,
          max_height: 600,
        },
      },
    })]);
    const [card] = await fetchFireflyAssets('cat');
    expect(card.renditionHref).to.equal(
      'https://example-cdn.test/content/9/dcx/asset-1/rendition/output/resource/version/0/format/{format}/dimension/{dimension}/size/{size}',
    );
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

  it('adds machine_tag to the query when authored', async () => {
    stubAssets([asset()]);
    await fetchFireflyAssets('cat', 'en-US', 'acom_ff_globe_assets');
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('category_id')).to.equal('cat');
    expect(url.searchParams.get('machine_tag')).to.equal('acom_ff_globe_assets');
  });

  it('omits machine_tag when not authored', async () => {
    stubAssets([asset()]);
    await fetchFireflyAssets('cat', 'en-US');
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.has('machine_tag')).to.be.false;
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

// ──────────────────────────────────────────────────────────────────
describe('firefly-globe: layoutQuote', () => {
  let host;

  // Real layout: the split reads offsetTop per word, so the node must be in the document
  // and narrow enough to wrap.
  function makeQuote(text, width = 220) {
    host = makeEl(`<div class="firefly-globe-pullquote" style="width:${width}px;padding-inline:0">
      <blockquote class="firefly-globe-pullquote-quote"
        style="font:16px/1.2 monospace;margin:0">${text}</blockquote></div>`);
    document.body.append(host);
    return host.querySelector('.firefly-globe-pullquote-quote');
  }

  const lineTexts = (el) => [...el.querySelectorAll('.firefly-globe-pullquote-line-inner')]
    .map((n) => n.textContent);

  afterEach(() => {
    host?.remove();
    host = null;
  });

  it('wraps a long quote into more than one masked line', () => {
    const quoteEl = makeQuote('one two three four five six seven eight nine ten eleven twelve');
    const lines = layoutQuote(quoteEl);
    expect(lines.length).to.be.above(1);
    lines.forEach((line) => {
      expect(line.classList.contains('firefly-globe-pullquote-line')).to.be.true;
      expect(line.querySelector('.firefly-globe-pullquote-line-inner')).to.exist;
    });
  });

  it('returns the rendered lines and marks the quote as split', () => {
    const quoteEl = makeQuote('alpha beta gamma delta epsilon zeta eta theta');
    const lines = layoutQuote(quoteEl);
    expect(quoteEl.classList.contains('firefly-globe-pullquote-lines')).to.be.true;
    expect(lines).to.have.length(quoteEl.querySelectorAll('.firefly-globe-pullquote-line').length);
  });

  it('preserves every word, in order, across the split', () => {
    const text = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';
    const quoteEl = makeQuote(text);
    layoutQuote(quoteEl);
    expect(lineTexts(quoteEl).join(' ')).to.equal(text);
  });

  it('keeps a space between lines so textContent does not run words together', () => {
    const quoteEl = makeQuote('alpha beta gamma delta epsilon zeta eta theta iota kappa');
    layoutQuote(quoteEl);
    const visible = [...quoteEl.querySelectorAll('.firefly-globe-pullquote-line')]
      .map((n) => n.textContent).join('');
    expect(quoteEl.textContent).to.not.equal(`${visible}${visible}`);
    expect(quoteEl.textContent).to.include('alpha beta');
  });

  it('re-splits from the authored text, not from the already-split DOM', () => {
    const text = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';
    const quoteEl = makeQuote(text);
    layoutQuote(quoteEl);
    const wide = layoutQuote(quoteEl); // same width: same typesetting, no nesting
    expect(lineTexts(quoteEl).join(' ')).to.equal(text);
    expect(quoteEl.querySelectorAll('.firefly-globe-pullquote-line-inner .firefly-globe-pullquote-line')).to.have.length(0);
    expect(wide.length).to.be.above(0);
  });

  it('re-typesets to fewer lines when the box gets wider', () => {
    const text = 'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu';
    const quoteEl = makeQuote(text, 160);
    const narrow = layoutQuote(quoteEl).length;
    quoteEl.closest('.firefly-globe-pullquote').style.width = '900px';
    const wide = layoutQuote(quoteEl).length;
    expect(wide).to.be.below(narrow);
    expect(lineTexts(quoteEl).join(' ')).to.equal(text);
  });

  it('carries the full text in one sr-only node and hides the visual lines', () => {
    const text = 'alpha beta gamma delta epsilon zeta eta theta';
    const quoteEl = makeQuote(text);
    const lines = layoutQuote(quoteEl);
    const sr = quoteEl.querySelector('.firefly-globe-pullquote-sr');
    expect(sr).to.exist;
    expect(sr.textContent).to.equal(text);
    lines.forEach((line) => expect(line.getAttribute('aria-hidden')).to.equal('true'));
  });

  it('hangs an opening quote mark off the first line only', () => {
    const quoteEl = makeQuote('\u201Calpha beta gamma delta epsilon zeta eta theta\u201D');
    quoteEl.closest('.firefly-globe-pullquote').style.paddingInline = '40px';
    const lines = layoutQuote(quoteEl);
    expect(lines[0].querySelectorAll('.hang-opening-quote')).to.have.length(1);
    lines.slice(1).forEach((l) => expect(l.querySelector('.hang-opening-quote')).to.be.null);
  });

  it('returns [] and leaves the quote unsplit when there is no text', () => {
    const quoteEl = makeQuote('   ');
    expect(layoutQuote(quoteEl)).to.deep.equal([]);
    expect(quoteEl.classList.contains('firefly-globe-pullquote-lines')).to.be.false;
  });

  it('returns [] for a missing element', () => {
    expect(layoutQuote(null)).to.deep.equal([]);
  });
});
