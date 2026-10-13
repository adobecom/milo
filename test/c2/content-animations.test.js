import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { emulateMedia, setViewport } from '@web/test-runner-commands';
import initContentAnimations from '../../libs/c2/content-animations.js';
import initFAQ from '../../libs/c2/blocks/faq/faq.js';

describe('C2 content animations', () => {
  let observers;
  let stub;
  let stylesheet;
  let faqStylesheet;
  let section;

  const settle = () => new Promise((resolve) => { requestAnimationFrame(resolve); });
  const entry = (target, isIntersecting = true, bottom = 1) => (
    { target, isIntersecting, boundingClientRect: { bottom } }
  );
  const enter = (observer, ...targets) => observer.callback(
    (targets.length ? targets : [null]).map((target) => entry(target)),
  );
  const resize = async () => {
    window.dispatchEvent(new Event('resize'));
    await settle();
  };
  const block = (classes, html) => {
    const el = document.createElement('div');
    el.className = classes;
    el.dataset.blockStatus = 'loaded';
    el.innerHTML = html;
    section.append(el);
    return el;
  };

  // Outside the aside, hover-list has no entrance of its own.
  const asideHoverList = (html) => {
    section.classList.add('parallax-double-garage-door');
    block('rich-content', '<div class="content"><h2>Title</h2></div>');
    block('split-aside-grid', '<div class="split-aside-grid-items">Aside</div><div class="split-aside-grid-stack">Image</div>');
    return block('hover-list', html);
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

  afterEach(async () => {
    section.remove();
    stub.restore();
    await setViewport({ width: 800, height: 600 });
  });

  after(() => {
    stylesheet.remove();
    faqStylesheet.remove();
  });

  it('leaves hero rich content and specialty garage-door reveals unchanged', () => {
    const plain = block('rich-content hero', '<div class="foreground"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(section);
    expect(plain.querySelector('.c2-entrance-item')).to.be.null;

    section.classList.add('parallax-garage-door-reveal');
    const hero = block('rich-content', '<div class="foreground"><div class="content"><h2>Hero</h2></div></div>');
    initContentAnimations(section);
    expect(hero.querySelector('.c2-entrance-item')).to.be.null;
    expect(getComputedStyle(section).animationName).to.equal('garage-door-grow');
    expect(observers).to.have.length(0);
  });

  it('triggers rich-content text once without a scroll timeline', async () => {
    const el = block('rich-content', '<div class="foreground"><div class="content"><p>Eyebrow</p><h2>Title</h2><p>Body</p></div></div>');
    initContentAnimations(section);
    const items = [...el.querySelector('.content').children];
    expect(getComputedStyle(items[0]).animationTimeline).to.equal('auto');
    expect(getComputedStyle(items[0]).opacity).to.equal('0');

    observers[0].callback([entry(null, false)]);
    expect(items[0].classList.contains('c2-entrance-played')).to.be.false;
    enter(observers[0]);
    expect(observers[0].disconnect.calledOnce).to.be.true;
    expect(items.map((item) => getComputedStyle(item).translate)).to.deep.equal(['0px 24px', '0px 48px', '0px 72px']);
    expect(items.map((item) => Number.parseFloat(getComputedStyle(item).animationDelay.split(',')[1])))
      .to.satisfy((delays) => delays.every((delay, index) => (
        Math.abs(delay - [0.067, 0.217, 0.397][index]) < 0.001
      )));
    await settle();
    items.forEach((item) => item.getAnimations().forEach((animation) => animation.finish()));
    expect(getComputedStyle(items[0]).opacity).to.equal('1');
    initContentAnimations(section);
    expect(observers).to.have.length(1);
    expect(items.every((item) => item.classList.contains('c2-entrance-played'))).to.be.true;
  });

  it('enters a multi-column stagger grid as one on desktop', async () => {
    await setViewport({ width: 1280, height: 800 });
    const el = block('side-by-side parallax-stagger-ltr', '<div class="card"><h3>One</h3></div><div class="card"><h3>Two</h3></div><div class="card"><h3>Three</h3></div>');
    el.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px';
    initContentAnimations(section);
    expect(observers).to.have.length(1);
    expect([...el.children].map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '1', '2']);
    enter(observers[0]);
    expect([...el.children].every((item) => item.classList.contains('c2-entrance-played'))).to.be.true;
  });

  it('groups whole cards by row rather than their internal content', async () => {
    await setViewport({ width: 600, height: 800 });
    const el = block('side-by-side parallax-stagger-ltr', '<div class="card"><h3>One</h3></div><div class="card"><h3>Two</h3></div><div class="card"><h3>Three</h3></div>');
    el.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px';
    initContentAnimations(section);
    const cards = [...el.children];
    expect(el.querySelectorAll('.c2-entrance-item')).to.have.length(3);
    expect(el.querySelector('h3').classList.contains('c2-entrance-item')).to.be.false;
    expect(cards.map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '1', '0']);
    enter(observers[0], cards[0], cards[1]);
    expect(cards.map((item) => item.classList.contains('c2-entrance-played'))).to.deep.equal([true, true, false]);
    enter(observers[0], cards[2]);
    expect(cards[2].classList.contains('c2-entrance-played')).to.be.true;
    expect(observers[0].disconnect.calledOnce).to.be.true;
  });

  it('preserves right-to-left authored staggering', () => {
    const el = block('side-by-side parallax-stagger-rtl', '<div>One</div><div>Two</div>');
    el.style.cssText = 'display:flex';
    initContentAnimations(section);
    expect(el.children[0].style.getPropertyValue('--c2-entrance-index')).to.equal('1');
    expect(el.children[1].style.getPropertyValue('--c2-entrance-index')).to.equal('0');
    enter(observers[0]);
    expect(getComputedStyle(el.children[0]).animationDelay).to.equal('0.15s, 0.15s, 0s, 0s, 0s');
    expect(getComputedStyle(el.children[1]).animationDelay).to.equal('0s, 0s, 0s, 0s, 0s');
  });

  it('converts built-in stagger classes without adding entrances elsewhere', () => {
    const el = block('news', '<div class="news-headline">Heading</div><div class="news-items parallax-stagger-ltr"><div>One</div><div>Two</div></div>');
    initContentAnimations(section);
    expect(el.querySelector('.news-headline').classList.contains('c2-entrance-item')).to.be.false;
    expect(el.querySelectorAll('.news-items > .c2-entrance-item')).to.have.length(2);
  });

  it('triggers each FAQ item once from its question at the stage start line', () => {
    const el = block('faq', '<div><div><h3>First question?</h3><p>Answer</p></div></div><div><div><h3>Second question?</h3><p>Answer</p></div></div>');
    initFAQ(el);
    initContentAnimations(section);
    const items = [...el.querySelectorAll('.faq-item')];
    expect(el.querySelector('.faq-list').classList.contains('c2-entrance-item')).to.be.false;
    expect(observers).to.have.length(2);
    items.forEach((item, index) => {
      expect(observers[index].observe.firstCall.args[0]).to.equal(item.querySelector('.faq-trigger'));
      expect(observers[index].options.rootMargin).to.equal('0px 0px -10% 0px');
      expect(getComputedStyle(item).animationTimeline).to.equal('auto');
      expect(getComputedStyle(item).opacity).to.equal('0');
    });
    enter(observers[0]);
    expect(getComputedStyle(items[0]).translate).to.equal('0px 100%');
    expect(getComputedStyle(items[0]).animationDuration).to.equal('1.05s, 1.05s, 1.05s, 1.05s, 1.05s');
    expect(getComputedStyle(items[0]).animationTimingFunction).to.include('cubic-bezier(0.42, 0, 0, 1)');
    expect(items[1].classList.contains('c2-entrance-played')).to.be.false;
  });

  it('does not suppress unrelated child animations', () => {
    const el = block('rich-content', '<style>.test-animated-child { animation: test-child-motion 2s linear infinite; } @keyframes test-child-motion { to { opacity: .5; } }</style><div class="foreground test-animated-child"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(section);
    expect(getComputedStyle(el.querySelector('.foreground')).animationName).to.equal('test-child-motion');
  });

  it('does not reset unrelated animations on a rich-content grouping container', () => {
    const el = block('rich-content test-animated-group', '<style>.test-animated-group { animation: test-group-motion 5s linear infinite; } @keyframes test-group-motion { from { color: red; } to { color: blue; } }</style><div class="content"><h2>Title</h2></div>');
    const animation = el.getAnimations()[0];
    initContentAnimations(section);
    expect(getComputedStyle(el).animationName).to.equal('test-group-motion');
    expect(el.getAnimations()[0]).to.equal(animation);
    expect(el.querySelector('h2').classList.contains('c2-entrance-item')).to.be.true;
  });

  it('preserves an existing custom animation on a text target instead of replacing it', () => {
    const el = block('rich-content', '<style>.test-animated-caption { animation: test-caption-motion 5s linear infinite; } @keyframes test-caption-motion { from { color: red; } to { color: blue; } }</style><div class="content"><h2 class="test-animated-caption">Title</h2><p>Body</p></div>');
    const title = el.querySelector('h2');
    const animation = title.getAnimations()[0];
    initContentAnimations(section);
    expect(title.classList.contains('c2-entrance-item')).to.be.false;
    expect(getComputedStyle(title).animationName).to.equal('test-caption-motion');
    expect(title.getAnimations()[0]).to.equal(animation);
    enter(observers[0]);
    expect(getComputedStyle(el.querySelector('p')).animationName).to.include('c2-entrance-rise');
    expect(title.getAnimations()[0]).to.equal(animation);
  });

  it('leaves no scroll-driven motion on entrance classes before they trigger', () => {
    section.classList.add('parallax-stagger-ltr');
    const whole = block('parallax-move-up parallax-opacity parallax-scale-up parallax-blur', '<p>Content</p>');
    const el = block('quick-actions', '<div class="quick-actions-grid parallax-stagger-ltr"><a class="quick-actions-tile">One</a><a class="quick-actions-tile">Two</a></div>');
    const tiles = el.querySelectorAll('.quick-actions-tile');
    [section, whole, el.firstElementChild, ...tiles].forEach((item) => {
      expect(getComputedStyle(item).animationName).to.equal('none');
      expect(getComputedStyle(item).viewTimelineName).to.equal('none');
    });
    section.classList.remove('parallax-stagger-ltr');
    initContentAnimations(section);
    tiles.forEach((item) => {
      expect(getComputedStyle(item).animationName).to.equal('none');
      expect(getComputedStyle(item).opacity).to.equal('0');
    });
    observers.forEach((observer) => enter(observer));
    tiles.forEach((item) => {
      expect(getComputedStyle(item).animationName).to.include('c2-entrance-rise');
      expect(getComputedStyle(item).animationTimeline).to.equal('auto');
    });
  });

  it('keeps Quick Actions stagger offsets without their scroll ranges', () => {
    const el = block('quick-actions', '<div class="quick-actions-grid parallax-stagger-ltr six-up"><a>One</a><a>Two</a><a>Three</a><a>Four</a><a>Five</a><a>Six</a></div>');
    const grid = el.firstElementChild;
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(6, 1fr)';
    initContentAnimations(section);
    const items = [...grid.children];
    expect(observers).to.have.length(1);
    enter(observers[0]);
    expect(getComputedStyle(items[0]).translate).to.equal('0px 72px');
    expect(getComputedStyle(items[5]).translate).to.equal('0px 588px');
    items.forEach((item) => {
      expect(getComputedStyle(item).animationTimeline).to.equal('auto');
      expect(getComputedStyle(item).animationRangeStart).to.equal('normal');
      expect(getComputedStyle(item).animationDuration.split(',')[0]).to.equal('1.05s');
    });
  });

  it('preserves hover filters and transforms before and after the entrance', async () => {
    const el = asideHoverList('<div>Card</div>');
    const item = el.firstElementChild;
    item.style.filter = 'brightness(0.98)';
    item.style.transform = 'scale(1.015)';
    initContentAnimations(section);
    expect(getComputedStyle(item).animationName).to.equal('none');
    expect(getComputedStyle(item).filter).to.equal('brightness(0.98)');
    expect(getComputedStyle(item).scale).to.equal('none');
    enter(observers[0]);
    expect(getComputedStyle(item).animationName).to.equal('c2-entrance-rise, c2-entrance-fade, none, none, none');
    await settle();
    item.getAnimations().forEach((animation) => animation.finish());
    expect(getComputedStyle(item).filter).to.equal('brightness(0.98)');
    expect(getComputedStyle(item).transform).to.equal('matrix(1.015, 0, 0, 1.015, 0, 0)');
  });

  it('plays combined authored move, opacity, scale and blur as one timed entrance', () => {
    const el = block('parallax-move-up parallax-opacity parallax-scale-up parallax-blur', '<p>Content</p>');
    initContentAnimations(section);
    expect(getComputedStyle(el).animationName).to.equal('none');
    enter(observers[0]);
    const style = getComputedStyle(el);
    expect(style.animationName).to.equal('c2-entrance-rise, c2-entrance-fade, c2-entrance-scale, c2-entrance-blur, none');
    expect(style.animationTimeline).to.equal('auto');
    expect(style.animationTimingFunction).to.include('cubic-bezier(0.42, 0, 0, 1)');
    expect(style.animationDelay).to.equal('0s, 0s, 0s, 0s, 0s');
    expect(style.translate).to.equal('0px 100px');
    expect(style.scale).to.equal('0.9');
    expect(style.filter).to.equal('blur(10px)');
    expect(style.opacity).to.equal('0');
  });

  it('preserves authored masonry offsets and easing with a visible row stagger', () => {
    section.classList.add('parallax-stagger-ltr', 'masonry-layout');
    section.style.cssText += ';display:grid;grid-template-columns:1fr 1fr';
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    first.style.setProperty('--parallax-stagger-index', '0.25');
    second.style.setProperty('--parallax-stagger-index', '0.75');
    initContentAnimations(section);
    enter(observers[0], first, second);
    expect(getComputedStyle(first).translate).to.equal('0px 37.5px');
    expect(getComputedStyle(second).translate).to.equal('0px 112.5px');
    expect(getComputedStyle(second).animationDelay.split(',')[0]).to.equal('0.15s');
    expect(getComputedStyle(first).animationTimeline).to.equal('auto');
    expect(getComputedStyle(first).animationTimingFunction).to.include('cubic-bezier(0.42, 0, 0, 1)');
  });

  it('reveals focused content before its observer triggers', () => {
    const el = block('rich-content', '<div class="content"><p><a href="#">Link</a></p></div>');
    initContentAnimations(section);
    el.querySelector('a').focus();
    expect(el.querySelector('.c2-entrance-item').classList.contains('c2-entrance-played')).to.be.true;
    expect(getComputedStyle(el.querySelector('.c2-entrance-item')).opacity).to.equal('1');
    expect(observers[0].disconnect.called).to.be.true;
  });

  it('plays content already scrolled past on the first observer report', () => {
    const el = block('rich-content', '<div class="content"><h2>Title</h2></div>');
    initContentAnimations(section);
    observers[0].callback([entry(el.querySelector('h2'), false, -10)]);
    expect(el.querySelector('h2').classList.contains('c2-entrance-played')).to.be.true;
    expect(el.querySelector('h2').classList.contains('c2-entrance-settled')).to.be.false;
  });

  it('waits for block decoration before registering an authored entrance', () => {
    const el = block('rich-content', '<div>Undecorated</div>');
    el.dataset.blockStatus = 'loading';
    initContentAnimations(section);
    expect(observers).to.have.length(0);
    el.innerHTML = '<div class="content"><h2>Decorated</h2></div>';
    el.dataset.blockStatus = 'loaded';
    initContentAnimations(section);
    expect(observers).to.have.length(1);
  });

  it('skips section children whose block did not finish loading', () => {
    section.classList.add('parallax-stagger-ltr');
    const first = block('base-card', '<h2>Ready</h2>');
    const second = block('base-card', '<h2>Failed</h2>');
    second.dataset.blockStatus = 'failed';
    initContentAnimations(section);
    expect(first.classList.contains('c2-entrance-item')).to.be.true;
    expect(second.classList.contains('c2-entrance-item')).to.be.false;
  });

  it('does not interrupt a card entrance when another card finishes lazy loading', () => {
    section.classList.add('parallax-stagger-ltr');
    const first = block('explore-card', '<h3>One</h3>');
    const second = block('explore-card', '<h3>Two</h3>');
    second.dataset.blockStatus = 'loading';
    initContentAnimations(section);
    enter(observers[0]);
    const animation = first.getAnimations()[0];
    expect(animation).to.exist;
    second.dataset.blockStatus = 'loaded';
    initContentAnimations(section);
    expect(first.classList.contains('c2-entrance-settled')).to.be.false;
    expect(first.getAnimations()[0]).to.equal(animation);
  });

  it('updates row staggering when a resize changes the card layout', async () => {
    await setViewport({ width: 1280, height: 800 });
    section.classList.add('parallax-stagger-ltr', 'masonry-layout');
    section.style.display = 'grid';
    const cards = [block('explore-card', '<h3>One</h3>'), block('explore-card', '<h3>Two</h3>'), block('explore-card', '<h3>Three</h3>')];
    initContentAnimations(section);
    expect(cards.map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '0', '0']);
    section.style.gridTemplateColumns = '1fr 1fr';
    await resize();
    expect(cards.map((item) => item.style.getPropertyValue('--c2-entrance-index'))).to.deep.equal(['0', '1', '0']);
  });

  it('handles a detached section-level animation source', () => {
    section.classList.add('parallax-stagger-ltr');
    block('base-card', '<h2>Card</h2>');
    section.remove();
    expect(() => initContentAnimations(section)).not.to.throw();
  });

  it('restores specialty motion when responsive authoring introduces a garage door', async () => {
    const el = block('rich-content', '<div class="foreground"><div class="content"><h2>Title</h2></div></div>');
    initContentAnimations(section);
    expect(el.querySelector('.c2-entrance-item')).to.exist;
    section.classList.add('parallax-garage-door-reveal');
    await resize();
    expect(el.classList.contains('c2-entrance-group')).to.be.false;
    expect(el.querySelector('.c2-entrance-item')).to.be.null;
    expect(observers[0].disconnect.called).to.be.true;
    expect(getComputedStyle(section).animationName).to.equal('garage-door-grow');
  });

  it('shows content that responsive authoring adds in view without replaying it', async () => {
    section.classList.add('parallax-garage-door-reveal');
    const el = block('rich-content', '<div class="content"><h2>Title</h2></div>');
    initContentAnimations(section);
    expect(observers).to.have.length(0);
    section.classList.remove('parallax-garage-door-reveal');
    await resize();
    const title = el.querySelector('h2');
    observers[0].callback([entry(title)]);
    expect(title.classList.contains('c2-entrance-settled')).to.be.true;
  });

  it('supports any number of rich-content items within the prototype timing envelope', () => {
    const el = block('rich-content', `<div class="content">${Array.from({ length: 12 }, (_, index) => `<p>Item ${index}</p>`).join('')}</div>`);
    initContentAnimations(section);
    const items = [...el.querySelector('.content').children];
    items.forEach((item, index) => {
      expect(item.hasAttribute('data-c2-entrance-step')).to.be.false;
      expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal(String(index));
      expect(item.style.getPropertyValue('--c2-entrance-count')).to.equal('12');
    });
    enter(observers[0]);
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
    const el = asideHoverList(Array.from({ length: 12 }, (_, index) => `<div>Item ${index}</div>`).join(''));
    initContentAnimations(section);
    enter(observers[0]);
    const delays = [...el.children].map((item) => (
      Number.parseFloat(getComputedStyle(item).animationDelay.split(',')[1])
    ));
    expect(delays.every((delay, index) => !index || delay > delays[index - 1])).to.be.true;
    expect(delays[0]).to.be.closeTo(0.036, 0.001);
    expect(delays[11]).to.be.closeTo(0.245, 0.001);
    expect(getComputedStyle(el.children[0]).translate).to.equal('0px 64px');
    expect(getComputedStyle(el.children[11]).translate).to.equal('0px 96px');
  });

  it('triggers from the first item and fades linearly in eased progress like the prototype', () => {
    const el = asideHoverList('<div>Headline</div><div>List</div>');
    el.style.paddingTop = '128px';
    initContentAnimations(section);
    expect(observers[0].observe.firstCall.args[0]).to.equal(el.children[0]);
    enter(observers[0]);
    const easing = (item) => getComputedStyle(item).animationTimingFunction
      .split(/,\s(?=cubic|ease|linear)/)[1].match(/[\d.]+/g).map(Number);
    const near = (values, expected) => values.every((value, index) => (
      Math.abs(value - expected[index]) < 0.001
    ));
    // Fade window 0.10–0.72 is the matching slice of the ease-out cubic; 0.55–1 is its tail.
    expect(near(easing(el.children[0]), [1 / 3, 0.468, 2 / 3, 0.7851])).to.be.true;
    expect(near(easing(el.children[1]), [1 / 3, 1, 2 / 3, 1])).to.be.true;
  });

  it('preserves in-flight timing and metadata across resize and late-loading RTL siblings', async () => {
    section.classList.add('parallax-stagger-rtl');
    section.style.cssText += ';display:grid;grid-template-columns:1fr 1fr';
    const first = block('base-card', '<p>First</p>');
    const second = block('base-card', '<p>Loading</p>');
    second.dataset.blockStatus = 'loading';
    initContentAnimations(section);
    enter(observers[0]);
    const animation = first.getAnimations()[0];
    const index = first.style.getPropertyValue('--c2-entrance-index');
    const count = first.style.getPropertyValue('--c2-entrance-count');
    second.dataset.blockStatus = 'loaded';
    initContentAnimations(section);
    window.dispatchEvent(new Event('resize'));
    await settle();
    expect(first.classList.contains('c2-entrance-settled')).to.be.false;
    expect(first.getAnimations()[0]).to.equal(animation);
    expect(first.style.getPropertyValue('--c2-entrance-index')).to.equal(index);
    expect(first.style.getPropertyValue('--c2-entrance-count')).to.equal(count);
  });

  it('does not let an aborted focus listener restore cleared entrance classes', async () => {
    const el = block('rich-content', '<div class="content"><p><a href="#">Link</a></p></div>');
    initContentAnimations(section);
    const item = el.querySelector('p');
    section.classList.add('parallax-garage-door-reveal');
    await resize();
    el.dispatchEvent(new Event('focusin'));
    expect(item.classList.contains('c2-entrance-played')).to.be.false;
    expect(item.classList.contains('c2-entrance-settled')).to.be.false;
    expect(item.style.getPropertyValue('--c2-entrance-index')).to.equal('');
    expect(item.style.getPropertyValue('--c2-entrance-count')).to.equal('');
    expect(observers.every((observer) => observer.disconnect.called)).to.be.true;
  });

  it('coalesces resize bursts into one shared refresh per frame', async () => {
    block('rich-content', '<div class="content"><p>One</p></div>');
    initContentAnimations(section);
    await settle();
    const frame = sinon.spy(window, 'requestAnimationFrame');
    try {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      expect(frame.calledOnce).to.be.true;
      await settle();
      const calls = frame.callCount;
      window.dispatchEvent(new Event('resize'));
      expect(frame.callCount).to.equal(calls + 1);
    } finally {
      frame.restore();
    }
    await settle();
  });

  it('settles focused whole-block content before its trigger line', () => {
    const el = block('parallax-move-up parallax-opacity', '<p>Content</p>');
    initContentAnimations(section);
    el.dispatchEvent(new Event('focusin'));
    expect(el.classList.contains('c2-entrance-settled')).to.be.true;
    expect(getComputedStyle(el).opacity).to.equal('1');
    expect(getComputedStyle(el).animationName).to.equal('none');
  });

  it('leaves content with its own extra animations untouched', () => {
    const el = block('parallax-move-up test-native-with-pulse', '<style>.test-native-with-pulse { animation: test-content-pulse 10s linear infinite; } @keyframes test-content-pulse { from { color: red; } to { color: blue; } }</style><p>Content</p>');
    const animations = el.getAnimations();
    initContentAnimations(section);
    expect(el.classList.contains('c2-entrance-item')).to.be.false;
    expect(getComputedStyle(el).animationName).to.equal('test-content-pulse');
    expect(el.getAnimations()).to.deep.equal(animations);
    expect(observers).to.have.length(0);
  });

  it('returns cards to their own hover opacity once the entrance finishes', async () => {
    const style = document.createElement('style');
    style.textContent = '.test-opacity-hover.active-hover { opacity: 0.87; }';
    section.append(style);
    const el = block('side-by-side parallax-stagger-ltr', '<div class="test-opacity-hover active-hover">Card</div>');
    const item = el.firstElementChild;
    initContentAnimations(section);
    expect(getComputedStyle(item).opacity).to.equal('0');
    enter(observers[0]);
    await settle();
    item.getAnimations().forEach((animation) => animation.finish());
    expect(item.getAnimations()).to.have.length(0);
    expect(getComputedStyle(item).opacity).to.equal('0.87');
    item.classList.remove('active-hover');
    expect(getComputedStyle(item).opacity).to.equal('1');
  });

  it('plays base-card media zoom and featured radius once, in place, inside a staggered card', async () => {
    const cardStylesheet = document.createElement('link');
    cardStylesheet.rel = 'stylesheet';
    cardStylesheet.href = '/libs/c2/blocks/base-card/base-card.css';
    await new Promise((resolve) => {
      cardStylesheet.onload = resolve;
      document.head.append(cardStylesheet);
    });
    try {
      const el = block('parallax-stagger-ltr', '<div class="base-card featured" data-block-status="loaded"><div class="media parallax-featured-card-media"><picture class="parallax-scale-down"><img alt=""></picture></div></div>');
      const media = el.querySelector('.media');
      const picture = el.querySelector('picture');
      expect(getComputedStyle(media).animationName).to.equal('none');
      expect(getComputedStyle(picture).animationName).to.equal('none');
      initContentAnimations(section);
      expect(el.firstElementChild.classList.contains('c2-entrance-item')).to.be.true;
      [media, picture].forEach((item) => {
        expect(item.classList.contains('c2-entrance-effect')).to.be.true;
        expect(getComputedStyle(item).opacity).to.equal('1');
      });
      expect(getComputedStyle(picture).scale).to.equal('1.1');
      expect(getComputedStyle(media).clipPath).to.equal('inset(0px)');
      expect(observers).to.have.length(3);
      observers.forEach((observer) => enter(observer));
      expect(getComputedStyle(picture).animationName).to.equal('c2-entrance-rise, c2-entrance-fade, c2-entrance-scale, none, none');
      expect(getComputedStyle(media).animationName)
        .to.equal('c2-entrance-rise, c2-entrance-fade, none, none, grow-featured-card-radius');
      expect(getComputedStyle(picture).translate).to.equal('0px');
      expect(getComputedStyle(picture).opacity).to.equal('1');
      await settle();
      [media, picture].forEach((item) => item.getAnimations()
        .forEach((animation) => animation.finish()));
      expect(getComputedStyle(picture).scale).to.equal('none');
      expect(getComputedStyle(media).clipPath).to.not.equal('inset(0px)');
    } finally {
      cardStylesheet.remove();
    }
  });

  it('plays the social-proof stretch once from its trigger instead of a scroll timeline', async () => {
    const proofStylesheet = document.createElement('link');
    proofStylesheet.rel = 'stylesheet';
    proofStylesheet.href = '/libs/c2/blocks/social-proof/social-proof.css';
    await new Promise((resolve) => {
      proofStylesheet.onload = resolve;
      document.head.append(proofStylesheet);
    });
    try {
      const el = block('social-proof', '<div><div class="foreground"><h3>Quote</h3></div><div class="media"><picture><img alt=""></picture></div></div>');
      const row = el.firstElementChild;
      const img = el.querySelector('img');
      [row, row.firstElementChild, img].forEach((item) => {
        expect(getComputedStyle(item).animationName).to.equal('none');
        expect(getComputedStyle(item).animationTimeline).to.equal('auto');
      });
      initContentAnimations(section);
      expect(el.classList.contains('c2-entrance-effect')).to.be.true;
      expect(getComputedStyle(el).opacity).to.equal('1');
      expect(getComputedStyle(row).transform).to.not.equal('none');
      expect(observers).to.have.length(1);
      enter(observers[0]);
      expect(getComputedStyle(row).animationName).to.equal('social-proof-stretch');
      expect(getComputedStyle(row.firstElementChild).animationName).to.equal('social-proof-content-enter');
      expect(getComputedStyle(img).animationName).to.equal('social-proof-image-zoom');
      expect(getComputedStyle(row).animationDuration).to.equal('1.05s');
      await settle();
      [el, row, row.firstElementChild, img].forEach((item) => item.getAnimations()
        .forEach((animation) => animation.finish()));
      [row, img].forEach((item) => {
        expect(new DOMMatrix(getComputedStyle(item).transform).isIdentity).to.be.true;
      });
    } finally {
      proofStylesheet.remove();
    }
  });

  it('shows timed entrances and aside content without motion when reduced motion is preferred', async () => {
    section.classList.add('parallax-double-garage-door');
    const rich = block('rich-content', '<div class="content"><p>Eyebrow</p><h2>Title</h2></div>');
    const aside = block('split-aside-grid', '<div class="split-aside-grid-items"><button>Accordion</button></div><div class="split-aside-grid-stack"></div>');
    const timed = block('base-card', '<p>Card</p>');
    timed.classList.add('c2-entrance-item', 'c2-entrance-played');
    const targets = [rich.querySelector('h2'), aside.querySelector('.split-aside-grid-items'), timed];
    expect(getComputedStyle(timed).animationName).to.not.equal('none');
    await emulateMedia({ reducedMotion: 'reduce' });
    try {
      targets.forEach((item) => {
        expect(getComputedStyle(item).animationName).to.equal('none');
        expect(getComputedStyle(item).opacity).to.equal('1');
      });
    } finally {
      await emulateMedia({ reducedMotion: 'no-preference' });
    }
  });

  it('adds scroll-linked aside reveals while preserving the existing door motion', () => {
    section.classList.add('parallax-double-garage-door');
    section.style.paddingTop = '124px';
    const rich = block('rich-content', '<div class="content"><p>Eyebrow</p><h2>Title</h2><p>Body</p></div>');
    const aside = block('split-aside-grid parallax-stagger-ltr', '<div class="split-aside-grid-items"><button>Accordion</button></div><div class="split-aside-grid-stack"><div class="media">Image</div></div>');
    const hover = block('hover-list', '<div class="hover-list-desc-wrapper">Heading</div><div class="hover-list-col">List</div>');
    initContentAnimations(section);

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
    initContentAnimations(section);
    section.classList.remove('parallax-double-garage-door');
    await settle();
    expect(getComputedStyle(section.querySelector('.content h2')).animationName).to.equal('none');
    expect(getComputedStyle(aside.querySelector('.split-aside-grid-stack')).animationName).to.equal('none');
  });

  it('keeps arbitrary aside text ordered before the prototype media and accordion phases', () => {
    section.classList.add('parallax-double-garage-door');
    const rich = block('rich-content', `<div class="content">${Array.from({ length: 12 }, (_, index) => `<p>Item ${index}</p>`).join('')}</div>`);
    const aside = block('split-aside-grid', '<div class="split-aside-grid-items">Aside</div><div class="split-aside-grid-stack">Image</div>');
    initContentAnimations(section);
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
