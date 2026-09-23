import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', miloLibs: '/libs' });

const init = (await import('../../../../libs/c2/blocks/router-marquee/router-marquee.js')).default;

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

describe('router-marquee promo placeholder slide', () => {
  let block;

  before(async () => {
    // registers the shared watchPromoPlaceholders listener that performs the reveal
    const { initMasField } = await import('../../../../libs/blocks/merch/merch.js');
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
