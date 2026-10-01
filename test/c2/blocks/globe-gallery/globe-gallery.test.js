import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import {
  escapeHtml,
  fetchFragmentCards,
  optimizeImgUrl,
  parseAuthoredContent,
  buildGlobeDom,
  scatterCards,
} from '../../../../libs/c2/blocks/globe-gallery/src/authoring.js';
import createGalleryA11y from '../../../../libs/c2/blocks/globe-gallery/src/a11y.js';
import createGlobeControls from '../../../../libs/c2/blocks/globe-gallery/src/controls.js';
import {
  arcCamZ,
  arcRotationEase,
  buildArcCtx,
  capDpr,
  clamp01,
  coverFit,
  cssToWorld,
  easeInOutCubic,
  easeInOutQuint,
  easeOutCubic,
  easeOutExpo,
  easeOutQuart,
  getFanData,
  pxPerWorldAt,
  rotateArcPoint,
} from '../../../../libs/c2/blocks/globe-gallery/src/math.js';
import * as TL from '../../../../libs/c2/blocks/globe-gallery/src/timeline.js';

function makeEl(innerHTML) {
  const el = document.createElement('div');
  el.innerHTML = innerHTML;
  return el;
}

function makeRow(content = '') {
  return `<div>${content}</div>`;
}

const LABELS = {
  pauseSpin: 'Pause',
  resumeSpin: 'Resume',
  rotateLeft: 'Left',
  rotateRight: 'Right',
  prevCard: 'Previous',
  nextCard: 'Next',
  closeBtn: 'Close',
  cardLabel: (i, n) => `${i} of ${n}`,
};

describe('globe-gallery: authoring helpers', () => {
  it('escapes all HTML-significant characters and handles nullish values', () => {
    expect(escapeHtml('& < > " \'')).to.equal('&amp; &lt; &gt; &quot; &#39;');
    expect(escapeHtml(null)).to.equal('');
    expect(escapeHtml(undefined)).to.equal('');
  });

  it('optimizes Milo media URLs with a rounded dimension', () => {
    expect(optimizeImgUrl('https://example.com/media_abc123/image.png', 383.6))
      .to.equal('https://example.com/media_abc123/image.png?width=384&format=webply');
    expect(optimizeImgUrl('/media_deadbeef/photo.jpg', 512, 'height'))
      .to.equal(`${window.location.origin}/media_deadbeef/photo.jpg?height=512&format=webply`);
  });

  it('leaves non-media, empty, and malformed URLs unchanged', () => {
    expect(optimizeImgUrl('https://example.com/image.png', 300)).to.equal('https://example.com/image.png');
    expect(optimizeImgUrl('', 300)).to.equal('');
    expect(optimizeImgUrl('http://[', 300)).to.equal('http://[');
  });

  it('scatters deterministically without mutating cards and preserves authored order metadata', () => {
    const cards = ['a', 'b', 'c', 'd'].map((name) => ({ name }));
    const first = scatterCards(cards);
    const second = scatterCards(cards);

    expect(first.map(({ authoredIndex }) => authoredIndex))
      .to.deep.equal(second.map(({ authoredIndex }) => authoredIndex));
    expect(first.map(({ authoredIndex }) => authoredIndex).sort((a, b) => a - b))
      .to.deep.equal([0, 1, 2, 3]);
    expect(cards.every((card) => !Object.prototype.hasOwnProperty.call(card, 'authoredIndex')))
      .to.be.true;
    expect(first.every((card, i) => card !== cards[i])).to.be.true;
  });
});

describe('globe-gallery: parseAuthoredContent', () => {
  function makeBlock({
    arc = '<h2>Meet the artists</h2><p>Explore their work.</p>',
    cards = '<a href="/fragments/gallery#_dnb">Gallery cards</a>',
    touch = '<p>Swipe to explore.</p>',
    pointer = '<p>Drag me</p>',
    a11y = '',
    quote = '',
  } = {}) {
    return makeEl(`
      ${makeRow(arc)}
      ${makeRow(cards)}
      ${makeRow(`<div>${touch}</div><div>${pointer}</div>`)}
      ${makeRow(a11y)}
      ${quote ? makeRow(quote) : ''}
    `);
  }

  it('parses all positional rows and strips the fragment opt-out hash', () => {
    const content = parseAuthoredContent(makeBlock({ quote: '<blockquote>Make something.</blockquote><p>Ada</p><p>Designer</p>' }));

    expect(content.arcCopy.title).to.equal('Meet the artists');
    expect(content.arcCopy.body.map((p) => p.textContent)).to.deep.equal(['Explore their work.']);
    expect(content.fragmentHref).to.equal(`${window.location.origin}/fragments/gallery`);
    expect(content.touchHint.text).to.equal('Swipe to explore.');
    expect(content.touchHint.paras).to.have.length(1);
    expect(content.hintText).to.equal('Drag me');
    expect(content.pullQuote).to.deep.equal({
      quote: 'Make something.',
      name: 'Ada',
      role: 'Designer',
    });
  });

  it('falls back to the first paragraph as the arc title and excludes image paragraphs', () => {
    const content = parseAuthoredContent(makeBlock({ arc: '<p>Fallback title</p><p><img alt=""></p><p>Body copy</p>' }));

    expect(content.arcCopy.title).to.equal('Fallback title');
    expect(content.arcCopy.body.map((p) => p.textContent)).to.deep.equal(['Body copy']);
  });

  it('uses localized defaults when optional authoring is empty', () => {
    const content = parseAuthoredContent(makeBlock({
      cards: '',
      touch: '',
      pointer: '',
    }));

    expect(content.fragmentHref).to.be.null;
    expect(content.pullQuote).to.be.null;
    expect(content.touchHint.text)
      .to.equal('Click and drag to rotate. Tap to dive deep into the artwork.');
    expect(content.hintText).to.equal('Click & Drag');
    expect(content.instructions)
      .to.equal('Press Enter to enter the gallery, then Tab through the images.');
    expect(content.labels.cardLabel(2, 9)).to.equal('2 of 9');
  });

  it('parses custom accessibility labels and interpolates the card template', () => {
    const content = parseAuthoredContent(makeBlock({
      a11y: [
        'Enter', 'Turn left', 'Turn right', 'Stop', 'Start',
        'Back', 'Artwork {index} / {count}', 'Forward', 'Dismiss',
      ].join(' || '),
    }));

    expect(content.instructions).to.equal('Enter');
    expect(content.labels).to.include({
      rotateLeft: 'Turn left',
      rotateRight: 'Turn right',
      pauseSpin: 'Stop',
      resumeSpin: 'Start',
      prevCard: 'Back',
      nextCard: 'Forward',
      closeBtn: 'Dismiss',
    });
    expect(content.labels.cardLabel(3, 8)).to.equal('Artwork 3 / 8');
  });

  it('rejects an incomplete card label template but preserves other custom labels', () => {
    const content = parseAuthoredContent(makeBlock({ a11y: 'Enter || Left custom || || || || || Card {index}' }));

    expect(content.labels.rotateLeft).to.equal('Left custom');
    expect(content.labels.rotateRight).to.equal('Rotate right');
    expect(content.labels.cardLabel(1, 4)).to.equal('1 of 4');
  });

  it('parses a representative authored DA block fixture end to end', async () => {
    const content = parseAuthoredContent(makeEl(
      await readFile({ path: './mocks/authored.html' }),
    ));

    expect(content.arcCopy.title).to.equal('Creativity is everywhere');
    expect(content.arcCopy.body.map((p) => p.textContent)).to.deep.equal([
      'Discover how artists bring their ideas to life.',
      'Explore the tools behind their work.',
    ]);
    expect(content.fragmentHref)
      .to.equal(`${window.location.origin}/cc-shared/fragments/media/globe-cards`);
    expect(content.touchHint.paras.map((p) => p.textContent)).to.deep.equal([
      'Drag to explore the artwork.',
      'Tap an image to learn about its creator.',
    ]);
    expect(content.hintText).to.equal('Explore');
    expect(content.instructions).to.equal('Enter the gallery');
    expect(content.labels.cardLabel(2, 8)).to.equal('Artwork 2 of 8');
    expect(content.pullQuote).to.deep.equal({
      quote: 'Creativity takes courage.',
      name: 'Sample Artist',
      role: 'Designer and Illustrator',
    });
  });
});

describe('globe-gallery: fetchFragmentCards', () => {
  let fetchStub;
  let originalLana;

  beforeEach(() => {
    originalLana = window.lana;
  });

  afterEach(() => {
    fetchStub?.restore();
    window.lana = originalLana;
  });

  it('fetches plain HTML and maps segmented card content', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => `
        <div>
          <div>
            <picture><img src="/media_abc/photo.jpg" alt="Portrait"></picture>
            <h3>Ada Lovelace</h3>
            <p><em>Mathematician</em></p>
            <p>First description.</p>
            <p>Second description.</p>
            <ul>
              <li>
                <a href="/icons/star.svg">/icons/star.svg</a>
                <a href="/features/engine">Engine</a>
                <ul><li>Featured</li></ul>
              </li>
            </ul>
            <hr>
            <p><img src="/media_def/work.jpg" alt=""></p>
            <p><strong>Grace Hopper</strong></p>
            <p><em>Computer scientist</em></p>
          </div>
        </div>`,
    });

    const cards = await fetchFragmentCards('/fragments/gallery');

    expect(fetchStub.calledOnceWith('/fragments/gallery.plain.html')).to.be.true;
    expect(cards).to.have.length(2);
    expect(cards[0]).to.include({
      img: '/media_abc/photo.jpg',
      alt: 'Portrait',
      name: 'Ada Lovelace',
      role: 'Mathematician',
    });
    expect(cards[0].description.map((p) => p.textContent))
      .to.deep.equal(['First description.', 'Second description.']);
    expect(cards[0].badges).to.have.length(1);
    expect(cards[0].badges[0]).to.include({
      name: 'Engine',
      role: 'Featured',
      href: '/features/engine',
    });
    expect(cards[0].badges[0].icon).to.include('globe-gallery-modal-badge-icon');
    expect(cards[1]).to.include({
      img: '/media_def/work.jpg',
      alt: '',
      name: 'Grace Hopper',
      role: 'Computer scientist',
    });
  });

  it('parses a compact fixture modeled on the published DA fragment', async () => {
    const html = await readFile({ path: './mocks/fragment.html' });
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => html,
    });

    const cards = await fetchFragmentCards('/cc-shared/fragments/media/globe-cards');

    expect(cards).to.have.length(2);
    expect(cards.map(({ name }) => name)).to.deep.equal([
      'Forrest Mankins',
      'Max Drekker',
    ]);
    expect(cards.map(({ role }) => role)).to.deep.equal([
      'Photographer, Director',
      'Illustrator and Motion Designer',
    ]);
    expect(cards[0].img).to.include('media_1680f0997c3e6d06799cc1379d0ade4eb0d787b9e.png');
    expect(cards[0].alt)
      .to.equal('A silhouetted figure standing atop a desert dune at dusk.');
    expect(cards[0].description.map((p) => p.textContent)).to.deep.equal([
      'A five-day road trip through the desert Southwest captured remnants of Route 66.',
    ]);
    expect(cards[0].badges.map(({ name }) => name)).to.deep.equal(['Lightroom Classic']);
    expect(cards[1].badges.map(({ name }) => name))
      .to.deep.equal(['Illustrator', 'Photoshop']);
    expect(cards[1].badges.map(({ href }) => href)).to.deep.equal([
      'https://www.adobe.com/products/illustrator.html',
      'https://www.adobe.com/products/photoshop.html',
    ]);
    cards.flatMap(({ badges }) => badges).forEach(({ icon }) => {
      expect(icon).to.include('<picture class="globe-gallery-modal-badge-icon"');
      expect(icon).to.include('aria-hidden="true"');
    });
  });

  it('supports direct card markup without a wrapping div', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => '<div><img src="/media_abc/card.jpg"><h2>Direct card</h2></div>',
    });

    expect((await fetchFragmentCards('/fragment'))[0]).to.deep.include({
      img: '/media_abc/card.jpg',
      name: 'Direct card',
    });
  });

  it('skips image-less segments and reports them through lana', async () => {
    const log = sinon.spy();
    window.lana = { log };
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => '<div><div><h2>Missing artwork</h2><p>Description</p></div></div>',
    });

    expect(await fetchFragmentCards('/fragment')).to.be.null;
    expect(log.calledOnce).to.be.true;
    expect(log.firstCall.args[0]).to.include('Missing artwork');
    expect(log.firstCall.args[1]).to.deep.equal({
      tags: 'globe-gallery',
      severity: 'info',
    });
  });

  it('returns null for HTTP errors, empty fragments, and network errors', async () => {
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().resolves({ ok: false, status: 404 });
    fetchStub.onSecondCall().resolves({ ok: true, text: async () => '<div></div>' });
    fetchStub.onThirdCall().rejects(new Error('offline'));

    expect(await fetchFragmentCards('/missing')).to.be.null;
    expect(await fetchFragmentCards('/empty')).to.be.null;
    expect(await fetchFragmentCards('/offline')).to.be.null;
  });
});

describe('globe-gallery: buildGlobeDom', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  function build(options = {}) {
    const arcBody = makeEl('<p>Body one</p><p>Body two</p>');
    const touchHint = makeEl('<p>Swipe</p>');
    return buildGlobeDom(el, LABELS, {
      arcCopy: { title: 'Arc title', body: [...arcBody.children] },
      pullQuote: { quote: 'Quote', name: 'Name', role: 'Role' },
      touchHint: { paras: [...touchHint.children], text: 'Fallback' },
      ...options,
    });
  }

  it('builds the canvas, controls, modal, and unique labelled dialog', () => {
    const firstId = build();
    const heading = el.querySelector('.globe-gallery-modal-name');
    const second = document.createElement('div');
    const secondId = buildGlobeDom(second, LABELS, {
      arcCopy: { title: '', body: [] },
      pullQuote: null,
      touchHint: { paras: [], text: '' },
    });

    expect(el.querySelector('.globe-gallery-canvas')).to.exist;
    expect(el.querySelector('.globe-gallery-controls')).to.exist;
    expect(el.querySelector('.globe-gallery-modal')).to.exist;
    expect(el.querySelector('.globe-gallery-modal-chrome')).to.exist;
    expect(heading.id).to.equal(`globe-gallery-modal-name-${firstId}`);
    expect(heading.getAttribute('aria-describedby'))
      .to.include(`globe-gallery-modal-role-${firstId}`);
    expect(secondId).to.be.greaterThan(firstId);
  });

  it('renders authored copy, pull quote, touch hint, and localized labels as text', () => {
    build();

    expect(el.querySelector('.globe-gallery-arc-copy-title').textContent).to.equal('Arc title');
    expect([...el.querySelectorAll('.globe-gallery-arc-copy-body p')]
      .map((p) => p.textContent)).to.deep.equal(['Body one', 'Body two']);
    expect(el.querySelector('.globe-gallery-hint-text').textContent).to.equal('Swipe');
    expect(el.querySelector('.globe-gallery-pullquote-quote').textContent).to.equal('Quote');
    expect(el.querySelector('.globe-gallery-pullquote-name').textContent).to.equal('Name');
    expect(el.querySelector('.globe-gallery-pullquote-role').textContent).to.equal('Role');
    expect(el.querySelector('.globe-gallery-spin-toggle').getAttribute('aria-label')).to.equal('Pause');
    expect(el.querySelector('.globe-gallery-modal-close').getAttribute('aria-label')).to.equal('Close');
  });

  it('removes the pull-quote section when one is not authored', () => {
    build({ pullQuote: null });
    expect(el.querySelector('.globe-gallery-pullquote-pin')).to.be.null;
  });

  it('uses plain hint text when no authored paragraphs exist', () => {
    build({ touchHint: { paras: [], text: '<Swipe safely>' } });
    const hint = el.querySelector('.globe-gallery-hint-text');
    expect(hint.textContent).to.equal('<Swipe safely>');
    expect(hint.querySelector('*')).to.be.null;
  });
});

describe('globe-gallery: math', () => {
  it('keeps easing endpoints and midpoint symmetry stable', () => {
    expect(easeOutCubic(0)).to.equal(0);
    expect(easeOutCubic(1)).to.equal(1);
    expect(easeOutQuart(0)).to.equal(0);
    expect(easeOutQuart(0.5)).to.equal(0.9375);
    expect(easeOutQuart(1)).to.equal(1);
    expect(easeInOutCubic(0.5)).to.equal(0.5);
    expect(easeInOutQuint(0.5)).to.equal(0.5);
    expect(easeOutExpo(0)).to.equal(0);
    expect(easeOutExpo(1)).to.equal(1);
  });

  it('clamps values to the unit interval', () => {
    expect(clamp01(-2)).to.equal(0);
    expect(clamp01(0.25)).to.equal(0.25);
    expect(clamp01(3)).to.equal(1);
  });

  it('computes centered cover crops in both orientations and reuses the output object', () => {
    expect(coverFit(2, 1)).to.deep.equal({ rx: 0.5, ry: 1, ox: 0.25, oy: 0 });
    expect(coverFit(1, 2)).to.deep.equal({ rx: 1, ry: 0.5, ox: 0, oy: 0.25 });
    expect(coverFit(1, 1)).to.deep.equal({ rx: 1, ry: 1, ox: 0, oy: 0 });
    expect(coverFit(0, 1)).to.deep.equal({ rx: 1, ry: 1, ox: 0, oy: 0 });
    const out = {};
    expect(coverFit(2, 1, out)).to.equal(out);
  });

  it('keeps the arc rotation ramp continuous at its seam', () => {
    const k = 0.2;
    expect(arcRotationEase(k - 1e-7, k))
      .to.be.closeTo(arcRotationEase(k + 1e-7, k), 1e-6);
    expect(arcRotationEase(0, k)).to.equal(0);
    expect(arcRotationEase(1, k)).to.be.closeTo(1, 1e-12);
  });

  it('maps CSS coordinates to centered world coordinates', () => {
    expect(cssToWorld(0, 0, 800, 600)).to.deep.equal({ x: -400, y: 300 });
    const center = cssToWorld(400, 300, 800, 600);
    expect(center.x).to.equal(0);
    expect(center.y).to.equal(0);
  });

  it('returns fan points on the configured circle with a matching tangent rotation', () => {
    const ctx = buildArcCtx(0.4, 800, 600, 4.5, 0.1);
    const point = getFanData(0.3, ctx);
    const distance = Math.hypot(point.px - ctx.fanCX, point.py - ctx.fanCY);

    expect(distance).to.be.closeTo(ctx.R, 1e-9);
    expect(Math.hypot(point.rx, point.ry)).to.be.closeTo(1, 1e-12);
    expect(point.cssRot).to.be.a('number');
  });

  it('rotates arc points around the fan center before converting to world coordinates', () => {
    const ctx = {
      fanCX: 100,
      fanCY: 100,
    };
    expect(rotateArcPoint(110, 100, Math.PI / 2, ctx, 200, 200))
      .to.deep.include({ x: 0, y: -10 });
  });

  it('caps DPR and keeps camera projection helpers inverse-compatible', () => {
    const original = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 });
    expect(capDpr()).to.equal(2);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: original });

    const height = 900;
    const cameraZ = arcCamZ(height);
    expect(pxPerWorldAt(cameraZ, height)).to.be.closeTo(1, 1e-12);
  });
});

describe('globe-gallery: timeline', () => {
  function derive(scrollY, overrides = {}) {
    const frame = TL.createFrame();
    const input = {
      ...TL.createFrameInput(),
      scrollY,
      prevLenisY: 0,
      now: TL.FRAME_MS,
      blockDocTop: 1000,
      blockHeight: 3000,
      formPx: 1000,
      viewportH: 800,
      arcScale: 0.8,
      entryLeadVh: 0.5,
      ...overrides,
    };
    return TL.deriveFrame(frame, input);
  }

  it('initializes frame and input with complete stable defaults', () => {
    expect(TL.createFrame()).to.deep.equal({
      lenisY: 0,
      scrollVel: 0,
      dtScale: 1,
      progress: 0,
      arcCopyEntryT: 0,
      arcPanT: 0,
      gridFormT: 0,
      gpWin: TL.GRID_PEEL_WINDOW,
      sphereFormT: 0,
      zoomT: 0,
      arcScale: 1,
      activeCamera: null,
      sphereRotActive: false,
      sphGroupZ: 0,
      foldSphDist: 0,
    });
    expect(TL.createFrameInput()).to.have.keys(
      'scrollY',
      'prevLenisY',
      'now',
      'prevNow',
      'reducedMotion',
      'blockDocTop',
      'blockHeight',
      'formPx',
      'viewportH',
      'arcScale',
      'entryLeadVh',
    );
  });

  it('maps the form and tail scroll ranges onto their phase boundaries', () => {
    expect(derive(1000).progress).to.equal(0);
    expect(derive(2000).progress).to.equal(TL.SPHERE_FORMED_PROGRESS);
    expect(derive(3000).progress).to.be.closeTo(
      TL.SPHERE_FORMED_PROGRESS + (1 - TL.SPHERE_FORMED_PROGRESS) / 2,
      1e-12,
    );
    expect(derive(4000).progress).to.equal(1);
    expect(derive(2000).sphereFormT).to.equal(1);
    expect(derive(2000).zoomT).to.equal(0);
    expect(derive(3000).zoomT).to.be.closeTo(0.5, 1e-12);
    expect(derive(4000).zoomT).to.equal(1);
  });

  it('derives entry progress before the block reaches its pin', () => {
    expect(derive(600).arcCopyEntryT).to.equal(0);
    expect(derive(1020).arcCopyEntryT).to.be.closeTo(0.5, 1e-12);
    expect(derive(1440).arcCopyEntryT).to.equal(1);
  });

  it('scales scroll velocity by elapsed frames and clamps extreme frame gaps', () => {
    const normal = derive(1100, { prevLenisY: 1000, prevNow: 10, now: 10 + TL.FRAME_MS });
    const slow = derive(1100, { prevLenisY: 1000, prevNow: 10, now: 10 + 2 * TL.FRAME_MS });
    const stalled = derive(1100, { prevLenisY: 1000, prevNow: 10, now: 1010 });

    expect(normal.scrollVel).to.be.closeTo(100, 1e-9);
    expect(slow.scrollVel).to.be.closeTo(50, 1e-9);
    expect(stalled.dtScale).to.equal(TL.DT_SCALE_MAX);
  });

  it('pins reduced motion to the fully formed globe and removes scroll velocity', () => {
    const frame = derive(0, { reducedMotion: true, prevLenisY: 200 });
    expect(frame.lenisY).to.equal(2000);
    expect(frame.progress).to.equal(TL.SPHERE_FORMED_PROGRESS);
    expect(frame.sphereFormT).to.equal(1);
    expect(frame.zoomT).to.equal(0);
    expect(frame.scrollVel).to.equal(0);
  });

  it('keeps camera zoom conversion functions inverse and clamped', () => {
    [0, 0.1, 0.5, 0.9, 1].forEach((t) => {
      const z = TL.camZAtZoomT(t, 70, -60);
      expect(TL.zoomTAtCamZ(z, 70, -60)).to.be.closeTo(t, 1e-9);
    });
    expect(TL.zoomTAtCamZ(100, 70, -60)).to.equal(0);
    expect(TL.zoomTAtCamZ(-100, 70, -60)).to.equal(1);
    expect(TL.zoomTAtCamZ(0, 10, 10)).to.equal(0);
  });

  it('stagers card folding monotonically and within the form phase', () => {
    const starts = [0, 0.1, 0.2].map(TL.cardFoldStartProgress);
    expect(starts[1]).to.be.greaterThan(starts[0]);
    expect(starts[2]).to.be.greaterThan(starts[1]);
    starts.forEach((start) => {
      expect(start).to.be.at.least(0);
      expect(start).to.be.below(TL.SPHERE_FORMED_PROGRESS);
    });
  });
});

describe('globe-gallery: controls', () => {
  let root;
  let visible;
  let dismissed;
  let rotate;
  let controls;

  beforeEach(() => {
    root = makeEl(`
      <div class="globe-gallery-world">
        <span class="after-controls"></span>
        <div class="globe-gallery-controls">
          <button class="globe-gallery-spin-toggle" aria-label="Pause"></button>
          <div class="globe-gallery-hint">
            <button class="globe-gallery-rotate" data-dir="-1"></button>
            <button class="globe-gallery-rotate" data-dir="1"></button>
          </div>
        </div>
      </div>
    `);
    visible = false;
    dismissed = false;
    rotate = sinon.spy();
    controls = createGlobeControls({
      q: (selector) => root.querySelector(selector),
      labels: LABELS,
      getVisible: () => visible,
      getHintDismissed: () => dismissed,
      rotate,
    });
    controls.setup();
  });

  afterEach(() => {
    controls.teardown();
  });

  it('moves controls to the end of the world for tab order', () => {
    expect(root.querySelector('.globe-gallery-world').lastElementChild.className)
      .to.equal('globe-gallery-controls');
  });

  it('toggles spin state, label, class, and analytics value', () => {
    const button = root.querySelector('.globe-gallery-spin-toggle');
    expect(controls.isSpinPaused()).to.be.false;

    button.click();
    expect(controls.isSpinPaused()).to.be.true;
    expect(button.classList.contains('is-paused')).to.be.true;
    expect(button.getAttribute('aria-label')).to.equal('Resume');
    expect(button.getAttribute('daa-ll')).to.equal('resume_spin--globe_gallery');

    button.click();
    expect(controls.isSpinPaused()).to.be.false;
    expect(button.getAttribute('aria-label')).to.equal('Pause');
    expect(button.getAttribute('daa-ll')).to.equal('pause_spin--globe_gallery');
  });

  it('passes numeric directions from both rotate buttons', () => {
    root.querySelector('[data-dir="-1"]').click();
    root.querySelector('[data-dir="1"]').click();
    expect(rotate.args).to.deep.equal([[-1], [1]]);
  });

  it('updates visibility and hint dismissal from runtime state', () => {
    const layer = root.querySelector('.globe-gallery-controls');
    const hint = root.querySelector('.globe-gallery-hint');
    controls.update();
    expect(layer.classList.contains('is-visible')).to.be.false;
    expect(hint.classList.contains('is-dismissed')).to.be.false;

    visible = true;
    dismissed = true;
    controls.update();
    expect(layer.classList.contains('is-visible')).to.be.true;
    expect(hint.classList.contains('is-dismissed')).to.be.true;
  });

  it('removes listeners and state classes during teardown', () => {
    const layer = root.querySelector('.globe-gallery-controls');
    const spin = root.querySelector('.globe-gallery-spin-toggle');
    visible = true;
    dismissed = true;
    controls.update();
    controls.teardown();
    spin.click();

    expect(controls.isSpinPaused()).to.be.false;
    expect(layer.classList.contains('is-visible')).to.be.false;
    expect(root.querySelector('.globe-gallery-hint').classList.contains('is-dismissed')).to.be.false;
  });
});

describe('globe-gallery: accessibility gallery', () => {
  let root;
  let modalIdx;
  let formed;
  let centered;
  let opened;
  let focused;
  let a11y;

  beforeEach(() => {
    root = makeEl('<div class="globe-gallery-world"><canvas class="globe-gallery-canvas"></canvas></div>');
    document.body.appendChild(root);
    modalIdx = -1;
    formed = true;
    centered = sinon.spy();
    opened = sinon.spy();
    focused = sinon.spy();
    a11y = createGalleryA11y({
      q: (selector) => root.querySelector(selector),
      getCount: () => 3,
      cardOrder: [2, 0, 1],
      getModalIdx: () => modalIdx,
      isGlobeFormed: () => formed,
      getCardLabel: (i) => `Card ${i + 1}`,
      centerCard: centered,
      openCard: opened,
      onFocus: focused,
      galleryInstructions: 'Enter the gallery',
      gid: 42,
    });
    a11y.setup();
  });

  afterEach(() => {
    a11y.teardown();
    root.remove();
  });

  it('creates one entry control and ordered card controls with accessible labels', () => {
    const entry = root.querySelector('.globe-gallery-a11y');
    const buttons = [...root.querySelectorAll('.globe-gallery-a11y-card')];

    expect(entry.getAttribute('aria-labelledby')).to.equal('globe-gallery-a11y-desc-42');
    expect(entry.textContent).to.equal('Enter the gallery');
    expect(buttons.map((button) => button.dataset.idx)).to.deep.equal(['2', '0', '1']);
    expect(buttons.map((button) => button.getAttribute('aria-label')))
      .to.deep.equal(['Card 3', 'Card 1', 'Card 2']);
    expect(root.querySelector('.globe-gallery-a11y-cards').inert).to.be.true;
  });

  it('enters browse mode only after the globe is formed and focuses the first ordered card', () => {
    const entry = root.querySelector('.globe-gallery-a11y');
    formed = false;
    entry.click();
    expect(a11y.isBrowsing()).to.be.false;

    formed = true;
    entry.click();
    expect(a11y.isBrowsing()).to.be.true;
    expect(document.activeElement.dataset.idx).to.equal('2');
    expect(centered.calledWith(2)).to.be.true;
    expect(focused.called).to.be.true;
  });

  it('collapses browse mode on Escape and returns focus to the entry button', () => {
    const entry = root.querySelector('.globe-gallery-a11y');
    entry.click();
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    document.activeElement.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
    expect(a11y.isBrowsing()).to.be.false;
    expect(document.activeElement).to.equal(entry);
    expect(root.querySelector('.globe-gallery-a11y-cards').inert).to.be.true;
  });

  it('updates tab stops while a modal is open and restores browse state afterward', () => {
    const entry = root.querySelector('.globe-gallery-a11y');
    const cards = root.querySelector('.globe-gallery-a11y-cards');
    entry.click();

    modalIdx = 2;
    a11y.updateTabStops();
    expect(entry.tabIndex).to.equal(-1);
    expect(cards.inert).to.be.true;

    modalIdx = -1;
    a11y.updateTabStops();
    expect(entry.tabIndex).to.equal(-1);
    expect(cards.inert).to.be.false;
  });

  it('focuses requested cards and exposes the focused card index', () => {
    root.querySelector('.globe-gallery-a11y').click();
    a11y.focusCard(1);

    expect(document.activeElement.dataset.idx).to.equal('1');
    expect(a11y.getFocusedIdx()).to.equal(1);
    expect(centered.lastCall.args).to.deep.equal([1]);

    document.activeElement.blur();
    expect(a11y.getFocusedIdx()).to.equal(-1);
  });

  it('positions the focus ring over the active card', () => {
    root.querySelector('.globe-gallery-a11y').click();
    a11y.focusCard(0);
    a11y.setFocusRect(10, 20, 300, 200);
    const card = root.querySelector('[data-idx="0"]');

    expect(card.style.left).to.equal('10px');
    expect(card.style.top).to.equal('20px');
    expect(card.style.width).to.equal('300px');
    expect(card.style.height).to.equal('200px');
    expect(card.style.borderRadius).to.equal('7px');
  });

  it('does not open cards for synthetic analytics clicks', () => {
    root.querySelector('.globe-gallery-a11y').click();
    a11y.trackCardOpen(1);
    expect(opened.called).to.be.false;
  });

  it('removes generated controls during teardown', () => {
    a11y.teardown();
    expect(root.querySelector('.globe-gallery-a11y')).to.be.null;
    expect(root.querySelector('.globe-gallery-a11y-cards')).to.be.null;
    expect(a11y.isBrowsing()).to.be.false;
    expect(a11y.getFocusedIdx()).to.equal(-1);
  });
});
