import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import init from '../../../libs/c2/blocks/tour/tour.js';

describe('Tour', () => {
  it('orders the block as header, tour rows, then footer', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.tour');
    init(el);

    const classes = [...el.children].map((c) => c.className);
    expect(classes).to.eql(['tour-header', 'tour-row row-1', 'tour-row row-2', 'tour-footer']);
  });

  it('flattens and decorates the header row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.tour');
    init(el);

    const header = el.querySelector('.tour-header');
    const eyebrow = header.querySelector(':scope > p.eyebrow');
    expect(eyebrow.textContent.trim()).to.equal('Take the tour');

    const heading = header.querySelector(':scope > h3.heading-6');
    expect(heading).to.exist;
    expect(heading.textContent.trim()).to.equal('Welcome to the product');
  });

  it('builds the footer CTA with federated image, label split and arrow', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.tour');
    init(el);

    const cta = el.querySelector('.tour-footer a.promo-cta');
    expect(cta).to.exist;
    expect(cta.getAttribute('href')).to.equal('https://www.adobe.com/start');
    expect(cta.getAttribute('aria-label')).to.equal('Start the product');
    expect(cta.textContent).to.contain('Get started');
    expect(cta.textContent).to.not.contain('Start the product');
    expect(cta.querySelector('span.icon-button[aria-hidden="true"]')).to.exist;

    const img = cta.querySelector('img');
    expect(img.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/cta.svg');
  });

  it('decorates each multi-column row with body and image', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.tour');
    init(el);

    const rows = el.querySelectorAll('.tour-row');
    expect(rows.length).to.equal(2);

    const first = el.querySelector('.tour-row.row-1');
    const content = first.querySelector(':scope > .tour-row-content');
    expect(content).to.exist;
    expect(content.querySelector('.tour-row-body.body-sm')).to.exist;
    expect(content.querySelector('.tour-row-image')).to.exist;
  });

  it('moves extra images in a row into a centered container', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.tour');
    init(el);

    const row2 = el.querySelector('.tour-row.row-2');
    // first image stays in the row image cell, the extra image moves to the center container
    expect(row2.querySelectorAll('.tour-row-content .tour-row-image p:has(img)').length).to.equal(1);
    const center = row2.querySelector(':scope > .tour-row-image-center');
    expect(center).to.exist;
    expect(center.querySelectorAll('p:has(img)').length).to.equal(1);
  });

  describe('curtain close animation', () => {
    let clock;
    let curtain;

    const openInModal = async ({ reducedMotion = false } = {}) => {
      sinon.stub(window, 'matchMedia').callsFake((query) => ({ matches: query.includes('prefers-reduced-motion') && reducedMotion }));
      document.body.innerHTML = `<div class="dialog-modal" id="tour-modal">${await readFile({ path: './mocks/default.html' })}</div><div class="modal-curtain is-open"></div>`;
      const el = document.querySelector('.tour');
      init(el);
      window.dispatchEvent(new Event('milo:modal:loaded'));
      curtain = document.querySelector('.modal-curtain');
      clock = sinon.useFakeTimers();
    };

    afterEach(() => {
      clock?.restore();
      sinon.restore();
    });

    it('animates the curtain out and removes it on animationend', async () => {
      await openInModal();
      curtain.remove();
      expect(curtain.isConnected).to.be.true;
      expect(curtain.classList.contains('is-closing')).to.be.true;
      expect(curtain.classList.contains('modal-curtain')).to.be.false;

      curtain.dispatchEvent(new Event('animationend'));
      expect(curtain.isConnected).to.be.false;
    });

    it('removes the curtain after the fallback timeout without animationend', async () => {
      await openInModal();
      curtain.remove();
      clock.tick(599);
      expect(curtain.isConnected).to.be.true;
      clock.tick(1);
      expect(curtain.isConnected).to.be.false;
    });

    it('removes the curtain immediately with reduced motion', async () => {
      await openInModal({ reducedMotion: true });
      expect(curtain.classList.contains('tour-curtain')).to.be.true;
      curtain.remove();
      expect(curtain.isConnected).to.be.false;
      expect(curtain.classList.contains('is-closing')).to.be.false;
    });
  });
});
