import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const {
  default: init,
  getSwipeDirection,
  getSwipeDistance,
  waitImgReady,
} = await import('../../../libs/blocks/carousel/carousel.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

// 1x1 GIF data URL (no network) for picture/img in setEqualHeight + waitImgReady path.
const DATA_URL_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function appendCarouselFixture(html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  return wrap;
}

/** Carousel block plus companion sections (metadata links slides to the carousel name). */
function multiSectionCarouselFixture({ carouselClass, blockTitle, companions }) {
  const companionHtml = companions.map(({ h2, body = '' }) => `
<div class="section">
  <div class="text"><div><div></div></div><div><div><h2>${h2}</h2>${body}</div></div></div>
  <div class="section-metadata"><div><div>carousel</div><div>${blockTitle}</div></div></div>
</div>`).join('');
  return `
<div class="section">
  <div class="carousel ${carouselClass}">
    <div><div>${blockTitle}</div></div>
  </div>
</div>${companionHtml}`;
}

describe('getSwipeDistance', () => {
  it('returns absolute distance between start and end', () => {
    expect(getSwipeDistance(100, 160)).to.equal(60);
    expect(getSwipeDistance(160, 100)).to.equal(60);
  });

  it('returns 0 when end is 0 (reset path)', () => {
    expect(getSwipeDistance(2402, 0)).to.equal(0);
  });
});

describe('getSwipeDirection', () => {
  it('returns left when swipe ends left of start beyond minimum', () => {
    const swipe = { xMin: 50, xStart: 2402, xEnd: 2284 };
    const swipeDistance = { xDistance: getSwipeDistance(swipe.xStart, swipe.xEnd) };
    expect(getSwipeDirection(swipe, swipeDistance)).to.equal('left');
  });

  it('returns right when swipe ends right of start beyond minimum', () => {
    const swipe = { xMin: 50, xStart: 2284, xEnd: 2402 };
    const swipeDistance = { xDistance: getSwipeDistance(swipe.xStart, swipe.xEnd) };
    expect(getSwipeDirection(swipe, swipeDistance)).to.equal('right');
  });

  it('returns undefined when horizontal distance is at or below minimum', () => {
    const swipe = { xMin: 50, xStart: 100, xEnd: 130 };
    const swipeDistance = { xDistance: getSwipeDistance(100, 130) };
    expect(getSwipeDirection(swipe, swipeDistance)).to.be.undefined;
  });

  it('returns undefined when distance does not reflect a real swipe from xStart', () => {
    const swipe = { xMin: 50, xStart: 100, xEnd: 0 };
    const swipeDistance = { xDistance: getSwipeDistance(swipe.xStart, swipe.xEnd) };
    expect(getSwipeDirection(swipe, swipeDistance)).to.be.undefined;
  });
});

const ORIGINAL_RESIZE_OBSERVER = window.ResizeObserver;

function restoreResizeObserver() {
  window.ResizeObserver = ORIGINAL_RESIZE_OBSERVER;
}

function createIncompleteImgStub() {
  const img = document.createElement('img');
  Object.defineProperty(img, 'complete', { value: false, configurable: true });
  Object.defineProperty(img, 'naturalHeight', { value: 0, configurable: true });
  Object.defineProperty(img, 'offsetHeight', { value: 0, configurable: true });
  Object.defineProperty(img, 'clientHeight', { value: 0, configurable: true });
  return img;
}

function installResizeObserverUsageSpy() {
  let observed = false;
  function Spy() {}
  Spy.prototype.observe = function observe() { observed = true; };
  Spy.prototype.disconnect = function disconnect() {};
  window.ResizeObserver = Spy;
  return () => observed;
}

describe('waitImgReady', () => {
  afterEach(() => {
    restoreResizeObserver();
  });

  it('resolves immediately when img is null or undefined', async () => {
    await waitImgReady(null);
    await waitImgReady(undefined);
  });

  it('waits for the load event when the image is not yet complete', async () => {
    const img = document.createElement('img');
    const ready = waitImgReady(img);
    img.src = DATA_URL_GIF;
    await ready;
    expect(img.complete).to.be.true;
  });

  it('registers load listener with once:true when image is incomplete', async () => {
    const img = createIncompleteImgStub();

    let loadListenerOptions;
    const origAdd = img.addEventListener.bind(img);
    img.addEventListener = function captureLoadOptions(type, listener, options) {
      if (type === 'load') loadListenerOptions = options;
      return origAdd(type, listener, options);
    };

    const ready = waitImgReady(img);
    img.dispatchEvent(new Event('load'));
    await ready;

    expect(loadListenerOptions).to.be.an('object');
    expect(loadListenerOptions.once).to.be.true;
  });

  it('resolves without ResizeObserver when the image already has non-zero layout height', async () => {
    const img = document.createElement('img');
    const getResizeObserverUsed = installResizeObserverUsageSpy();

    img.src = DATA_URL_GIF;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    document.body.appendChild(img);
    Object.defineProperty(img, 'offsetHeight', { value: 40, configurable: true });
    Object.defineProperty(img, 'clientHeight', { value: 40, configurable: true });

    await waitImgReady(img);
    expect(getResizeObserverUsed()).to.be.false;
    img.remove();
  });

  it('waits for ResizeObserver when complete with natural pixels but zero layout height', async () => {
    const img = document.createElement('img');
    Object.defineProperty(img, 'complete', { value: true, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 48, configurable: true });
    Object.defineProperty(img, 'offsetHeight', { value: 0, configurable: true });
    Object.defineProperty(img, 'clientHeight', { value: 0, configurable: true });

    function ResizeObserverLayoutTick(callback) {
      this.onResize = callback;
    }
    ResizeObserverLayoutTick.prototype.observe = function observe() {
      const self = this;
      queueMicrotask(() => {
        Object.defineProperty(img, 'offsetHeight', { value: 48, configurable: true });
        Object.defineProperty(img, 'clientHeight', { value: 48, configurable: true });
        self.onResize([], self);
      });
    };
    ResizeObserverLayoutTick.prototype.disconnect = function disconnect() {
      this.disconnected = true;
    };
    window.ResizeObserver = ResizeObserverLayoutTick;

    await waitImgReady(img);
    expect(img.offsetHeight).to.equal(48);
  });

  it('skips ResizeObserver when layout height is zero and naturalHeight is zero', async () => {
    const img = document.createElement('img');
    Object.defineProperty(img, 'complete', { value: true, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 0, configurable: true });
    Object.defineProperty(img, 'offsetHeight', { value: 0, configurable: true });
    Object.defineProperty(img, 'clientHeight', { value: 0, configurable: true });

    const getResizeObserverUsed = installResizeObserverUsageSpy();

    await waitImgReady(img);
    expect(getResizeObserverUsed()).to.be.false;
  });
});

describe('Carousel', () => {
  it('Carousel exsists', () => {
    const carousel = document.body.querySelector('.carousel');
    init(carousel);
    expect(carousel).to.exist;
  });

  it('Carousel has slides', () => {
    const slides = document.body.querySelectorAll('.carousel-slide');
    const activeSlide = slides[0].classList.contains('active');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');
    const activeIndicator = slideIndicators[0].classList.contains('active');
    expect(slides).to.exist;
    expect(activeSlide).to.be.true;
    expect(slideIndicators).to.exist;
    expect(activeIndicator).to.be.true;
  });

  it('Carousel has navigation buttons', () => {
    const nextButton = document.body.querySelector('.carousel-next');
    const previousButton = document.body.querySelector('.carousel-previous');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');
    expect(nextButton).to.exist;
    expect(previousButton).to.exist;
    expect(slideIndicators).to.exist;
  });

  it('Clicks on next and previoius slide buttons', () => {
    const nextButton = document.body.querySelector('.carousel-next');
    const previousButton = document.body.querySelector('.carousel-previous');
    const slides = document.body.querySelectorAll('.carousel-slide');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');

    nextButton.click();
    let activeSlide = slides[1].classList.contains('active');
    let activeIndicator = slideIndicators[1].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;

    previousButton.click();
    activeSlide = slides[0].classList.contains('active');
    activeIndicator = slideIndicators[0].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;
  });

  it('Keyboard navigation to go to next and previous slide', async () => {
    const carouselContainer = document.body.querySelector('.carousel');
    carouselContainer.classList.add('show-2');
    const nextButton = document.body.querySelector('.carousel-next');
    const previousButton = document.body.querySelector('.carousel-previous');
    const slides = document.body.querySelectorAll('.carousel-slide');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');

    nextButton.focus();
    await sendKeys({ press: 'ArrowRight' });
    let activeSlide = slides[1].classList.contains('active');
    let activeIndicator = slideIndicators[1].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;

    previousButton.focus();
    await sendKeys({ press: 'ArrowLeft' });
    activeSlide = slides[0].classList.contains('active');
    activeIndicator = slideIndicators[0].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;
  });

  it('Carousel lightbox is enabled, lightbox open and close buttons clicked', async () => {
    const el = document.body.querySelector('.carousel');
    const lightboxEnabled = el.classList.contains('lightbox');
    const lightboxButton = el.querySelector('.carousel-expand');
    expect(lightboxEnabled).to.be.true;
    expect(lightboxButton).to.exist;

    // Click carousel-expand icon and open lightbox
    lightboxButton.click();
    let lightboxActive = el.classList.contains('lightbox-active');
    let curtain = el.querySelector('.carousel-curtain');
    expect(lightboxActive).to.be.true;
    expect(curtain).to.exist;

    // Click carousel-close icon and close lightbox
    const lightboxCloseButton = el.querySelector('.carousel-close');
    lightboxCloseButton.click();
    lightboxActive = el.classList.contains('lightbox-active');
    curtain = el.querySelector('.carousel-curtain');
    expect(lightboxActive).to.be.false;
    expect(curtain).to.not.exist;
  });

  it('Close lightbox by clicking on curtain', async () => {
    const el = document.body.querySelector('.carousel');
    const lightboxEnabled = el.classList.contains('lightbox');
    const lightboxButton = el.querySelector('.carousel-expand');
    expect(lightboxEnabled).to.be.true;
    expect(lightboxButton).to.exist;

    // Activate/open lightbox
    lightboxButton.click();
    let lightboxActive = el.classList.contains('lightbox-active');
    let curtain = el.querySelector('.carousel-curtain');
    expect(lightboxActive).to.be.true;
    expect(curtain).to.exist;

    // Close lightbox by clicking on curtain
    curtain.click();
    lightboxActive = el.classList.contains('lightbox-active');
    curtain = el.querySelector('.carousel-curtain');
    expect(lightboxActive).to.be.false;
    expect(curtain).to.not.exist;
  });

  it('Mobile swipe distance and direction capture', () => {
    const swipeDistance = {};
    const swipe = { xMin: 50, xStart: 2402, xEnd: 2284 };
    const swipeRight = { xMin: 50, xStart: 2284, xEnd: 2402 };
    swipeDistance.xDistance = getSwipeDistance(swipe.xStart, swipe.xEnd);
    const swipeDirection = getSwipeDirection(swipe, swipeDistance);
    const swipeRightDirection = getSwipeDirection(swipeRight, swipeDistance);
    expect(swipeDirection).to.equal('left');
    expect(swipeRightDirection).to.equal('right');
    expect(swipeDistance.xDistance).to.be.greaterThan(50);
  });

  it('Mobile swipe distance end is zero', () => {
    const swipeDistance = {};
    const swipe = { xMin: 50, xStart: 2402, xEnd: 0 };
    swipeDistance.xDistance = getSwipeDistance(swipe.xStart, swipe.xEnd);
    expect(swipeDistance.xDistance).to.equal(0);
  });

  it('Swipe (touchend) does not focus the next nav button', () => {
    /* eslint-disable compat/compat -- Touch/TouchEvent; WTR Chromium */
    const carousel = document.body.querySelector('.carousel');
    if (!carousel.querySelector('.carousel-wrapper')) init(carousel);

    const next = document.body.querySelector('.carousel-next');
    // Carousel reads only screenX/screenY; identifier + target are required by Touch().
    const touch = (x) => new Touch({ identifier: 0, target: carousel, screenX: x, screenY: 300 });
    const t0 = touch(400);
    carousel.dispatchEvent(new TouchEvent('touchstart', { touches: [t0], changedTouches: [t0] }));
    const t1 = touch(300);
    carousel.dispatchEvent(new TouchEvent('touchmove', { touches: [t1], changedTouches: [t1] }));
    carousel.dispatchEvent(new TouchEvent('touchend', { changedTouches: [t1] }));

    expect(document.activeElement).to.not.equal(next);
    /* eslint-enable compat/compat */
  });
});

function getLightboxFocusables(el) {
  return [...el.querySelectorAll(
    'button:not(.carousel-expand), a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )].filter((elem) => !elem.closest('[aria-hidden="true"]'));
}

describe('Carousel lightbox keyboard (handleLightboxButtons)', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    init(document.body.querySelector('.carousel'));
  });

  it('closes the lightbox when Escape is pressed', () => {
    const el = document.body.querySelector('.carousel');
    el.querySelector('.carousel-expand').click();
    expect(el.classList.contains('lightbox-active')).to.be.true;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(el.classList.contains('lightbox-active')).to.be.false;
  });

  it('does not react to Escape when the lightbox is closed', () => {
    const el = document.body.querySelector('.carousel');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.classList.contains('lightbox-active')).to.be.false;
  });

  it('moves focus from the last focusable to the first on Tab', () => {
    const el = document.body.querySelector('.carousel');
    el.querySelector('.carousel-expand').click();
    const focusables = getLightboxFocusables(el);
    expect(focusables.length).to.be.at.least(2);
    const first = focusables[0];
    const last = focusables.at(-1);
    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: false }));
    expect(document.activeElement).to.equal(first);
  });

  it('moves focus from the first focusable to the last on Shift+Tab', () => {
    const el = document.body.querySelector('.carousel');
    el.querySelector('.carousel-expand').click();
    const focusables = getLightboxFocusables(el);
    expect(focusables.length).to.be.at.least(2);
    const first = focusables[0];
    const last = focusables.at(-1);
    first.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
    expect(document.activeElement).to.equal(last);
  });
});

describe('Carousel aria-live and labels', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    init(document.body.querySelector('.carousel'));
  });

  it('updates aria-live region when changing slides', () => {
    const carousel = document.body.querySelector('.carousel');
    const ariaLive = carousel.querySelector('.aria-live-container');
    expect(ariaLive).to.exist;
    carousel.querySelector('.carousel-next').click();
    expect(ariaLive.textContent.length).to.be.greaterThan(0);
    expect(ariaLive.textContent).to.include('Slide 2 of 3');
  });

  it('previous control has descriptive aria-label when returning to first slide', () => {
    const carousel = document.body.querySelector('.carousel');
    const previousButton = carousel.querySelector('.carousel-previous');
    const nextButton = carousel.querySelector('.carousel-next');
    nextButton.click();
    previousButton.click();
    expect(previousButton.getAttribute('aria-label')).to.include('Previous slide, slide 1 of 3');
  });
});

describe('carousel init edge cases', () => {
  it('does not mount when block is not inside a section', () => {
    const orphan = document.createElement('div');
    orphan.className = 'carousel';
    orphan.innerHTML = '<div><div>Orphan name</div></div>';
    document.body.appendChild(orphan);
    init(orphan);
    expect(orphan.querySelector('.carousel-wrapper')).to.be.null;
    orphan.remove();
  });
});

describe('carousel disable-circular-nav', () => {
  let fixtureRoot;

  beforeEach(() => {
    const html = multiSectionCarouselFixture({
      carouselClass: 'disable-circular-nav circ-isolated',
      blockTitle: 'Circ isolated',
      companions: [
        { h2: 'C1', body: '<p>One</p>' },
        { h2: 'C2', body: '<p>Two</p>' },
      ],
    });
    fixtureRoot = appendCarouselFixture(html);
    init(fixtureRoot.querySelector('.carousel'));
  });

  afterEach(() => {
    fixtureRoot?.remove();
  });

  it('disables previous on first slide and next on last slide', () => {
    const el = fixtureRoot.querySelector('.circ-isolated');
    const [prev, next] = el.querySelectorAll('.carousel-button');
    expect(prev.disabled).to.be.true;
    expect(prev.classList.contains('disabled')).to.be.true;
    expect(next.disabled).to.be.false;

    next.click();
    expect(prev.disabled).to.be.false;
    expect(next.disabled).to.be.true;
  });

  it('does not wrap from last slide when next is triggered', () => {
    const el = fixtureRoot.querySelector('.circ-isolated');
    const slides = el.querySelectorAll('.carousel-slide');
    const next = el.querySelector('.carousel-next');
    next.click();
    expect(slides[1].classList.contains('active')).to.be.true;
    next.click();
    expect(slides[1].classList.contains('active')).to.be.true;
  });
});

describe('carousel disable-buttons (mobile width)', () => {
  let fixtureRoot;
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    window.innerWidth = 800;
    const html = multiSectionCarouselFixture({
      carouselClass: 'disable-buttons db-isolated',
      blockTitle: 'Db isolated',
      companions: [{ h2: 'D1' }, { h2: 'D2' }],
    });
    fixtureRoot = appendCarouselFixture(html);
    init(fixtureRoot.querySelector('.carousel'));
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    fixtureRoot?.remove();
  });

  it('disables previous at first slide and next at last on narrow viewport', () => {
    const el = fixtureRoot.querySelector('.db-isolated');
    const [prev, next] = el.querySelectorAll('.carousel-button');
    expect(prev.disabled).to.be.true;
    expect(next.disabled).to.be.false;

    next.click();
    expect(prev.disabled).to.be.false;
    expect(next.disabled).to.be.true;
  });

  it('toggles hide-left-hint on edge slides via updateButtonStates', () => {
    const el = fixtureRoot.querySelector('.db-isolated');
    const slides = el.querySelectorAll('.carousel-slide');
    const next = el.querySelector('.carousel-next');
    const prev = el.querySelector('.carousel-previous');

    expect(slides[slides.length - 1].classList.contains('hide-left-hint')).to.be.true;
    expect(slides[0].classList.contains('hide-left-hint')).to.be.false;

    next.click();
    expect(slides[0].classList.contains('hide-left-hint')).to.be.true;
    expect(slides[slides.length - 1].classList.contains('hide-left-hint')).to.be.false;

    prev.click();
    expect(slides[slides.length - 1].classList.contains('hide-left-hint')).to.be.true;
    expect(slides[0].classList.contains('hide-left-hint')).to.be.false;
  });

  it('clears disabled state on nav buttons when resized to desktop', () => {
    const el = fixtureRoot.querySelector('.db-isolated');
    const [prev, next] = el.querySelectorAll('.carousel-button');
    expect(prev.disabled).to.be.true;
    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    expect(prev.disabled).to.be.false;
    expect(next.disabled).to.be.false;
    expect(prev.classList.contains('disabled')).to.be.false;
    expect(next.classList.contains('disabled')).to.be.false;
  });
});

describe('carousel disable-buttons equal height (integration)', () => {
  let fixtureRoot;
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    window.innerWidth = 800;
    const html = multiSectionCarouselFixture({
      carouselClass: 'disable-buttons db-with-picture',
      blockTitle: 'Db pic',
      companions: [
        {
          h2: 'S1',
          body: `<picture><img alt="" src="${DATA_URL_GIF}" width="1" height="1"></picture><p>One</p>`,
        },
        { h2: 'S2', body: '<p>Two</p>' },
      ],
    });
    fixtureRoot = appendCarouselFixture(html);
    init(fixtureRoot.querySelector('.carousel'));
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    fixtureRoot?.remove();
  });

  it('setEqualHeight runs after navigation and waits for first-slide picture imgs', async () => {
    const el = fixtureRoot.querySelector('.db-with-picture');
    el.querySelector('.carousel-next').click();
    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const slideContainer = el.querySelector('.carousel-slides');
    const slides = el.querySelectorAll('.carousel-slide');
    expect(slideContainer.style.height).to.not.equal('');
    expect(slides[0].style.height).to.not.equal('');
    expect(slides[0].style.transition).to.include('height');
  });

  it('removeEqualHeight runs when viewport crosses desktop breakpoint (resize)', async () => {
    const el = fixtureRoot.querySelector('.db-with-picture');
    el.querySelector('.carousel-next').click();
    await new Promise((resolve) => { setTimeout(resolve, 100); });

    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));

    const slideContainer = el.querySelector('.carousel-slides');
    const slides = el.querySelectorAll('.carousel-slide');
    expect(slideContainer.style.height).to.equal('');
    slides.forEach((slide) => {
      expect(slide.style.height).to.equal('');
      expect(slide.style.transition).to.equal('');
    });
  });
});

describe('carousel disable-buttons deferred heights on desktop', () => {
  let fixtureRoot;
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    window.innerWidth = 1200;
    const html = multiSectionCarouselFixture({
      carouselClass: 'disable-buttons db-desktop-deferred',
      blockTitle: 'Db desk',
      companions: [{ h2: 'A1' }, { h2: 'A2' }],
    });
    fixtureRoot = appendCarouselFixture(html);
    init(fixtureRoot.querySelector('.carousel'));
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    fixtureRoot?.remove();
  });

  it('updateDisableButtonsHeights calls removeEqualHeight after deferred timeout', async () => {
    await new Promise((resolve) => { setTimeout(resolve, 1100); });
    const el = fixtureRoot.querySelector('.db-desktop-deferred');
    const slideContainer = el.querySelector('.carousel-slides');
    const slides = el.querySelectorAll('.carousel-slide');
    expect(slideContainer.style.height).to.equal('');
    slides.forEach((slide) => {
      expect(slide.style.height).to.equal('');
    });
  });
});
