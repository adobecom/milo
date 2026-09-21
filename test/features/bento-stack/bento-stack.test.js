import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const {
  default: initBentoStack,
  contentReady,
  whenReady,
} = await import('../../../libs/features/bento-stack.js');

function createCard({ withContent = true, height = 100 } = {}) {
  const card = document.createElement('div');
  card.className = 'explore-card';
  if (withContent) {
    const content = document.createElement('div');
    content.className = 'explore-card-content';
    Object.defineProperty(content, 'offsetHeight', { value: height, configurable: true });
    card.append(content);
  } else {
    Object.defineProperty(card, 'offsetHeight', { value: height, configurable: true });
  }
  return card;
}

function createSection(cards) {
  const section = document.createElement('div');
  section.className = 'section bento stack-mobile';
  cards.forEach((card) => section.append(card));
  document.body.append(section);
  return section;
}

function nextFrame() {
  return new Promise((resolve) => { requestAnimationFrame(resolve); });
}

function waitUntil(predicate) {
  return new Promise((resolve) => {
    const check = () => {
      if (predicate()) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

describe('contentReady', () => {
  it('is true when every card has a decorated content wrapper', () => {
    expect(contentReady([createCard(), createCard()])).to.be.true;
  });

  it('is false when any card is missing the content wrapper', () => {
    expect(contentReady([createCard(), createCard({ withContent: false })])).to.be.false;
  });
});

describe('whenReady', () => {
  it('calls back immediately when cards are already ready', () => {
    const cb = sinon.spy();
    whenReady([createCard()], cb);
    expect(cb.calledOnce).to.be.true;
  });

  it('waits for a card decorated after the initial call, then calls back', async () => {
    const card = createCard({ withContent: false });
    const cb = sinon.spy();

    whenReady([card], cb, performance.now() + 2000);
    await nextFrame();
    await nextFrame();
    expect(cb.called).to.be.false;

    const content = document.createElement('div');
    content.className = 'explore-card-content';
    card.append(content);

    await waitUntil(() => cb.called);
    expect(cb.calledOnce).to.be.true;
  });

  it('gives up at the deadline and calls back anyway if content never appears', async () => {
    const card = createCard({ withContent: false });
    const cb = sinon.spy();

    whenReady([card], cb, performance.now() + 10);
    await waitUntil(() => cb.called);

    expect(cb.calledOnce).to.be.true;
    expect(contentReady([card])).to.be.false;
  });
});

describe('initBentoStack', () => {
  let originalMatchMedia;
  let originalResizeObserver;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalResizeObserver = window.ResizeObserver;

    const mql = { matches: true, addEventListener: () => {}, removeEventListener: () => {} };
    window.matchMedia = () => mql;

    function NoopResizeObserver() {}
    NoopResizeObserver.prototype.observe = () => {};
    NoopResizeObserver.prototype.disconnect = () => {};
    window.ResizeObserver = NoopResizeObserver;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.ResizeObserver = originalResizeObserver;
    document.querySelectorAll('.section.bento.stack-mobile').forEach((section) => section.remove());
  });

  it('measures decorated content height when a sibling block decorates late', async () => {
    // Reproduces the real-world race: explore-card.js hasn't created .explore-card-content
    // yet when initBentoStack (lazily imported from section-metadata.js) first runs.
    // 1222 = raw/undecorated natural height; the correct decorated height is 528 (below).
    const rawCard = createCard({ withContent: false, height: 1222 });
    const section = createSection([rawCard]);

    initBentoStack(section);

    await nextFrame();
    const content = document.createElement('div');
    content.className = 'explore-card-content';
    Object.defineProperty(content, 'offsetHeight', { value: 528, configurable: true });
    rawCard.append(content);

    await waitUntil(() => section.style.getPropertyValue('--card-height'));
    expect(section.style.getPropertyValue('--card-height')).to.equal('528px');
  });

  it('does not reinitialize a section already marked bento-stack-ready', async () => {
    const card = createCard();
    const section = createSection([card]);
    section.classList.add('bento-stack-ready');

    initBentoStack(section);
    await nextFrame();
    await nextFrame();

    expect(card.style.getPropertyValue('--card-idx')).to.equal('');
  });

  it('does nothing for a section with no cards', () => {
    const section = createSection([]);
    expect(() => initBentoStack(section)).to.not.throw();
    expect(section.classList.contains('bento-stack-ready')).to.be.false;
  });
});
