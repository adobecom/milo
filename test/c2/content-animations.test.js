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
  const initTimed = (el) => {
    const items = [section, ...section.querySelectorAll('*')];
    const names = items.map((item) => item.style.animationName);
    items.forEach((item) => { item.style.animationName = 'none'; });
    initContentAnimations(el);
    items.forEach((item, index) => { item.style.animationName = names[index]; });
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
    expect(getComputedStyle(items[0]).animationTimeline).to.equal('auto');
    expect(getComputedStyle(items[0]).opacity).to.equal('0');

    observers[0].callback([{ isIntersecting: false }]);
    expect(items[0].classList.contains('c2-entrance-played')).to.be.false;
    observers[0].callback([{ isIntersecting: true }]);
    expect(observers[0].disconnect.calledOnce).to.be.true;
    expect(items.map((item) => getComputedStyle(item).translate)).to.deep.equal(['0px 24px', '0px 48px', '0px 72px']);
    expect(items.map((item) => Number.parseFloat(getComputedStyle(item).animationDelay.split(',')[1])))
      .to.satisfy((delays) => delays.every((delay, index) => (
        Math.abs(delay - [0.067, 0.217, 0.397][index]) < 0.001
      )));
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
    initTimed(el);
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
    initTimed(el);
    expect(el.children[0].style.getPropertyValue('--c2-entrance-index')).to.equal('1');
    expect(el.children[1].style.getPropertyValue('--c2-entrance-index')).to.equal('0');
    observers[0].callback([{ isIntersecting: true }]);
    expect(getComputedStyle(el.children[0]).animationDelay).to.equal('0.15s, 0.15s, 0s, 0s');
    expect(getComputedStyle(el.children[1]).animationDelay).to.equal('0s, 0s, 0s, 0s');
  });

  it('converts built-in stagger classes without adding entrances elsewhere', () => {
    const el = block('news', '<div class="news-headline">Heading</div><div class="news-items parallax-stagger-ltr"><div>One</div><div>Two</div></div>');
    initContentAnimations(el);
    expect(el.querySelector('.news-headline').classList.contains('c2-entrance-item')).to.be.false;
    expect(el.querySelectorAll('.news-items > .c2-entrance-item')).to.have.length(2);
  });

  it('preserves individual FAQ ranges and latches each native completion', async () => {
    const el = block('faq', '<div><div><h3>First question?</h3><p>Answer</p></div></div><div><div><h3>Second question?</h3><p>Answer</p></div></div>');
    initFAQ(el);
    initContentAnimations(el);
    const items = [...el.querySelectorAll('.faq-item')];
    expect(el.querySelector('.faq-list').classList.contains('c2-entrance-item')).to.be.false;
    expect(observers).to.have.length(0);
    items.forEach((item) => {
      expect(item.classList.contains('c2-entrance-item')).to.be.true;
      expect(getComputedStyle(item).getPropertyValue('--parallax-translate-y').trim()).to.equal('100%');
      expect(getComputedStyle(item).translate).to.equal('none');
      expect(getComputedStyle(item).animationTimeline).to.equal('--faq-trigger-timeline');
      expect(getComputedStyle(item).animationRangeStart).to.equal('entry');
      expect(getComputedStyle(item).animationRangeEnd).to.equal('entry');
    });
    items[0].getAnimations()[0].finish();
    await settle();
    expect(items[0].classList.contains('c2-entrance-played')).to.be.true;
    expect(getComputedStyle(items[0]).animationName).to.equal('none');
    expect(items[1].classList.contains('c2-entrance-played')).to.be.false;
  });

  it('does not suppress unrelated child animations', () => {
    const el = block('rich-content parallax-line-height', '<style>.test-animated-child { animation: test-child-motion 2s linear infinite; } @keyframes test-child-motion { to { opacity: .5; } }</style><div class="foreground test-animated-child"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(el);
    expect(getComputedStyle(el.querySelector('.foreground')).animationName).to.equal('test-child-motion');
  });

  it('does not reset unrelated animations on a rich-content grouping container', () => {
    const el = block('rich-content parallax-line-height test-animated-group', '<style>.test-animated-group { animation: test-group-motion 5s linear infinite; } @keyframes test-group-motion { from { color: red; } to { color: blue; } }</style><div class="content"><h2>Title</h2></div>');
    const animation = el.getAnimations()[0];
    initContentAnimations(el);
    expect(getComputedStyle(el).animationName).to.equal('test-group-motion');
    expect(el.getAnimations()[0]).to.equal(animation);
    expect(el.querySelector('h2').classList.contains('c2-entrance-item')).to.be.true;
  });

  it('preserves an existing custom animation on a text target instead of replacing it', () => {
    const el = block('rich-content parallax-line-height', '<style>.test-animated-caption { animation: test-caption-motion 5s linear infinite; } @keyframes test-caption-motion { from { color: red; } to { color: blue; } }</style><div class="content"><h2 class="test-animated-caption">Title</h2><p>Body</p></div>');
    const title = el.querySelector('h2');
    const animation = title.getAnimations()[0];
    initContentAnimations(el);
    expect(title.classList.contains('c2-entrance-original')).to.be.true;
    expect(getComputedStyle(title).animationName).to.equal('test-caption-motion');
    expect(title.getAnimations()[0]).to.equal(animation);
    observers[0].callback([{ isIntersecting: true }]);
    expect(getComputedStyle(el.querySelector('p')).animationName).to.include('c2-entrance-rise');
    expect(title.getAnimations()[0]).to.equal(animation);
  });

  it('keeps Quick Actions native timing even when its block stylesheet loads last', async () => {
    const el = block('quick-actions', '<style>.quick-actions-grid.parallax-stagger-ltr > :not([class*="section-"]) { animation-name: enable-parallax-stagger; }</style><div class="quick-actions-grid parallax-stagger-ltr"><a class="quick-actions-tile">One</a><a class="quick-actions-tile">Two</a></div>');
    initContentAnimations(el);
    el.querySelectorAll('.quick-actions-tile').forEach((item) => {
      expect(getComputedStyle(item).animationName).to.equal('enable-parallax-stagger');
      expect(getComputedStyle(item).animationTimeline).to.equal('--parallax-stagger-timeline');
      item.getAnimations()[0].finish();
    });
    await settle();
    el.querySelectorAll('.quick-actions-tile').forEach((item) => {
      expect(getComputedStyle(item).animationName).to.equal('none');
      expect(item.classList.contains('c2-entrance-settled')).to.be.true;
    });
  });

  it('preserves Quick Actions original animation objects, offsets and scroll ranges', async () => {
    const el = block('quick-actions', '<div class="quick-actions-grid parallax-stagger-ltr six-up"><a>One</a><a>Two</a><a>Three</a><a>Four</a><a>Five</a><a>Six</a></div>');
    const grid = el.firstElementChild;
    grid.style.display = 'grid';
    await settle();
    const items = [...grid.children];
    const properties = ['animationName', 'animationTimeline', 'animationRangeStart',
      'animationRangeEnd', 'animationDuration', 'animationDelay', 'animationTimingFunction',
      'transform', 'opacity'];
    const styles = items.map((item) => (
      properties.map((property) => getComputedStyle(item)[property])
    ));
    const animations = items.map((item) => item.getAnimations()[0]);
    initContentAnimations(el);
    expect(animations[0].effect.getKeyframes()[0].transform).to.include('72px');
    expect(animations[5].effect.getKeyframes()[0].transform).to.include('588px');
    items.forEach((item, index) => {
      expect(properties.map((property) => getComputedStyle(item)[property]))
        .to.deep.equal(styles[index]);
      expect(item.getAnimations()[0]).to.equal(animations[index]);
    });
    expect(observers).to.have.length(0);
  });

  it('preserves hover filters and transforms before and after the entrance', async () => {
    const el = block('hover-list parallax-line-height', '<div>Card</div>');
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

  it('retains combined authored move, opacity, scale and blur on their original timeline', async () => {
    const el = block('parallax-move-up parallax-opacity parallax-scale-up parallax-blur', '<p>Content</p>');
    initContentAnimations(el);
    await settle();
    const style = getComputedStyle(el);
    expect(style.animationName).to.equal('enable-parallax');
    expect(style.animationTimeline).to.equal('view(40% 10%)');
    const from = el.getAnimations()[0].effect.getKeyframes()[0];
    expect(from.transform).to.include('100px');
    expect(from.transform).to.include('0.9');
    expect(from.filter).to.equal('blur(10px)');
  });

  it('preserves authored masonry offsets and easing with a visible row stagger', async () => {
    section.classList.add('parallax-stagger-ltr', 'masonry-layout');
    section.style.cssText += ';display:grid;grid-template-columns:1fr 1fr';
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    first.style.setProperty('--parallax-stagger-index', '0.25');
    second.style.setProperty('--parallax-stagger-index', '0.75');
    initContentAnimations(first);
    await settle();
    expect(getComputedStyle(first).translate).to.equal('none');
    expect(first.getAnimations()[0].effect.getKeyframes()[0].transform).to.include('37.5px');
    expect(second.getAnimations()[0].effect.getKeyframes()[0].transform).to.include('112.5px');
    expect(getComputedStyle(second).animationDelay).to.equal('0s');
    expect(getComputedStyle(first).animationTimeline).to.equal('view()');
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

  it('clears old text targets when authoring switches to a whole-block native entrance', async () => {
    const el = block('rich-content parallax-line-height', '<div class="content"><h2>Title</h2><p>Body</p></div>');
    initContentAnimations(el);
    el.classList.add('parallax-opacity');
    await settle();
    expect(el.classList.contains('c2-entrance-original')).to.be.true;
    expect(el.classList.contains('c2-entrance-item')).to.be.true;
    [...el.querySelector('.content').children].forEach((item) => {
      expect(item.classList.contains('c2-entrance-item')).to.be.false;
      expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal('');
      expect(getComputedStyle(item).opacity).to.equal('1');
    });
  });

  it('does not replay text when a completed whole-block entrance changes authoring', async () => {
    const el = block('rich-content parallax-opacity', '<div class="content"><h2>Title</h2><p>Body</p></div>');
    initContentAnimations(el);
    el.getAnimations()[0].finish();
    await settle();
    el.classList.remove('parallax-opacity');
    el.classList.add('parallax-line-height');
    await settle();
    expect(el.classList.contains('c2-entrance-item')).to.be.false;
    [...el.querySelector('.content').children].forEach((item, index) => {
      expect(item.classList.contains('c2-entrance-settled')).to.be.true;
      expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal(String(index));
      expect(item.style.getPropertyValue('--c2-entrance-count')).to.equal('2');
      expect(getComputedStyle(item).animationName).to.equal('none');
      expect(getComputedStyle(item).opacity).to.equal('1');
    });
    expect(observers).to.have.length(0);
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
    expect(observers).to.have.length(0);
    section.classList.add('two-up');
    await settle();
    expect(observers).to.have.length(0);
    expect([first, second, third].map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '1', '0']);
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
    expect(observers).to.have.length(0);
    expect([first, second, third].map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '1', '0']);
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

  it('supports any number of rich-content items within the prototype timing envelope', () => {
    const el = block('rich-content parallax-line-height', `<div class="content">${Array.from({ length: 12 }, (_, index) => `<p>Item ${index}</p>`).join('')}</div>`);
    initContentAnimations(el);
    const items = [...el.querySelector('.content').children];
    items.forEach((item, index) => {
      expect(item.hasAttribute('data-c2-entrance-step')).to.be.false;
      expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal(String(index));
      expect(item.style.getPropertyValue('--c2-entrance-count')).to.equal('12');
    });
    observers[0].callback([{ isIntersecting: true }]);
    const delays = items.map((item) => (
      Number.parseFloat(getComputedStyle(item).animationDelay.split(',')[1])
    ));
    expect(delays.every((delay, index) => !index || delay > delays[index - 1])).to.be.true;
    expect(getComputedStyle(items[0]).translate).to.equal('0px 24px');
    expect(getComputedStyle(items[11]).translate).to.equal('0px 72px');
    items.forEach((item) => {
      expect(getComputedStyle(item).animationDuration.split(',')[0]).to.equal('1.05s');
    });
  });

  it('distributes arbitrary hover-list content without numbered selectors or growing durations', () => {
    const el = block('hover-list parallax-line-height', Array.from({ length: 12 }, (_, index) => `<div>Item ${index}</div>`).join(''));
    initContentAnimations(el);
    observers[0].callback([{ isIntersecting: true }]);
    const delays = [...el.children].map((item) => (
      Number.parseFloat(getComputedStyle(item).animationDelay.split(',')[1])
    ));
    expect(delays.every((delay, index) => !index || delay > delays[index - 1])).to.be.true;
    expect(delays[0]).to.be.closeTo(0.036, 0.001);
    expect(delays[11]).to.be.closeTo(0.245, 0.001);
    expect(getComputedStyle(el.children[0]).translate).to.equal('0px 64px');
    expect(getComputedStyle(el.children[11]).translate).to.equal('0px 96px');
  });

  it('preserves in-flight timing and metadata across resize and late-loading RTL siblings', () => {
    section.classList.add('parallax-stagger-rtl');
    section.style.cssText += ';display:grid;grid-template-columns:1fr 1fr';
    const first = block('base-card', '<p>First</p>');
    const second = block('base-card', '<p>Loading</p>');
    second.dataset.blockStatus = 'loading';
    initTimed(first);
    observers[0].callback([{ isIntersecting: true }]);
    const animation = first.getAnimations()[0];
    const index = first.style.getPropertyValue('--c2-entrance-index');
    const count = first.style.getPropertyValue('--c2-entrance-count');
    second.dataset.blockStatus = 'loaded';
    initContentAnimations(second);
    window.dispatchEvent(new Event('resize'));
    expect(first.classList.contains('c2-entrance-settled')).to.be.false;
    expect(first.getAnimations()[0]).to.equal(animation);
    expect(first.style.getPropertyValue('--c2-entrance-index')).to.equal(index);
    expect(first.style.getPropertyValue('--c2-entrance-count')).to.equal(count);
  });

  it('does not let an aborted focus listener restore cleared entrance classes', async () => {
    const el = block('rich-content parallax-line-height', '<div class="content"><p><a href="#">Link</a></p></div>');
    initContentAnimations(el);
    window.dispatchEvent(new Event('resize'));
    const item = el.querySelector('p');
    section.classList.add('parallax-garage-door-reveal');
    await settle();
    el.dispatchEvent(new Event('focusin'));
    expect(item.classList.contains('c2-entrance-played')).to.be.false;
    expect(item.classList.contains('c2-entrance-settled')).to.be.false;
    expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal('');
    expect(item.style.getPropertyValue('--c2-entrance-count')).to.equal('');
    expect(observers.every((observer) => observer.disconnect.called)).to.be.true;
  });

  it('latches native completion once, not bubbled animationend or an unfinished notification', async () => {
    const el = block('parallax-move-up parallax-opacity', '<p>Content</p>');
    initContentAnimations(el);
    const animation = el.getAnimations()[0];
    el.dispatchEvent(new AnimationEvent('animationend', { animationName: 'enable-parallax' }));
    animation.dispatchEvent(new Event('finish'));
    expect(el.classList.contains('c2-entrance-played')).to.be.false;
    animation.finish();
    await settle();
    expect(el.classList.contains('c2-entrance-settled')).to.be.true;
    expect(getComputedStyle(el).animationName).to.equal('none');
    initContentAnimations(el);
    window.dispatchEvent(new Event('resize'));
    expect(getComputedStyle(el).animationName).to.equal('none');
    expect(observers).to.have.length(0);
  });

  it('settles focused native content without waiting for its CSS range to finish', () => {
    const el = block('parallax-move-up parallax-opacity', '<p>Content</p>');
    initContentAnimations(el);
    el.dispatchEvent(new Event('focusin'));
    expect(el.classList.contains('c2-entrance-settled')).to.be.true;
    expect(getComputedStyle(el).opacity).to.equal('1');
    expect(getComputedStyle(el).animationName).to.equal('none');
  });

  it('keeps unrelated animations on the same element running after the native entrance finishes', async () => {
    const el = block('parallax-move-up test-native-with-pulse', '<style>.test-native-with-pulse { animation-name: enable-parallax, test-content-pulse; animation-duration: auto, 10s; animation-timeline: view(40% 10%), auto; animation-iteration-count: 1, infinite; } @keyframes test-content-pulse { from { color: red; } to { color: blue; } }</style><p>Content</p>');
    const pulse = el.getAnimations().find((animation) => animation.animationName === 'test-content-pulse');
    initContentAnimations(el);
    el.getAnimations().find((animation) => animation.animationName === 'enable-parallax').finish();
    await settle();
    expect(getComputedStyle(el).animationName).to.equal('none, test-content-pulse');
    expect(el.getAnimations()).to.deep.equal([pulse]);
    expect(pulse.playState).to.equal('running');
    expect(pulse.effect.getTiming().duration).to.equal(10000);
  });

  it('preserves native card hover opacity after disabling its finished entrance', async () => {
    const style = document.createElement('style');
    style.textContent = '.test-opacity-hover.active-hover { opacity: 0.87; }';
    section.append(style);
    const el = block('side-by-side parallax-stagger-ltr', '<div class="test-opacity-hover active-hover">Card</div>');
    const item = el.firstElementChild;
    initContentAnimations(el);
    expect(getComputedStyle(item).opacity).to.equal('0.87');
    item.getAnimations()[0].finish();
    await settle();
    expect(getComputedStyle(item).opacity).to.equal('0.87');
    item.classList.remove('active-hover');
    expect(getComputedStyle(item).opacity).to.equal('1');
  });

  it('waits for all native entrance effects before settling a combined animation', async () => {
    const el = block('parallax-move-up test-two-native-entrances', '<style>.test-two-native-entrances { animation-name: enable-parallax, enable-grid-parallax; }</style><p>Content</p>');
    initContentAnimations(el);
    const animations = el.getAnimations();
    expect(animations).to.have.length(2);
    animations[0].finish();
    await settle();
    expect(el.classList.contains('c2-entrance-settled')).to.be.false;
    animations[1].finish();
    await settle();
    expect(el.classList.contains('c2-entrance-settled')).to.be.true;
    expect(getComputedStyle(el).animationName).to.equal('none, none');
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

  it('keeps arbitrary aside text ordered before the prototype media and accordion phases', () => {
    section.classList.add('parallax-double-garage-door');
    const rich = block('rich-content', `<div class="content">${Array.from({ length: 12 }, (_, index) => `<p>Item ${index}</p>`).join('')}</div>`);
    const aside = block('split-aside-grid', '<div class="split-aside-grid-items">Aside</div><div class="split-aside-grid-stack">Image</div>');
    initContentAnimations(aside);
    const items = [...rich.querySelector('.content').children];
    const orders = items.map((item) => Number(getComputedStyle(item).getPropertyValue('--c2-aside-order')));
    expect(orders[0]).to.equal(0);
    expect(orders[11]).to.equal(2);
    if (CSS.supports('order', 'sibling-index()')) {
      expect(orders.every((order, index) => !index || order > orders[index - 1])).to.be.true;
    }
    expect(getComputedStyle(aside.lastElementChild).getPropertyValue('--c2-aside-order')).to.equal('3');
    expect(getComputedStyle(aside.firstElementChild).getPropertyValue('--c2-aside-order')).to.equal('4');
    expect(items.every((item) => !item.hasAttribute('style'))).to.be.true;
  });
});
