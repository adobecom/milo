import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/router-marquee/router-marquee.js';

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

  it('builds a nav card icon from a plain svg link when it was not converted to an img', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/link-icon.html' });
    const block = document.querySelector('.router-marquee');
    init(block);

    const cards = mobileVp(block).querySelectorAll('.rm-card');
    expect(cards.length).to.equal(2);
    expect(cards[0].querySelector('.rm-card-icon').getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/card-one.svg');
    expect(cards[0].querySelector('.rm-card-label').textContent.trim()).to.equal('Slide one');
  });

  it('does not throw when a card icon link is merged into the cta paragraph', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/link-icon.html' });
    const block = document.querySelector('.router-marquee');
    expect(() => init(block)).to.not.throw();

    // decorateCtas strips the icon link that shares its paragraph with the cta,
    // so the second card renders without an icon instead of crashing card building
    const cards = mobileVp(block).querySelectorAll('.rm-card');
    expect(cards[1].querySelector('.rm-card-icon').getAttribute('src')).to.equal('');
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
