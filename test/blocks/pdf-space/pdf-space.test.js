import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// ── Constants mirrored from the block so tests stay self-contained ──────────
const CARD_WIDTH = 192;
const ACROBAT_DESKTOP_SLOT_WIDTH = 134;
const ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH = 971;
const ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT = 576;
const ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN = [129, 284, 439, 594];
const ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW = [187, 393];
const ACROBAT_MOBILE_MOCKUP_WIDTH = 294;
const ACROBAT_MOBILE_MOCKUP_HEIGHT = 536;

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReducedMotionMQ(matches) {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  };
}

let fixtureSource;

// Returns a fresh clone of the fixture block element, appended to body.
function freshEl() {
  const clone = fixtureSource.cloneNode(true);
  document.body.appendChild(clone);
  return clone;
}

// ── Fixture + module (file-level, per Milo test conventions) ─────────────────

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
fixtureSource = document.querySelector('.pdf-space');

const { default: init, derivePhases } = await import(
  '../../../libs/mep/ace1205/pdf-space/pdf-space.js'
);

// ── Global stubs ─────────────────────────────────────────────────────────────

// Stub IntersectionObserver so mountMotion never starts the rAF loop —
// keeps tests synchronous and avoids rAF-related flakiness.
before(() => {
  sinon.stub(window, 'IntersectionObserver').callsFake(() => ({
    observe() {},
    disconnect() {},
  }));
});

after(() => {
  sinon.restore();
});

// ── derivePhases() ────────────────────────────────────────────────────────────
// Pure function — no DOM, no stubs needed.
// timing shape mirrors ANIM_STATE.timing for the desktop path.

const DESKTOP_TIMING = {
  gridEnd: 1532, // ANIM_CONFIG.desktopPeelEnd
  slottingStart: 3132, // desktopPeelEnd + arcSettleDuration (1532 + 1600)
  slottingDuration: 1420,
  postRevealScrollDistance: 0,
  settleScrollStart: 2350,
};

describe('derivePhases', () => {
  const VPH = 800;

  it('returns all zeros before any scroll movement', () => {
    // scroll=0, prePinY=vph (block fully above fold), prePinContrib = vph - vph = 0
    const phase = derivePhases(0, VPH, VPH, DESKTOP_TIMING);
    expect(phase.slideT).to.equal(0);
    expect(phase.arcPan).to.equal(0);
    expect(phase.arcToGrid).to.equal(0);
    expect(phase.slotting).to.equal(0);
  });

  it('clamps all values to [0, 1]', () => {
    // Far past the end of all animations
    const phase = derivePhases(99999, 0, VPH, DESKTOP_TIMING);
    expect(phase.slideT).to.equal(1);
    expect(phase.arcPan).to.equal(1);
    expect(phase.arcToGrid).to.equal(1);
    expect(phase.slotting).to.equal(1);
  });

  it('slideT is higher when block is at the viewport fold (prePinY=0) than when still entering (prePinY=vph)', () => {
    // prePinY=0 → block top at fold → prePinContrib = vph → maximum slideT boost.
    // prePinY=vph → block just appearing at viewport bottom → prePinContrib = 0.
    const phaseAtFold = derivePhases(0, 0, VPH, DESKTOP_TIMING);
    const phaseJustEntering = derivePhases(0, VPH, VPH, DESKTOP_TIMING);
    expect(phaseAtFold.slideT).to.be.greaterThan(phaseJustEntering.slideT);
  });

  it('arcPan reaches 1 at arcPanEnd (1350)', () => {
    // ANIM_CONFIG.arcPanEnd = 1350, mirrored as module-level constant
    const phase = derivePhases(1350, 0, VPH, DESKTOP_TIMING);
    expect(phase.arcPan).to.equal(1);
  });

  it('arcToGrid is 0 before peelStartScroll (535)', () => {
    const phase = derivePhases(534, 0, VPH, DESKTOP_TIMING);
    expect(phase.arcToGrid).to.equal(0);
  });

  it('arcToGrid reaches 1 at gridEnd', () => {
    const phase = derivePhases(DESKTOP_TIMING.gridEnd, 0, VPH, DESKTOP_TIMING);
    expect(phase.arcToGrid).to.equal(1);
  });

  it('slotting is 0 before slottingStart', () => {
    const phase = derivePhases(DESKTOP_TIMING.slottingStart - 1, 0, VPH, DESKTOP_TIMING);
    expect(phase.slotting).to.equal(0);
  });

  it('slotting reaches 1 at slottingStart + slottingDuration', () => {
    const endScroll = DESKTOP_TIMING.slottingStart + DESKTOP_TIMING.slottingDuration;
    const phase = derivePhases(endScroll, 0, VPH, DESKTOP_TIMING);
    expect(phase.slotting).to.equal(1);
  });

  it('arcPan and arcToGrid can both be non-zero simultaneously (overlap is intentional)', () => {
    // At scroll=900: arcPan = 900/1350 ≈ 0.67, arcToGrid = (900-535)/(1532-535) ≈ 0.37
    const phase = derivePhases(900, 0, VPH, DESKTOP_TIMING);
    expect(phase.arcPan).to.be.greaterThan(0).and.lessThan(1);
    expect(phase.arcToGrid).to.be.greaterThan(0).and.lessThan(1);
  });

  it('does not mutate the timing object passed in', () => {
    const timing = { ...DESKTOP_TIMING };
    derivePhases(1000, 0, VPH, timing);
    expect(timing).to.deep.equal(DESKTOP_TIMING);
  });
});

// ── init() contract ───────────────────────────────────────────────────────────

describe('init', () => {
  it('returns the element', () => {
    const el = freshEl();
    expect(init(el)).to.equal(el);
  });
});

// ── No-motion layout ──────────────────────────────────────────────────────────

describe('buildNoMotion DOM structure', () => {
  let el;
  let matchMediaStub;

  before(() => {
    const realMatchMedia = window.matchMedia.bind(window);
    matchMediaStub = sinon.stub(window, 'matchMedia').callsFake((query) => {
      if (query.includes('prefers-reduced-motion')) return mockReducedMotionMQ(true);
      return realMatchMedia(query);
    });
    el = freshEl();
    init(el);
  });

  after(() => {
    // Only restore the matchMedia stub — the global IO stub must stay in place.
    matchMediaStub.restore();
  });

  it('marks the block element with no-motion class', () => {
    expect(el.classList.contains('no-motion')).to.be.true;
  });

  it('sets CSS custom properties for mockup dimensions', () => {
    const stage = el.querySelector('.pdf-space-stage');
    expect(stage.style.getPropertyValue('--acrobat-mobile-mockup-width'))
      .to.equal(`${ACROBAT_MOBILE_MOCKUP_WIDTH}px`);
    expect(stage.style.getPropertyValue('--acrobat-mobile-mockup-height'))
      .to.equal(`${ACROBAT_MOBILE_MOCKUP_HEIGHT}px`);
  });

  describe('card grid', () => {
    it('has aria-hidden on .no-motion-card-grid', () => {
      const grid = el.querySelector('.no-motion-card-grid');
      expect(grid).to.exist;
      expect(grid.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders 8 .no-motion-card figures (4 from each authoring row)', () => {
      expect(el.querySelectorAll('.no-motion-card')).to.have.lengthOf(8);
    });

    it('marks exactly 4 cards as desktop-only (imageRow2 → rowIdx 1)', () => {
      expect(el.querySelectorAll('.no-motion-card-desktop-only')).to.have.lengthOf(4);
    });

    it('renders figcaption labels for every card', () => {
      expect(el.querySelectorAll('.no-motion-card-label')).to.have.lengthOf(8);
    });

    it('label text matches authored cell content', () => {
      const labels = [...el.querySelectorAll('.no-motion-card-label')]
        .map((c) => c.textContent.trim());
      expect(labels).to.deep.equal([
        'Event Flyer.pdf', 'Sales Playbook.pdf', 'Invoice.pdf', 'Graphs.pdf',
        'Infographic.pdf', 'Q3 Media Mix.pdf', 'White Paper.pdf', 'Social Post.pdf',
      ]);
    });

    it('applies aspect-ratio derived from img width/height to each picture clone', () => {
      // Each card has a different aspect ratio — verify the formula `192 / <computed-height>`.
      // row0 computed heights from real img dims: 264, 240, 248, 240
      const expectedAspectRatios = ['192 / 264', '192 / 240', '192 / 248', '192 / 240'];
      const figures = [...el.querySelectorAll('.no-motion-card')].slice(0, 4);
      figures.forEach((fig, i) => {
        expect(fig.querySelector('picture').style.aspectRatio).to.equal(expectedAspectRatios[i]);
      });
    });
  });

  describe('desktop mockup', () => {
    it('exists with aria-hidden', () => {
      const mockup = el.querySelector('.acrobat-desktop-mockup');
      expect(mockup).to.exist;
      expect(mockup.getAttribute('aria-hidden')).to.equal('true');
    });

    it('contains 8 slotted cards (one per authored card)', () => {
      expect(
        el.querySelector('.acrobat-desktop-mockup').querySelectorAll('.no-motion-slotted-card'),
      ).to.have.lengthOf(8);
    });

    it('slotted card imgs have empty alt text', () => {
      el.querySelector('.acrobat-desktop-mockup').querySelectorAll('img').forEach((img) => {
        if (img.hasAttribute('alt')) expect(img.getAttribute('alt')).to.equal('');
      });
    });

    it('positions slotted card[col=0][row=0] with correct left%', () => {
      const firstSlot = el.querySelector('.acrobat-desktop-mockup .no-motion-slotted-card');
      const cx = ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN[0];
      const expectedLeft = ((cx - ACROBAT_DESKTOP_SLOT_WIDTH / 2)
        / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH) * 100;
      expect(parseFloat(firstSlot.style.left)).to.be.closeTo(expectedLeft, 0.01);
    });

    it('positions slotted card[col=0][row=0] with correct top%', () => {
      // Event Flyer.pdf: 619×852 → cardHeight = round(192 * 852/619) = 264
      const cardHeight = Math.round(CARD_WIDTH * (852 / 619));
      const firstSlot = el.querySelector('.acrobat-desktop-mockup .no-motion-slotted-card');
      const slotHDesign = ACROBAT_DESKTOP_SLOT_WIDTH * (cardHeight / CARD_WIDTH);
      const cy = ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW[0];
      const expectedTop = ((cy - slotHDesign / 2) / ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT) * 100;
      expect(parseFloat(firstSlot.style.top)).to.be.closeTo(expectedTop, 0.01);
    });
  });

  describe('mobile mockup', () => {
    it('exists with aria-hidden', () => {
      const mockup = el.querySelector('.acrobat-mobile-mockup');
      expect(mockup).to.exist;
      expect(mockup.getAttribute('aria-hidden')).to.equal('true');
    });

    it('contains only 4 slotted cards (rowIdx=0 cards only)', () => {
      expect(
        el.querySelector('.acrobat-mobile-mockup').querySelectorAll('.no-motion-slotted-card'),
      ).to.have.lengthOf(4);
    });
  });

  describe('class assignments on semantic elements', () => {
    it('adds .heading and .heading-2 to the title heading element', () => {
      const h = el.querySelector('.acrobat-title h1, .acrobat-title h2, .acrobat-title h3');
      expect(h.classList.contains('heading')).to.be.true;
      expect(h.classList.contains('heading-2')).to.be.true;
    });

    it('adds .heading and .heading-6 to the text-block heading element', () => {
      const h = el.querySelector('.text-block h1, .text-block h2, .text-block h3');
      expect(h.classList.contains('heading')).to.be.true;
      expect(h.classList.contains('heading-6')).to.be.true;
    });

    it('adds .subcopy and .body-md to the title <p>', () => {
      const p = el.querySelector('.acrobat-title p');
      expect(p.classList.contains('subcopy')).to.be.true;
      expect(p.classList.contains('body-md')).to.be.true;
    });

    it('adds .label to the text-block <a>', () => {
      expect(el.querySelector('.text-block a.label')).to.exist;
    });

    it('adds .label to the CTA <a>', () => {
      expect(el.querySelector('.acrobat-cta a.label')).to.exist;
    });
  });
});

// ── Motion layout ─────────────────────────────────────────────────────────────

describe('buildStage / motion DOM structure', () => {
  let el;
  let matchMediaStub;

  before(() => {
    const realMatchMedia = window.matchMedia.bind(window);
    matchMediaStub = sinon.stub(window, 'matchMedia').callsFake((query) => {
      if (query.includes('prefers-reduced-motion')) return mockReducedMotionMQ(false);
      return realMatchMedia(query);
    });
    el = freshEl();
    init(el);
  });

  after(() => {
    matchMediaStub.restore();
  });

  it('does NOT mark the block element with no-motion class', () => {
    expect(el.classList.contains('no-motion')).to.be.false;
  });

  it('builds a .pdf-space-stage root', () => {
    expect(el.querySelector('.pdf-space-stage')).to.exist;
  });

  it('sets CSS custom properties for mockup dimensions on stage', () => {
    const stage = el.querySelector('.pdf-space-stage');
    expect(stage.style.getPropertyValue('--acrobat-mobile-mockup-width'))
      .to.equal(`${ACROBAT_MOBILE_MOCKUP_WIDTH}px`);
    expect(stage.style.getPropertyValue('--acrobat-mobile-mockup-height'))
      .to.equal(`${ACROBAT_MOBILE_MOCKUP_HEIGHT}px`);
  });

  it('creates <canvas> with aria-hidden', () => {
    const canvas = el.querySelector('canvas');
    expect(canvas).to.exist;
    expect(canvas.getAttribute('aria-hidden')).to.equal('true');
  });

  it('creates .card-scene with aria-hidden', () => {
    const scene = el.querySelector('.card-scene');
    expect(scene).to.exist;
    expect(scene.getAttribute('aria-hidden')).to.equal('true');
  });

  it('renders 8 .card elements inside .card-stack', () => {
    expect(el.querySelectorAll('.card-stack .card')).to.have.lengthOf(8);
  });

  it('sets decoding="async" on all card images', () => {
    el.querySelectorAll('.card-stack .card img').forEach((img) => {
      expect(img.getAttribute('decoding')).to.equal('async');
    });
  });

  it('creates .card-label-outer for each labelled card', () => {
    expect(el.querySelectorAll('.card-label-outer')).to.have.lengthOf(8);
  });

  it('initialises card label elements with opacity 0', () => {
    [...el.querySelectorAll('.card-label-outer')].forEach((lbl) => {
      expect(lbl.style.opacity).to.equal('0');
    });
  });

  it('includes the ADBE logo SVG and path', () => {
    expect(el.querySelector('.adbe-logo-svg')).to.exist;
    expect(el.querySelector('.adbe-logo-path')).to.exist;
  });

  it('applies the same CSS class assignments as the no-motion path', () => {
    const titleH = el.querySelector('.acrobat-title h1, .acrobat-title h2, .acrobat-title h3');
    expect(titleH.classList.contains('heading-2')).to.be.true;
    const textH = el.querySelector('.text-block h1, .text-block h2, .text-block h3');
    expect(textH.classList.contains('heading-6')).to.be.true;
    expect(el.querySelector('.text-block a.label')).to.exist;
    expect(el.querySelector('.acrobat-cta a.label')).to.exist;
  });
});

// ── Motion ↔ no-motion toggle ─────────────────────────────────────────────────

describe('motion preference toggle', () => {
  it('mounts no-motion build when prefers-reduced-motion is true', () => {
    const realMatchMedia = window.matchMedia.bind(window);
    const stub = sinon.stub(window, 'matchMedia').callsFake((query) => {
      if (query.includes('prefers-reduced-motion')) return mockReducedMotionMQ(true);
      return realMatchMedia(query);
    });

    const el = freshEl();
    init(el);

    expect(el.classList.contains('no-motion')).to.be.true;
    expect(el.querySelector('.no-motion-card-grid')).to.exist;
    expect(el.querySelector('.card-scene')).to.not.exist;

    stub.restore();
  });

  it('mounts motion build when prefers-reduced-motion is false', () => {
    const realMatchMedia = window.matchMedia.bind(window);
    const stub = sinon.stub(window, 'matchMedia').callsFake((query) => {
      if (query.includes('prefers-reduced-motion')) return mockReducedMotionMQ(false);
      return realMatchMedia(query);
    });

    const el = freshEl();
    init(el);

    expect(el.classList.contains('no-motion')).to.be.false;
    expect(el.querySelector('.card-scene')).to.exist;
    expect(el.querySelector('.no-motion-card-grid')).to.not.exist;

    stub.restore();
  });
});
