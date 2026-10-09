import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import initContentAnimations from '../../libs/c2/content-animations.js';
import initFAQ from '../../libs/c2/blocks/faq/faq.js';

describe('C2 content animations', () => {
  let observers;
  let stub;
  let stylesheet;
  let faqStylesheet;
  let section;

  const settle = () => new Promise((resolve) => { requestAnimationFrame(resolve); });
  const block = (classes, html) => {
    const el = document.createElement('div');
    el.className = classes;
    el.dataset.blockStatus = 'loaded';
    el.innerHTML = html;
    section.append(el);
    return el;
  };

  before(async () => {
    stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/libs/c2/styles/styles.css';
    await new Promise((resolve, reject) => {
      stylesheet.onload = resolve;
      stylesheet.onerror = reject;
      document.head.append(stylesheet);
    });
    faqStylesheet = document.createElement('link');
    faqStylesheet.rel = 'stylesheet';
    faqStylesheet.href = '/libs/c2/blocks/faq/faq.css';
    await new Promise((resolve, reject) => {
      faqStylesheet.onload = resolve;
      faqStylesheet.onerror = reject;
      document.head.append(faqStylesheet);
    });
  });

  beforeEach(() => {
    observers = [];
    stub = sinon.stub(window, 'IntersectionObserver').callsFake(function Observer(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observe = sinon.spy();
      this.disconnect = sinon.spy();
      observers.push(this);
    });
    section = document.createElement('div');
    section.className = 'section';
    section.style.cssText = `margin-top:${window.innerHeight * 2}px;width:600px;position:relative`;
    document.body.append(section);
  });

  afterEach(() => {
    section.remove();
    stub.restore();
  });

  after(() => {
    stylesheet.remove();
    faqStylesheet.remove();
  });

  it('leaves unanimated content and specialty garage-door reveals unchanged', () => {
    const plain = block('rich-content', '<div class="foreground"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(plain);
    expect(plain.querySelector('.c2-entrance-item')).to.be.null;

    section.classList.add('parallax-garage-door-reveal');
    const hero = block('rich-content parallax-line-height', '<div class="foreground"><div class="content"><h2>Hero</h2></div></div>');
    initContentAnimations(hero);
    expect(hero.querySelector('.c2-entrance-item')).to.be.null;
    expect(getComputedStyle(section).animationName).to.equal('garage-door-grow');
    expect(observers).to.have.length(0);
  });

  it('triggers authored rich-content text once without a scroll timeline', async () => {
    const el = block('rich-content parallax-line-height', '<div class="foreground"><div class="content"><p>Eyebrow</p><h2>Title</h2><p>Body</p></div></div>');
    initContentAnimations(el);
    const items = [...el.querySelector('.content').children];
    expect(items.map((item) => getComputedStyle(item).getPropertyValue('--c2-entrance-y').trim())).to.deep.equal(['24px', '48px', '72px']);
    expect(getComputedStyle(items[0]).animationTimeline).to.equal('auto');
    expect(getComputedStyle(items[0]).opacity).to.equal('0');

    observers[0].callback([{ isIntersecting: false }]);
    expect(items[0].classList.contains('c2-entrance-played')).to.be.false;
    observers[0].callback([{ isIntersecting: true }]);
    expect(observers[0].disconnect.calledOnce).to.be.true;
    await settle();
    items.forEach((item) => item.getAnimations().forEach((animation) => animation.finish()));
    expect(getComputedStyle(items[0]).opacity).to.equal('1');
    initContentAnimations(el);
    expect(observers).to.have.length(1);
    expect(items.every((item) => item.classList.contains('c2-entrance-played'))).to.be.true;
  });

  it('groups whole cards by row rather than their internal content', () => {
    const el = block('side-by-side parallax-stagger-ltr', '<div class="card"><h3>One</h3></div><div class="card"><h3>Two</h3></div><div class="card"><h3>Three</h3></div>');
    el.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px';
    initContentAnimations(el);
    expect(el.querySelectorAll('.c2-entrance-item')).to.have.length(3);
    expect(el.querySelector('h3').classList.contains('c2-entrance-item')).to.be.false;
    expect(observers).to.have.length(2);
    observers[0].callback([{ isIntersecting: true }]);
    expect(el.children[0].classList.contains('c2-entrance-played')).to.be.true;
    expect(el.children[1].classList.contains('c2-entrance-played')).to.be.true;
    expect(el.children[2].classList.contains('c2-entrance-played')).to.be.false;
  });

  it('preserves right-to-left authored staggering', () => {
    const el = block('side-by-side parallax-stagger-rtl', '<div>One</div><div>Two</div>');
    el.style.cssText = 'display:flex';
    initContentAnimations(el);
    expect(el.children[0].dataset.c2EntranceStep).to.equal('1');
    expect(el.children[1].dataset.c2EntranceStep).to.equal('0');
    expect(getComputedStyle(el.children[0]).getPropertyValue('--c2-entrance-delay').trim()).to.equal('150ms');
    expect(getComputedStyle(el.children[1]).getPropertyValue('--c2-entrance-delay').trim()).to.equal('0ms');
  });

  it('converts built-in stagger classes without adding entrances elsewhere', () => {
    const el = block('news', '<div class="news-headline">Heading</div><div class="news-items parallax-stagger-ltr"><div>One</div><div>Two</div></div>');
    initContentAnimations(el);
    expect(el.querySelector('.news-headline').classList.contains('c2-entrance-item')).to.be.false;
    expect(el.querySelectorAll('.news-items > .c2-entrance-item')).to.have.length(2);
  });

  it('preserves individual FAQ entrances and observes each question trigger', () => {
    const el = block('faq', '<div><div><h3>First question?</h3><p>Answer</p></div></div><div><div><h3>Second question?</h3><p>Answer</p></div></div>');
    initFAQ(el);
    initContentAnimations(el);
    const items = [...el.querySelectorAll('.faq-item')];
    expect(el.querySelector('.faq-list').classList.contains('c2-entrance-item')).to.be.false;
    expect(observers).to.have.length(2);
    items.forEach((item, index) => {
      expect(item.classList.contains('c2-entrance-item')).to.be.true;
      expect(getComputedStyle(item).getPropertyValue('--c2-entrance-y').trim()).to.equal('100%');
      expect(getComputedStyle(item).translate).to.equal('none');
      expect(getComputedStyle(item).animationTimeline).to.equal('auto');
      expect(observers[index].options.rootMargin).to.equal(`0px 0px ${Math.round(-window.innerHeight * 0.1)}px 0px`);
      expect(observers[index].observe.calledWith(item.querySelector('.faq-trigger'))).to.be.true;
    });
    observers[0].callback([{ isIntersecting: true }]);
    expect(items[0].classList.contains('c2-entrance-played')).to.be.true;
    expect(items[1].classList.contains('c2-entrance-played')).to.be.false;
  });

  it('does not suppress unrelated child animations', () => {
    const el = block('rich-content parallax-line-height', '<style>.test-animated-child { animation: test-child-motion 2s linear infinite; } @keyframes test-child-motion { to { opacity: .5; } }</style><div class="foreground test-animated-child"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(el);
    expect(getComputedStyle(el.querySelector('.foreground')).animationName).to.equal('test-child-motion');
  });

  it('keeps the one-time entrance when Quick Actions adds its mobile animation rule', () => {
    const el = block('quick-actions', '<style>.quick-actions-grid.parallax-stagger-ltr > :not([class*="section-"]) { animation-name: enable-parallax-stagger; }</style><div class="quick-actions-grid parallax-stagger-ltr"><a class="quick-actions-tile">One</a><a class="quick-actions-tile">Two</a></div>');
    initContentAnimations(el);
    observers.forEach((observer) => observer.callback([{ isIntersecting: true }]));
    el.querySelectorAll('.quick-actions-tile').forEach((item) => {
      expect(getComputedStyle(item).animationName).to.equal('c2-entrance-rise, c2-entrance-fade, none, none');
      expect(getComputedStyle(item).animationTimeline).to.equal('auto');
      expect(getComputedStyle(item).animationDuration).to.equal('0.4s, 0.4s, 0.4s, 0.4s');
      expect(getComputedStyle(item).animationDelay).to.equal('0s, 0s, 0s, 0s');
    });
  });

  it('keeps Quick Actions offsets on a shared short entrance instead of accumulated delays', () => {
    const el = block('quick-actions', '<div class="quick-actions-grid parallax-stagger-ltr six-up"><a>One</a><a>Two</a><a>Three</a><a>Four</a><a>Five</a><a>Six</a></div>');
    const grid = el.firstElementChild;
    grid.style.display = 'grid';
    initContentAnimations(el);
    observers[0].callback([{ isIntersecting: true }]);
    const items = [...grid.children];
    expect(getComputedStyle(items[0]).translate).to.equal('0px 72px');
    expect(getComputedStyle(items[5]).translate).to.equal('0px 588px');
    items.forEach((item) => {
      expect(getComputedStyle(item).animationDuration).to.equal('0.4s, 0.4s, 0.4s, 0.4s');
      expect(getComputedStyle(item).animationDelay).to.equal('0s, 0s, 0s, 0s');
    });
  });

  it('preserves hover filters and transforms before and after the entrance', async () => {
    const el = block('side-by-side parallax-stagger-ltr', '<div>Card</div>');
    const item = el.firstElementChild;
    item.style.filter = 'brightness(0.98)';
    item.style.transform = 'scale(1.015)';
    initContentAnimations(el);
    expect(getComputedStyle(item).animationName).to.equal('none');
    expect(getComputedStyle(item).filter).to.equal('brightness(0.98)');
    expect(getComputedStyle(item).scale).to.equal('none');
    observers[0].callback([{ isIntersecting: true }]);
    expect(getComputedStyle(item).animationName).to.equal('c2-entrance-rise, c2-entrance-fade, none, none');
    await settle();
    item.getAnimations().forEach((animation) => animation.finish());
    expect(getComputedStyle(item).filter).to.equal('brightness(0.98)');
    expect(getComputedStyle(item).transform).to.equal('matrix(1.015, 0, 0, 1.015, 0, 0)');
  });

  it('retains combined authored scale and blur effects', () => {
    const el = block('parallax-move-up parallax-opacity parallax-scale-up parallax-blur', '<p>Content</p>');
    initContentAnimations(el);
    observers[0].callback([{ isIntersecting: true }]);
    const style = getComputedStyle(el);
    expect(style.animationName).to.include('c2-entrance-scale');
    expect(style.animationName).to.include('c2-entrance-blur');
    expect(style.scale).to.equal('0.9');
    expect(style.filter).to.equal('blur(10px)');
  });

  it('preserves authored masonry offsets and easing with a visible row stagger', () => {
    section.classList.add('parallax-stagger-ltr', 'masonry-layout');
    section.style.cssText += ';display:grid;grid-template-columns:1fr 1fr';
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    first.style.setProperty('--parallax-stagger-index', '0.25');
    second.style.setProperty('--parallax-stagger-index', '0.75');
    initContentAnimations(first);
    expect(getComputedStyle(first).translate).to.equal('none');
    observers[0].callback([{ isIntersecting: true }]);
    expect(getComputedStyle(first).translate).to.equal('0px 37.5px');
    expect(getComputedStyle(second).translate).to.equal('0px 112.5px');
    expect(getComputedStyle(second).animationDelay).to.equal('0.15s, 0.15s, 0s, 0s');
    expect(getComputedStyle(first).animationTimingFunction).to.include('cubic-bezier(0.42, 0, 0, 1)');
  });

  it('reveals focused content before its observer triggers', () => {
    const el = block('rich-content parallax-line-height', '<div class="content"><p><a href="#">Link</a></p></div>');
    initContentAnimations(el);
    el.querySelector('a').focus();
    expect(el.querySelector('.c2-entrance-item').classList.contains('c2-entrance-played')).to.be.true;
    expect(getComputedStyle(el.querySelector('.c2-entrance-item')).opacity).to.equal('1');
    expect(observers[0].disconnect.called).to.be.true;
  });

  it('shows content loaded above the viewport immediately', () => {
    section.style.marginTop = '0';
    const el = block('rich-content parallax-line-height', '<div class="content"><h2>Visible title</h2></div>');
    initContentAnimations(el);
    expect(el.querySelector('.c2-entrance-item').classList.contains('c2-entrance-played')).to.be.true;
  });

  it('preserves played state when viewport content is replaced', async () => {
    const el = block('rich-content parallax-line-height', '<div class="content"><h2>Desktop title</h2></div>');
    initContentAnimations(el);
    observers[0].callback([{ isIntersecting: true }]);
    el.innerHTML = '<div class="content"><h2>Mobile title</h2></div>';
    await settle();
    expect(el.querySelector('h2').classList.contains('c2-entrance-played')).to.be.true;
    expect(getComputedStyle(el.querySelector('h2')).opacity).to.equal('1');
    expect(getComputedStyle(el.querySelector('h2')).animationName).to.equal('none');
    expect(observers).to.have.length(1);
  });

  it('waits for block decoration before registering an authored entrance', () => {
    const el = block('rich-content parallax-line-height', '<div>Undecorated</div>');
    el.dataset.blockStatus = 'loading';
    initContentAnimations(el);
    expect(observers).to.have.length(0);
    el.innerHTML = '<div class="content"><h2>Decorated</h2></div>';
    el.dataset.blockStatus = 'loaded';
    initContentAnimations(el);
    expect(observers).to.have.length(1);
  });

  it('waits for lazy-loaded children of an authored staggered section', () => {
    section.classList.add('parallax-stagger-ltr');
    const first = block('base-card', '<h2>Ready</h2>');
    const second = block('base-card', '<h2>Loading</h2>');
    second.dataset.blockStatus = 'loading';
    initContentAnimations(first);
    expect(first.classList.contains('c2-entrance-item')).to.be.true;
    expect(second.classList.contains('c2-entrance-item')).to.be.false;
    second.dataset.blockStatus = 'loaded';
    initContentAnimations(second);
    expect(second.classList.contains('c2-entrance-item')).to.be.true;
  });

  it('does not interrupt a card entrance when another card finishes lazy loading', () => {
    section.classList.add('parallax-stagger-ltr');
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    second.dataset.blockStatus = 'loading';
    initContentAnimations(first);
    observers[0].callback([{ isIntersecting: true }]);
    const animation = first.getAnimations()[0];
    second.dataset.blockStatus = 'loaded';
    initContentAnimations(second);
    expect(first.classList.contains('c2-entrance-settled')).to.be.false;
    expect(first.getAnimations()[0]).to.equal(animation);
  });

  it('updates row staggering when section decoration changes the card layout', async () => {
    section.classList.add('parallax-stagger-ltr');
    section.style.display = 'grid';
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    const third = block('explore-card', '<h3>Three</h3>');
    initContentAnimations(first);
    expect(observers).to.have.length(3);
    section.classList.add('two-up');
    await settle();
    expect(observers).to.have.length(5);
    expect([first, second, third].map((item) => item.dataset.c2EntranceStep)).to.deep.equal(['0', '1', '0']);
  });

  it('waits for the hidden section to finish loading before grouping card rows', async () => {
    section.dataset.status = 'decorated';
    section.classList.add('parallax-stagger-ltr', 'two-up');
    section.style.display = 'grid';
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    const third = block('explore-card', '<h3>Three</h3>');
    initContentAnimations(first);
    expect(observers).to.have.length(0);
    expect(section.querySelector('.c2-entrance-item')).to.be.null;
    delete section.dataset.status;
    await settle();
    expect(observers).to.have.length(2);
    expect([first, second, third].map((item) => item.dataset.c2EntranceStep)).to.deep.equal(['0', '1', '0']);
    observers[0].callback([{ isIntersecting: true }]);
    expect(third.classList.contains('c2-entrance-played')).to.be.false;
  });

  it('handles a detached section-level animation source', () => {
    section.classList.add('parallax-stagger-ltr');
    const el = block('base-card', '<h2>Card</h2>');
    section.remove();
    expect(() => initContentAnimations(el)).not.to.throw();
  });

  it('restores specialty motion when responsive authoring introduces a garage door', async () => {
    const el = block('rich-content parallax-line-height', '<div class="foreground"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(el);
    expect(el.querySelector('.c2-entrance-item')).to.exist;
    section.classList.add('parallax-garage-door-reveal');
    await settle();
    expect(el.classList.contains('c2-entrance-group')).to.be.false;
    expect(el.querySelector('.c2-entrance-item')).to.be.null;
    expect(getComputedStyle(section).animationName).to.equal('garage-door-grow');
  });

  it('adds scroll-linked aside reveals while preserving the existing door motion', () => {
    section.classList.add('parallax-double-garage-door');
    section.style.paddingTop = '124px';
    const rich = block('rich-content parallax-line-height', '<div class="content"><p>Eyebrow</p><h2>Title</h2><p>Body</p></div>');
    const aside = block('split-aside-grid parallax-stagger-ltr', '<div class="split-aside-grid-items"><button>Accordion</button></div><div class="split-aside-grid-stack"><div class="media">Image</div></div>');
    const hover = block('hover-list', '<div class="hover-list-desc-wrapper">Heading</div><div class="hover-list-col">List</div>');
    initContentAnimations(aside);

    expect(getComputedStyle(section).animationName).to.equal('dg-top-door, dg-exit');
    const targets = [...rich.querySelector('.content').children,
      aside.querySelector('.split-aside-grid-stack'), aside.querySelector('.split-aside-grid-items')];
    expect(targets.map((item) => getComputedStyle(item).getPropertyValue('--c2-aside-order').trim())).to.deep.equal(['0', '1', '2', '3', '4']);
    expect(getComputedStyle(targets[0]).animationTimeline).to.equal('--c2-aside-timeline, --c2-aside-timeline');
    expect(getComputedStyle(aside.querySelector('.media')).animationName).to.equal('none');
    expect(targets.every((item) => !item.hasAttribute('style'))).to.be.true;
    expect(hover.querySelectorAll('.c2-entrance-item')).to.have.length(2);
    expect(getComputedStyle(hover.children[0]).animationTimeline).to.equal('auto');
  });

  it('removes scroll-linked motion when responsive authoring removes the garage door', async () => {
    section.classList.add('parallax-double-garage-door');
    block('rich-content', '<div class="content"><h2>Title</h2></div>');
    const aside = block('split-aside-grid', '<div class="split-aside-grid-items">Aside</div><div class="split-aside-grid-stack">Image</div>');
    initContentAnimations(aside);
    section.classList.remove('parallax-double-garage-door');
    await settle();
    expect(getComputedStyle(section.querySelector('.content h2')).animationName).to.equal('none');
    expect(getComputedStyle(aside.querySelector('.split-aside-grid-stack')).animationName).to.equal('none');
  });
});
