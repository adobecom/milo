import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import init from '../../../libs/c2/blocks/router-marquee/router-marquee.js';

const AUTOPLAY_MS = 5000;
const FIRST_FRAME_FALLBACK_MS = 8000;

const mobileVp = (block) => block.querySelector('.rm-viewport[data-viewport="mobile"]');

describe('Router Marquee', () => {
  it('builds one viewport per breakpoint, cloning missing breakpoints', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const viewports = block.querySelectorAll(':scope > .rm-viewport');
    expect(viewports.length).to.equal(3);
    const names = [...viewports].map((vp) => vp.dataset.viewport);
    expect(names).to.have.members(['mobile', 'tablet', 'desktop']);
    // each cloned viewport carries the same slide count
    viewports.forEach((vp) => {
      expect(vp.querySelectorAll('.rm-slide').length).to.equal(2);
    });
  });

  it('renders the controls region with sr hint, play/pause and a tablist of cards', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const controls = mobileVp(block).querySelector('.rm-controls');
    expect(controls.querySelector('.rm-sr-hint')).to.exist;
    expect(controls.querySelector('.rm-pause-play')).to.exist;

    const cards = controls.querySelector('.rm-cards');
    expect(cards.getAttribute('role')).to.equal('tablist');
    expect(cards.querySelectorAll('.rm-card').length).to.equal(2);
    expect(cards.querySelector('.rm-card-reset')).to.exist;
  });

  it('decorates each slide with content, overlay and background regions', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const slides = mobileVp(block).querySelectorAll('.rm-slide');
    expect(slides[0].classList.contains('is-active')).to.be.true;
    expect(slides[1].classList.contains('is-active')).to.be.false;

    slides.forEach((slide) => {
      expect(slide.getAttribute('role')).to.equal('tabpanel');
      expect(slide.getAttribute('aria-roledescription')).to.equal('slide');
      expect(slide.querySelector('.rm-overlay')).to.exist;
      expect(slide.querySelector('.rm-background')).to.exist;
      expect(slide.querySelector('.rm-content-wrapper > .rm-content')).to.exist;
    });
    // active slide exposed, inactive slide hidden/inert
    expect(slides[0].getAttribute('aria-hidden')).to.equal('false');
    expect(slides[1].getAttribute('aria-hidden')).to.equal('true');
    expect(slides[1].hasAttribute('inert')).to.be.true;
  });

  it('promotes the heading, eyebrow, body and ctas within the content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const content = mobileVp(block).querySelector('.rm-slide .rm-content');
    expect(content.querySelector('.rm-title').textContent.trim()).to.equal('Slide one title');
    expect(content.querySelector('.rm-eyebrow').textContent.trim()).to.equal('Eyebrow one');

    const body = content.querySelector('.rm-body');
    expect(body.textContent).to.contain('Body copy for slide one.');
    // the card icon/label paragraphs are lifted out of the body into the nav card
    expect(body.textContent).to.not.contain('Slide one');

    const ctas = content.querySelector('.rm-ctas');
    expect(ctas.classList.contains('action-area')).to.be.true;
    const primary = ctas.querySelector('.rm-cta-primary');
    expect(primary).to.exist;
    expect(primary.classList.contains('con-button')).to.be.true;
  });

  it('builds nav cards with federated icon, label, aria-label and href', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const cards = mobileVp(block).querySelectorAll('.rm-card');
    const first = cards[0];
    expect(first.getAttribute('role')).to.equal('tab');
    expect(first.classList.contains('is-active')).to.be.true;
    expect(first.getAttribute('aria-selected')).to.equal('true');
    expect(first.getAttribute('href')).to.equal('https://www.adobe.com/slide-one');
    expect(first.getAttribute('aria-label')).to.equal('Eyebrow one, Slide one');

    expect(first.querySelector('.rm-card-icon').getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/card-one.svg');
    expect(first.querySelector('.rm-card-label').textContent.trim()).to.equal('Slide one');

    expect(cards[1].classList.contains('is-active')).to.be.false;
    expect(cards[1].getAttribute('aria-selected')).to.equal('false');
  });

  it('sets analytics attributes on the block, active slides and cards', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    expect(block.getAttribute('data-block-daa-lh')).to.equal('true');

    // analytics are wired for the active viewport; find the one that got them
    const analyticsVp = [...block.querySelectorAll('.rm-viewport')]
      .find((vp) => vp.querySelector('.rm-slide[daa-lh]'));
    expect(analyticsVp).to.exist;

    const slides = analyticsVp.querySelectorAll('.rm-slide');
    expect(slides[0].getAttribute('daa-lh')).to.equal('b1|rm-slide');
    expect(slides[1].getAttribute('daa-lh')).to.equal('b2|rm-slide');

    // the analytics label is derived from each slide's .rm-title text
    const cards = analyticsVp.querySelectorAll('.rm-card');
    expect(cards[0].getAttribute('daa-ll')).to.equal('rm-nav-1--Slide one title');
    expect(cards[1].getAttribute('daa-ll')).to.equal('rm-nav-2--Slide two title');
  });

  it('defers every slide video so none is eager-fetched', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/video.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    // Assert synchronously after init: the mock video URLs are non-loadable, so an
    // async `error` would kick autoplay and load slide[1]'s video. Do not add awaits
    // before these assertions without stubbing play()/requestVideoFrameCallback.
    // second slide is never the active slide, so its video stays fully deferred
    const slide = mobileVp(block).querySelectorAll('.rm-slide')[1];
    const video = slide.querySelector('video');
    expect(video).to.exist;
    // the .video-container wrapper (and its pause/play controls) is unwrapped
    expect(slide.querySelector('.video-container')).to.not.exist;
    expect(slide.querySelector('.pause-play-wrapper')).to.not.exist;
    expect(video.parentElement.classList.contains('rm-background')).to.be.true;

    // nothing that would trigger a network fetch is left on the element
    expect(video.preload).to.equal('none');
    expect(video.hasAttribute('autoplay')).to.be.false;
    expect(video.getAttribute('src')).to.equal(null);
    expect(video.querySelector('source')).to.not.exist;
    // the real source is stashed for loadVideo to restore later
    expect(video.dataset.lazySrc).to.equal('https://www.adobe.com/hero-two.mp4');
    // autoplay-safe attributes are still applied
    expect(video.muted).to.be.true;
    expect(video.hasAttribute('playsinline')).to.be.true;
    expect(video.hasAttribute('loop')).to.be.true;
  });

  it('loads exactly the active viewport hero video, restoring source and poster', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/video.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    // Assert synchronously (see note above): an awaited video `error` would kick
    // autoplay and preload a second video, making loaded.length 2.
    // loadViewportVideos promotes only the active viewport's active-slide video
    const loaded = [...block.querySelectorAll('video')].filter((v) => v.dataset.loaded === 'true');
    expect(loaded.length).to.equal(1);

    const video = loaded[0];
    expect(video.preload).to.equal('auto');
    // the stashed source is re-appended and the deferred poster is promoted
    const source = video.querySelector('source');
    expect(source).to.exist;
    expect(source.getAttribute('src')).to.equal('https://www.adobe.com/hero-one.mp4');
    expect(video.getAttribute('poster')).to.equal('https://www.adobe.com/hero-one-poster.jpg');
    // it belongs to the first (active) slide
    expect(video.closest('.rm-slide').classList.contains('is-active')).to.be.true;
  });

  it('leaves paragraphs rendered inside a mas-field where they are', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/nested-paragraphs.html' });
    const block = document.querySelector('.router-marquee');
    // mas-field resolves before the block decorates and writes its own paragraphs
    document.querySelector('mas-field [data-role="mas-field-content"]').innerHTML = '<p>A$9.99/mo</p><p>Terms apply.</p>';
    init(block);

    const body = mobileVp(block).querySelector('.rm-slide .rm-body');
    expect(body.querySelectorAll(':scope > p').length).to.equal(1);
    expect(body.querySelectorAll('mas-field p').length).to.equal(2);
    expect(body.textContent.match(/A\$9\.99\/mo/g).length).to.equal(1);
  });

  it('resets to the first slide via the reset button, and is a no-op once there', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.router-marquee');
    // Force a true desktop context: nav-card hover is only wired on the active
    // viewport, and on a narrow-but-hoverable window handleDesktopSmallVp swaps the
    // reset button out for the next arrow, so the reset path would never be reachable.
    const realMatchMedia = window.matchMedia.bind(window);
    const forced = {
      '(width >= 1280px)': true,
      '(min-width: 1280px)': true,
      '(hover: none)': false,
      '(prefers-reduced-motion: reduce)': false,
    };
    window.matchMedia = (q) => {
      if (!(q in forced)) return realMatchMedia(q);
      return { matches: forced[q], addEventListener() {}, removeEventListener() {} };
    };

    try {
      init(block);

      const vp = block.querySelector('.rm-viewport[data-viewport="desktop"]');
      const slides = vp.querySelectorAll('.rm-slide');
      const cards = vp.querySelectorAll('.rm-card');
      const resetBtn = vp.querySelector('.rm-card-reset');
      expect(resetBtn).to.exist;

      // hovering the second card is how nav-card navigation moves the active slide
      cards[1].dispatchEvent(new Event('mouseenter'));
      expect(slides[1].classList.contains('is-active')).to.be.true;

      resetBtn.click();
      expect(slides[0].classList.contains('is-active')).to.be.true;
      expect(cards[0].getAttribute('aria-selected')).to.equal('true');

      // clicking reset while already on the first slide is a no-op (early return)
      resetBtn.click();
      expect(slides[0].classList.contains('is-active')).to.be.true;
    } finally {
      window.matchMedia = realMatchMedia;
    }
  });

  it('re-runs dynamic layout updates when merch.js signals a promo slide resolved', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/promo.html' });
    const block = document.querySelector('.router-marquee');
    const rafSpy = sinon.spy(window, 'requestAnimationFrame');
    init(block);
    const callsAfterInit = rafSpy.callCount;

    block.dispatchEvent(new CustomEvent('mas:ready'));
    expect(rafSpy.callCount).to.equal(callsAfterInit + 1);

    rafSpy.restore();
  });

  it('reorders slides based on the starting-marquee section metadata', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/reorder.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const slides = mobileVp(block).querySelectorAll('.rm-slide');
    // starting-marquee=2 promotes the second authored slide to the front
    expect(slides[0].querySelector('.rm-title').textContent.trim()).to.equal('Slide two title');
    expect(slides[1].querySelector('.rm-title').textContent.trim()).to.equal('Slide one title');
  });
});

/** Stands in for MAS rendering a late field into its content span and announcing it. */
const resolveLate = (masField, html) => {
  masField.querySelector('[data-role="mas-field-content"]').innerHTML = html;
  masField.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));
};

/** Stands in for merch.js' watchMasFieldCtas hoisting a late CTA's link out of its field. */
const hoistLateCta = (masField, html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  masField.replaceWith(...template.content.childNodes);
};

const flushMutations = () => new Promise((resolve) => { setTimeout(resolve); });
const afterFrame = () => new Promise((resolve) => { requestAnimationFrame(() => resolve()); });
const RETRY_DELAY_MS = 5000;

describe('router-marquee with MAS fields still loading at decoration', () => {
  let block;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/pending-fields.html' });
    block = document.querySelector('.router-marquee');
  });

  it('keeps a pending card label field connected inside the card, in every viewport', () => {
    init(block);
    block.querySelectorAll('.rm-viewport').forEach((vp) => {
      const [first, second] = vp.querySelectorAll('.rm-card');
      expect(first.querySelector('.rm-card-label > mas-field[field="callout"]')?.isConnected).to.be.true;
      expect(first.querySelector('.rm-card-label').textContent.trim()).to.equal('');
      // a plain-text label still takes the copy-the-text path
      expect(second.querySelector('.rm-card-label mas-field')).to.not.exist;
      expect(second.querySelector('.rm-card-label').textContent).to.equal('Adobe for Business');
      expect(second.getAttribute('href')).to.equal('https://business.adobe.com');
    });
  });

  it('fills the card label, aria-label and icon alt when its fields resolve late', async () => {
    init(block);
    const vp = mobileVp(block);
    const card = vp.querySelector('.rm-card');
    resolveLate(vp.querySelector('.rm-slide .rm-eyebrow mas-field'), 'Creative Cloud');
    resolveLate(card.querySelector('mas-field[field="callout"]'), 'Creativity and design');
    await afterFrame();

    expect(card.querySelector('.rm-card-label').textContent.trim()).to.equal('Creativity and design');
    expect(card.getAttribute('aria-label')).to.equal('Creative Cloud, Creativity and design');
    expect(card.querySelector('.rm-card-icon').getAttribute('alt')).to.equal('Creativity and design');
  });

  it('never nests a link inside the card when a late label renders one', async () => {
    init(block);
    const card = mobileVp(block).querySelector('.rm-card');
    resolveLate(card.querySelector('mas-field[field="callout"]'), '<a href="/design">Creativity</a> and design');
    await afterFrame();

    expect(card.querySelector('a')).to.not.exist;
    expect(card.querySelector('.rm-card-label').textContent.trim()).to.equal('Creativity and design');
  });

  it('keeps pending CTA slots, then decorates the links merch.js hoists into them', async () => {
    init(block);
    const ctas = mobileVp(block).querySelector('.rm-slide .rm-ctas');
    expect([...ctas.children].map((c) => c.tagName)).to.deep.equal(['EM', 'EM']);

    hoistLateCta(ctas.querySelector('mas-field[field="ctas[primary]"]'), '<a href="https://www.adobe.com/trial">Free trial</a>');
    hoistLateCta(ctas.querySelector('mas-field[field="ctas[secondary]"]'), '<a href="https://www.adobe.com/buy">Buy now</a>');
    await flushMutations();

    // same shape as a CTA that was already resolved at decoration time
    const [primary, secondary] = ctas.children;
    expect(ctas.children.length).to.equal(2);
    expect(primary.matches('a.con-button.rm-cta-primary.fill.outline')).to.be.true;
    expect(primary.getAttribute('href')).to.equal('https://www.adobe.com/trial');
    expect(secondary.matches('a.con-button.outline:not(.rm-cta-primary)')).to.be.true;
    expect(secondary.getAttribute('href')).to.equal('https://www.adobe.com/buy');
  });

  it('decorates a resolved CTA right away next to a pending one', async () => {
    init(block);
    const ctas = mobileVp(block).querySelectorAll('.rm-slide')[1].querySelector('.rm-ctas');
    expect(ctas.firstElementChild.matches('a.rm-cta-primary')).to.be.true;
    expect(ctas.firstElementChild.textContent).to.equal('Resolved CTA');

    hoistLateCta(ctas.querySelector('mas-field'), '<a href="https://www.adobe.com/more">Learn more</a>');
    await flushMutations();
    expect([...ctas.children].map((a) => a.textContent)).to.deep.equal(['Resolved CTA', 'Learn more']);
    expect(ctas.lastElementChild.matches('a.con-button.outline:not(.rm-cta-primary)')).to.be.true;
  });

  it('keeps a CTA slot hidden while its field has not produced a link', async () => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/libs/c2/blocks/router-marquee/router-marquee.css';
    await new Promise((resolve) => { style.onload = resolve; document.head.append(style); });
    init(block);
    const slot = mobileVp(block).querySelector('.rm-slide .rm-ctas > em');
    resolveLate(slot.querySelector('mas-field'), '');
    await flushMutations();
    expect(slot.isConnected).to.be.true;
    expect(getComputedStyle(slot).display).to.equal('none');
    style.remove();
  });

  it('prefers a resolved CTA over an earlier empty field, as before', () => {
    // e.g. a region-only CTA that loaded empty, authored ahead of the real one
    block.querySelector('p:has(> em)').innerHTML = '<em><strong><mas-field field="ctas[kr-only]"><span data-role="mas-field-content"></span></mas-field></strong></em> <em><strong><a href="https://www.adobe.com/trial">Free trial</a></strong></em>';
    init(block);
    const ctas = mobileVp(block).querySelector('.rm-slide .rm-ctas');
    expect(ctas.children.length).to.equal(1);
    expect(ctas.firstElementChild.matches('a.rm-cta-primary')).to.be.true;
  });

  describe('a slot shared by several CTA fields', () => {
    const field = (name) => `<mas-field field="${name}"><aem-fragment fragment="frag-three"></aem-fragment><span data-role="mas-field-content"></span></mas-field>`;
    let ctas;

    beforeEach(() => {
      // e.g. a free trial next to a region-only buy now that resolves empty elsewhere
      block.querySelector('p:has(> em)').innerHTML = `<em><strong>${field('ctas[trial]')} ${field('ctas[kr-only]')}</strong></em>`;
      init(block);
      ctas = mobileVp(block).querySelector('.rm-slide .rm-ctas');
    });

    it('settles on the first link to land, without waiting on the other field', async () => {
      hoistLateCta(ctas.querySelector('mas-field[field="ctas[trial]"]'), '<a href="https://www.adobe.com/trial">Free trial</a>');
      await flushMutations();
      expect(ctas.children.length).to.equal(1);
      expect(ctas.firstElementChild.matches('a.rm-cta-primary')).to.be.true;
      expect(ctas.querySelector('mas-field')).to.not.exist;
    });

    it('does not settle on a link still inside its field, before merch.js hoists it', async () => {
      resolveLate(ctas.querySelector('mas-field[field="ctas[trial]"]'), '<a href="https://www.adobe.com/trial">Free trial</a>');
      await flushMutations();
      expect(ctas.querySelector('em mas-field a')).to.exist;
      expect(ctas.querySelector(':scope > a')).to.not.exist;
    });
  });

  it('updates the analytics label once a pending title resolves', async () => {
    init(block);
    const vp = [...block.querySelectorAll('.rm-viewport')].find((v) => v.querySelector('.rm-slide[daa-lh]'));
    // the 20-char cut ends on a space; normalized like martech's block-analytics pass does
    resolveLate(vp.querySelector('.rm-slide .rm-title mas-field'), 'All the best models, all in one place.');
    await afterFrame();
    expect(vp.querySelector('.rm-card').getAttribute('daa-ll')).to.equal('rm-nav-1--All the best models');
  });

  it('re-measures the layout once per frame when fields resolve late', () => {
    const rafSpy = sinon.spy(window, 'requestAnimationFrame');
    try {
      init(block);
      const callsAfterInit = rafSpy.callCount;
      const vp = mobileVp(block);
      resolveLate(vp.querySelector('.rm-slide .rm-title mas-field'), 'Title');
      resolveLate(vp.querySelector('.rm-slide .rm-body mas-field'), 'Body');
      expect(rafSpy.callCount).to.equal(callsAfterInit + 1);
    } finally {
      rafSpy.restore();
    }
  });

  describe('retrying failed fields', () => {
    let clock;
    let idleStub;

    const failAll = (fragments) => fragments.forEach((f) => {
      f.dispatchEvent(new CustomEvent('aem:error', { bubbles: true }));
    });

    beforeEach(() => {
      clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      idleStub = sinon.stub(window, 'requestIdleCallback').callsFake((fn) => { fn(); return 1; });
      init(block);
    });

    afterEach(() => {
      clock.restore();
      idleStub.restore();
    });

    const fragmentsOf = (id, refresh) => [...block.querySelectorAll(`aem-fragment[fragment="${id}"]`)]
      .map((f) => { f.refresh = refresh(); return f; });

    it('refetches one field per fragment after a delay, then the rest from cache', async () => {
      let resolveRetry;
      const one = fragmentsOf('frag-one', () => sinon.stub().resolves(true));
      one[0].refresh = sinon.stub().returns(new Promise((r) => { resolveRetry = r; }));
      const two = fragmentsOf('frag-two', () => sinon.stub().resolves(true));
      failAll([...one, ...two]);

      expect(one[0].refresh.called).to.be.false;
      clock.tick(RETRY_DELAY_MS);
      expect(one[0].refresh.calledOnceWith(false)).to.be.true;
      expect(two[0].refresh.calledOnce).to.be.true;
      one.slice(1).forEach((f) => expect(f.refresh.called).to.be.false);

      resolveRetry(true);
      await Promise.resolve();
      await Promise.resolve();
      one.slice(1).forEach((f) => expect(f.refresh.calledOnceWith(false)).to.be.true);

      // a field of an already-recovered fragment that fails later refreshes from cache too
      one[1].refresh.resetHistory();
      failAll([one[1]]);
      await Promise.resolve();
      expect(one[1].refresh.calledOnce).to.be.true;
    });

    it('gives up on a fragment whose single retry fails', async () => {
      const one = fragmentsOf('frag-one', () => sinon.stub().resolves(false));
      failAll(one);
      clock.tick(RETRY_DELAY_MS);
      await Promise.resolve();
      await Promise.resolve();

      failAll(one);
      clock.tick(RETRY_DELAY_MS * 2);
      const calls = one.reduce((sum, f) => sum + f.refresh.callCount, 0);
      expect(calls).to.equal(1);
    });

    it('waits for the network to come back before retrying', () => {
      const onLine = sinon.stub(navigator, 'onLine').get(() => false);
      try {
        const one = fragmentsOf('frag-one', () => sinon.stub().resolves(true));
        failAll(one);
        clock.tick(RETRY_DELAY_MS);
        expect(one[0].refresh.called).to.be.false;

        onLine.get(() => true);
        window.dispatchEvent(new Event('online'));
        expect(one[0].refresh.calledOnce).to.be.true;
      } finally {
        onLine.restore();
      }
    });
  });
});

const slideHtml = (title) => `
  <div>
    <div>
      <h1>${title}</h1>
      <p><a class="merch" href="https://mas.adobe.com/studio.html#field=promo">promo</a></p>
      <p><em><strong><a href="/cta">CTA</a></strong></em></p>
    </div>
    <div><p>background</p></div>
  </div>`;

const buildBlock = (rows, variant = '') => {
  const section = document.createElement('div');
  section.className = 'section';
  section.setAttribute('daa-lh', 'section');
  section.innerHTML = `<div class="router-marquee ${variant}">
    <div><div>mobile</div></div>
    ${rows}
  </div>`;
  document.body.append(section);
  return section.querySelector('.router-marquee');
};

/** Stands in for merch.js upgrading the authored `a.merch` into a resolved mas-field. */
const resolveField = (slide, { promo }) => {
  const link = slide.querySelector('a.merch');
  const masField = document.createElement('mas-field');
  const content = document.createElement('div');
  content.setAttribute('data-role', 'mas-field-content');
  if (promo) content.setAttribute('data-promotion-project', 'black-friday');
  masField.append(content);
  link.replaceWith(masField);
  masField.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));
};

const viewports = (block) => [...block.querySelectorAll('.rm-viewport')];
const pendingSlide = (vp) => vp.querySelector('.rm-slide.promo-placeholder:not(.promo-resolved)');
const nextFrame = () => new Promise((resolve) => { requestAnimationFrame(resolve); });
const initializedViewport = (block) => viewports(block).find((vp) => vp.querySelector('.rm-slide[daa-lh]'));
const fillRunning = (vp, index) => vp.querySelectorAll('.rm-card-progress-bar')[index]
  .style.transition.includes(`${AUTOPLAY_MS}ms`);

/** Same as slideHtml, but with a background video poster. */
const slideWithVideo = (title) => `
  <div>
    <div>
      <h1>${title}</h1>
      <p><a class="merch" href="https://mas.adobe.com/studio.html#field=promo">promo</a></p>
      <p><em><strong><a href="/cta">CTA</a></strong></em></p>
    </div>
    <div><video poster="/media/${title}.png"></video></div>
  </div>`;

describe('router-marquee promo placeholder slide', () => {
  let block;

  before(async () => {
    const { setConfig } = await import('../../../libs/utils/utils.js');
    setConfig({ codeRoot: '/libs', miloLibs: '/libs' });
    // registers the shared watchPromoPlaceholders listener that performs the reveal
    const { initMasField } = await import('../../../libs/blocks/merch/merch.js');
    const probe = document.createElement('a');
    probe.href = 'https://mas.adobe.com/studio.html#';
    await initMasField(probe);
  });

  afterEach(() => {
    block?.closest('.section')?.remove();
    block = null;
  });

  it('marks the variant-designated slide and its nav card as one placeholder group', () => {
    block = buildBlock(`${slideHtml('One')}${slideHtml('Promo')}`, 'promo-placeholder-slide-2');
    init(block);

    viewports(block).forEach((vp) => {
      const slides = [...vp.querySelectorAll('.rm-slide')];
      const cards = [...vp.querySelectorAll('.rm-card')];
      expect(slides.length).to.equal(2);
      expect(cards.length).to.equal(2);
      expect(slides[1].classList.contains('promo-placeholder')).to.be.true;
      expect(cards[1].classList.contains('promo-placeholder')).to.be.true;
      expect(cards[1].dataset.promoGroup).to.equal(slides[1].dataset.promoGroup);
      // the first visible slide is the active one
      expect(slides[0].classList.contains('is-active')).to.be.true;
      expect(slides[1].classList.contains('is-active')).to.be.false;
      expect(cards[0].classList.contains('is-active')).to.be.true;
    });
  });

  it('lets merch.js reveal the slide and its card on a resolved promotion', () => {
    block = buildBlock(`${slideHtml('One')}${slideHtml('Promo')}`, 'promo-placeholder-slide-2');
    init(block);

    viewports(block).forEach((vp) => {
      const slide = pendingSlide(vp);
      resolveField(slide, { promo: true });

      const cards = [...vp.querySelectorAll('.rm-card')];
      expect(slide.classList.contains('promo-resolved')).to.be.true;
      expect(cards[1].classList.contains('promo-resolved')).to.be.true;
      // revealing must not steal the active slide
      expect(slide.classList.contains('is-active')).to.be.false;
      expect(cards[0].classList.contains('is-active')).to.be.true;
    });
  });

  it('activates the first slide when its promotion resolves', async () => {
    block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
    init(block);

    const activeVp = initializedViewport(block);
    const slides = [...activeVp.querySelectorAll('.rm-slide')];
    const cards = [...activeVp.querySelectorAll('.rm-card')];
    expect(slides[1].classList.contains('is-active')).to.be.true;

    resolveField(slides[0], { promo: true });
    await nextFrame();

    expect(slides[0].classList.contains('promo-resolved')).to.be.true;
    expect(slides[0].classList.contains('is-active')).to.be.true;
    expect(slides[1].classList.contains('is-active')).to.be.false;
    expect(cards[0].classList.contains('is-active')).to.be.true;
    expect(cards[0].getAttribute('aria-selected')).to.equal('true');
  });

  it('starts on the first promo slide when it resolved before initialization', () => {
    block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
    const authoredPromoSlide = block.querySelectorAll(':scope > div')[1];
    resolveField(authoredPromoSlide, { promo: true });

    init(block);

    viewports(block).forEach((vp) => {
      const slides = [...vp.querySelectorAll('.rm-slide')];
      const cards = [...vp.querySelectorAll('.rm-card')];
      expect(slides[0].classList.contains('promo-resolved')).to.be.true;
      expect(slides[0].classList.contains('is-active')).to.be.true;
      expect(slides[1].classList.contains('is-active')).to.be.false;
      expect(cards[0].classList.contains('promo-resolved')).to.be.true;
      expect(cards[0].getAttribute('aria-selected')).to.equal('true');
    });
  });

  it('restarts autoplay from the first slide after its promotion resolves', async () => {
    block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
    init(block);

    const activeVp = initializedViewport(block);
    const slides = [...activeVp.querySelectorAll('.rm-slide')];
    await nextFrame();
    expect(fillRunning(activeVp, 1)).to.be.true;

    resolveField(slides[0], { promo: true });
    await nextFrame();

    expect(fillRunning(activeVp, 0)).to.be.true;
    expect(fillRunning(activeVp, 1)).to.be.false;
  });

  it('keeps autoplay paused when the first promotion resolves', async () => {
    block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
    init(block);

    const activeVp = initializedViewport(block);
    const slides = [...activeVp.querySelectorAll('.rm-slide')];
    await nextFrame();
    activeVp.querySelector('.rm-pause-play').click();

    resolveField(slides[0], { promo: true });
    await nextFrame();

    expect(slides[0].classList.contains('is-active')).to.be.true;
    expect(fillRunning(activeVp, 0)).to.be.false;
    expect(activeVp.querySelector('.rm-pause-play').getAttribute('aria-label')).to.equal('Play');
  });

  it('does not start autoplay under reduced motion when the first promotion resolves', async () => {
    const realMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true, addEventListener() {}, removeEventListener() {} };
      }
      return realMatchMedia(query);
    };

    try {
      block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
      init(block);

      const activeVp = initializedViewport(block);
      const slides = [...activeVp.querySelectorAll('.rm-slide')];
      await nextFrame();
      resolveField(slides[0], { promo: true });
      await nextFrame();

      expect(slides[0].classList.contains('is-active')).to.be.true;
      expect(fillRunning(activeVp, 0)).to.be.false;
      expect(activeVp.querySelector('.rm-pause-play').getAttribute('aria-label')).to.equal('Play');
    } finally {
      window.matchMedia = realMatchMedia;
    }
  });

  it('carries the resolved first promo slide across breakpoints', async () => {
    const realMatchMedia = window.matchMedia.bind(window);
    let viewport = 'mobile';
    const media = (matches) => ({ matches, addEventListener() {}, removeEventListener() {} });
    window.matchMedia = (query) => {
      if (query === '(width >= 1280px)' || query === '(min-width: 1280px)') {
        return media(viewport === 'desktop');
      }
      if (query === '(width > 767px)') return media(viewport !== 'mobile');
      return realMatchMedia(query);
    };

    try {
      block = buildBlock(`${slideHtml('Promo')}${slideHtml('Two')}`, 'promo-placeholder-slide-1');
      init(block);

      viewports(block).forEach((vp) => resolveField(pendingSlide(vp), { promo: true }));
      await nextFrame();
      const mobile = block.querySelector('.rm-viewport[data-viewport="mobile"]');
      expect(mobile.querySelectorAll('.rm-slide')[0].classList.contains('is-active')).to.be.true;

      viewport = 'desktop';
      window.dispatchEvent(new Event('resize'));
      await nextFrame();

      const desktop = block.querySelector('.rm-viewport[data-viewport="desktop"]');
      expect(desktop.querySelectorAll('.rm-slide')[0].classList.contains('is-active')).to.be.true;
      expect(desktop.querySelectorAll('.rm-card')[0].getAttribute('aria-selected')).to.equal('true');
    } finally {
      window.matchMedia = realMatchMedia;
    }
  });

  it('keeps the slide hidden when the field resolves without a promotion', () => {
    block = buildBlock(`${slideHtml('One')}${slideHtml('Promo')}`, 'promo-placeholder-slide-2');
    init(block);

    viewports(block).forEach((vp) => {
      resolveField(pendingSlide(vp), { promo: false });
      expect(vp.querySelectorAll('.promo-resolved').length).to.equal(0);
      expect(pendingSlide(vp)).to.exist;
    });
  });

  it('leaves a block without the variant untouched', () => {
    block = buildBlock(`${slideHtml('One')}${slideHtml('Two')}`);
    init(block);

    viewports(block).forEach((vp) => {
      expect(vp.querySelectorAll('.promo-placeholder').length).to.equal(0);
      expect(vp.querySelectorAll('.rm-slide').length).to.equal(2);
    });
  });

  it('keeps the video poster on the first visible slide when the promo slide is first', () => {
    block = buildBlock(`${slideWithVideo('One')}${slideWithVideo('Two')}`, 'promo-placeholder-slide-1');
    init(block);

    viewports(block).forEach((vp) => {
      const slides = [...vp.querySelectorAll('.rm-slide')];
      expect(slides[0].classList.contains('promo-placeholder')).to.be.true;
      expect(slides[1].classList.contains('is-active')).to.be.true;
      // a display:none promo slide must not hold the only poster
      expect(slides[0].querySelector('video').hasAttribute('poster')).to.be.false;
      expect(slides[1].querySelector('video').hasAttribute('poster')).to.be.true;
    });
  });

  it('keeps analytics slide indexes stable before and after the reveal', () => {
    block = buildBlock(`${slideHtml('One')}${slideHtml('Promo')}${slideHtml('Three')}`, 'promo-placeholder-slide-2');
    init(block);

    // only the viewport matching the current breakpoint is analytics-initialized
    const initialized = viewports(block).find((vp) => vp.querySelector('.rm-slide[daa-lh]'));
    const labels = [...initialized.querySelectorAll('.rm-slide')].map((s) => s.getAttribute('daa-lh'));
    expect(labels).to.deep.equal(['b1|rm-slide', 'b2|rm-slide', 'b3|rm-slide']);

    resolveField(pendingSlide(initialized), { promo: true });
    const after = [...initialized.querySelectorAll('.rm-slide')].map((s) => s.getAttribute('daa-lh'));
    expect(after).to.deep.equal(labels);
  });
});

describe('Router Marquee — autoplay first-frame gating', () => {
  let clock;
  let capturedFrameCb;
  let origRvfc;
  let origPlay;
  let origLoad;
  let origAdd;

  const activeVpName = () => {
    if (window.matchMedia('(width >= 1280px)').matches) return 'desktop';
    if (window.matchMedia('(width > 767px)').matches) return 'tablet';
    return 'mobile';
  };
  const activeVp = (block) => block.querySelector(`.rm-viewport[data-viewport="${activeVpName()}"]`);
  const bars = (block) => [...activeVp(block).querySelectorAll('.rm-card-progress-bar')];
  // startFill sets a `transform <AUTOPLAY_MS>ms linear` transition; use that as the signal
  // that autoplay actually began for a given slide index.
  const isFillRunning = (block, i) => (bars(block)[i]?.style.transition || '').includes(`${AUTOPLAY_MS}ms`);
  const activeIndex = (block) => [...activeVp(block).querySelectorAll('.rm-slide')]
    .findIndex((s) => s.classList.contains('is-active'));

  beforeEach(() => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    capturedFrameCb = null;
    // Capture the first-frame callback instead of firing it, so the test decides when
    // (if ever) the hero video presents its first frame.
    origRvfc = window.HTMLVideoElement.prototype.requestVideoFrameCallback;
    window.HTMLVideoElement.prototype.requestVideoFrameCallback = function reqFrame(cb) {
      capturedFrameCb = cb;
      return 1;
    };
    origPlay = window.HTMLMediaElement.prototype.play;
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
    origLoad = window.HTMLMediaElement.prototype.load;
    window.HTMLMediaElement.prototype.load = () => {};
    // The block's only media error/loadeddata listeners are the first-frame kick; drop them
    // so the captured rVFC callback and the fallback timer are the sole ways autoplay starts.
    origAdd = window.HTMLMediaElement.prototype.addEventListener;
    window.HTMLMediaElement.prototype.addEventListener = function add(type, cb, opts) {
      if (['error', 'loadeddata', 'stalled'].includes(type)) return undefined;
      return origAdd.call(this, type, cb, opts);
    };
  });

  afterEach(() => {
    window.HTMLVideoElement.prototype.requestVideoFrameCallback = origRvfc;
    window.HTMLMediaElement.prototype.play = origPlay;
    window.HTMLMediaElement.prototype.load = origLoad;
    window.HTMLMediaElement.prototype.addEventListener = origAdd;
    clock.restore();
  });

  const setup = async () => {
    // Let IntersectionObserver entries queued by earlier tests' blocks deliver before this
    // init replaces the module-level SLIDE_ANALYTICS they index into.
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    document.body.innerHTML = await readFile({ path: './mocks/video.html' });
    const block = document.querySelector('.router-marquee');
    init(block);
    return block;
  };

  it('does not start autoplay before the hero video presents its first frame', async () => {
    const block = await setup();
    expect(capturedFrameCb).to.be.a('function');
    // Past a full autoplay cycle but under the fallback: with the frame withheld, nothing runs.
    clock.tick(AUTOPLAY_MS + 100);
    expect(isFillRunning(block, 0)).to.be.false;
    expect(activeIndex(block)).to.equal(0);
  });

  it('starts the fill and advance timer once the first frame fires', async () => {
    const block = await setup();
    expect(isFillRunning(block, 0)).to.be.false;
    capturedFrameCb();
    expect(isFillRunning(block, 0)).to.be.true;
    clock.tick(AUTOPLAY_MS);
    expect(activeIndex(block)).to.equal(1);
  });

  it('falls back to starting autoplay after the timeout when no frame fires', async () => {
    const block = await setup();
    clock.tick(FIRST_FRAME_FALLBACK_MS - 1);
    expect(isFillRunning(block, 0)).to.be.false;
    clock.tick(1);
    expect(isFillRunning(block, 0)).to.be.true;
  });

  it('lets the first frame govern advance timing when resumed during the gate', async () => {
    const block = await setup();
    const btn = activeVp(block).querySelector('.rm-pause-play');
    btn.click(); // pause
    btn.click(); // resume -> schedules an advance at t+AUTOPLAY_MS
    clock.tick(2000);
    capturedFrameCb(); // first frame at t=2000 -> advance timer should re-anchor to t=7000
    // At t=AUTOPLAY_MS the stray resume-timer must NOT have advanced the slide.
    clock.tick(AUTOPLAY_MS - 2000);
    expect(activeIndex(block)).to.equal(0);
    // The frame-anchored timer advances at t=2000+AUTOPLAY_MS.
    clock.tick(2000);
    expect(activeIndex(block)).to.equal(1);
  });
});

describe('router-marquee light variant, ctas and foreground media', () => {
  // Let IntersectionObserver entries queued by earlier tests' blocks deliver before this
  // init replaces the module-level SLIDE_ANALYTICS they index into.
  const loadMock = async (path, { light = false } = {}) => {
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    document.body.innerHTML = await readFile({ path });
    const block = document.querySelector('.router-marquee');
    if (light) block.classList.add('light');
    init(block);
    return block;
  };

  it('marks ctas dark by default', async () => {
    const block = await loadMock('./mocks/foreground.html');

    expect(mobileVp(block).querySelector('.rm-ctas').classList.contains('dark')).to.be.true;
  });

  it('drops the dark cta styling for the light variant', async () => {
    const block = await loadMock('./mocks/foreground.html', { light: true });

    expect(mobileVp(block).querySelector('.rm-ctas').classList.contains('dark')).to.be.false;
  });

  it('splits the first of two authored images into a foreground layer above the copy', async () => {
    const block = await loadMock('./mocks/foreground.html');

    const slide = mobileVp(block).querySelector('.rm-slide');
    const foreground = slide.querySelector('.rm-content-wrapper > .rm-foreground');
    expect(foreground).to.exist;
    // the foreground sits before the copy within the wrapper
    expect(foreground.nextElementSibling.classList.contains('rm-content')).to.be.true;
    // first authored image becomes the foreground, the second stays as the background
    expect(foreground.querySelector(':scope > picture img').getAttribute('alt')).to.equal('foreground');
    expect(slide.querySelector('.rm-background > picture img').getAttribute('alt')).to.equal('background');
  });

  it('does not add a foreground layer when a slide authors a single image', async () => {
    const block = await loadMock('./mocks/default.html');

    mobileVp(block).querySelectorAll('.rm-slide').forEach((slide) => {
      expect(slide.querySelector('.rm-foreground')).to.not.exist;
    });
  });
});
