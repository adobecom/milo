import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/merch-card/merch-card.js');
const delay = (duration = 100) => new Promise((resolve) => { setTimeout(resolve, duration); });

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

describe('Merch Card', () => {
  it('Shows segment card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
    const merchCard = await init(document.querySelector('.segment'));
    const heading = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');
    expect(merchCard).to.exist;
    expect(body).to.exist;
    expect(heading).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('segment');
    expect(heading.textContent).to.be.equal('Lorem ipsum dolor sit amet');
    expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.See what\'s included | Learn more');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Special Offers card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/special-offers.html' });
    const merchCard = await init(document.querySelector('.special-offers'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('special-offers');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });
});

describe('Plans Card', () => {
  it('Supports COM Plans card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    const merchCard = await init(document.querySelector('.merch-card.plans.icons.secure'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('plans');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(JSON.parse(merchCard.getAttribute('icons'))).to.have.lengthOf(2);
    expect(merchCard.getAttribute('checkbox-label')).to.be.equal('Add a 30-day free trial of Adobe Stock.*');
    expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.MaecenasSee terms about lorem ipsum');
    expect(detail.textContent).to.be.equal('Maecenas porttitor enim.');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports EDU Plans card with stock', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    const merchCard = await init(document.querySelector('.merch-card.plans.edu.icons.secure'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('plans');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(JSON.parse(merchCard.getAttribute('icons'))).to.have.lengthOf(2);
    expect(merchCard.getAttribute('checkbox-label')).to.be.equal('Add a 30-day free trial of Adobe Stock.*');
    expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.MaecenasSee terms about lorem ipsum');
    expect(detail.textContent).to.be.equal('Maecenas porttitor enim.');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('should skip ribbon and altCta creation', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    const merchCard = await init(document.querySelector('.plans.icons.skip-ribbon.skip-altCta'));
    const heading = merchCard.querySelector('h2[slot=heading-m]');
    const headingXs = merchCard.querySelector('h3[slot=heading-xs]');
    const body = merchCard.querySelector('div[slot=body-xs]');
    const detail = merchCard.querySelector('h5[slot=detail-m]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingXs).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('plans');
    expect(merchCard.getAttribute('badge')).to.not.exist;
    expect(JSON.parse(merchCard.getAttribute('icons'))).to.have.lengthOf(2);
    expect(body.textContent).to.be.equal('Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim.See terms about lorem ipsum');
    expect(detail.textContent).to.be.equal('Maecenas porttitor enim.');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('does not display undefined if no content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    const el = document.querySelector('.merch-card.empty');
    await init(el);
    expect(el.outerHTML.includes('undefined')).to.be.false;
  });
});

describe('Catalog Card', () => {
  it('Supports Catalog card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
    const merchCard = await init(document.querySelector('.merch-card.ribbon'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const actionMenu = merchCard.querySelector('div[slot="action-menu-content"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(actionMenu).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(merchCard.getAttribute('action-menu')).to.be.equal('true');
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
    expect(detail.textContent).to.be.equal('Desktop + Mobile');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Catalog card without badge', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
    const merchCard = await init(document.querySelector('.merch-card.catalog.empty-badge'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const actionMenu = merchCard.querySelector('div[slot="action-menu-content"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(actionMenu).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
    expect(merchCard.getAttribute('badge')).to.not.exist;
    expect(merchCard.getAttribute('action-menu')).to.be.equal('true');
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
    expect(detail.textContent).to.be.equal('Desktop + Mobile');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Catalog card without badge and action-menu', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
    const merchCard = await init(document.querySelector('.merch-card.catalog.empty-action-menu'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const actionMenu = merchCard.querySelector('div[slot="actionMenuContent"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(actionMenu).to.not.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
    expect(merchCard.getAttribute('badge')).to.not.exist;
    expect(merchCard.getAttribute('action-menu')).to.not.exist;
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
    expect(detail.textContent).to.be.equal('Desktop + Mobile');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Supports Catalog card with badge without action-menu', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
    const merchCard = await init(document.querySelector('.merch-card.catalog.empty-badge.action-menu-exist'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingOne = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const actionMenu = merchCard.querySelector('div[slot="actionMenuContent"]');
    const detail = merchCard.querySelector('h5[slot="detail-m"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingOne).to.exist;
    expect(body).to.exist;
    expect(detail).to.exist;
    expect(actionMenu).to.not.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(merchCard.getAttribute('action-menu')).to.not.exist;
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.See terms');
    expect(detail.textContent).to.be.equal('Desktop + Mobile');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });

  it('Parses the filters and types', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/catalog.html' });
    const merchCard = await init(document.querySelector('.merch-card.catalog.tags'));
    expect(merchCard.filters).to.be.deep.equal({
      all: { order: undefined, size: undefined },
      'creativity-design': { order: undefined, size: undefined },
      'graphic-design': { order: undefined, size: undefined },
      photo: { order: undefined, size: undefined },
    });
    expect(merchCard.types).to.equal('web,tablet,desktop');
  });

  it('Supports intro-pricing card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/intro-pricing.html' });
    const merchCard = await init(document.querySelector('.merch-card'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const headingXs = merchCard.querySelector('h3[slot="heading-xs"]');
    const body = merchCard.querySelector('div[slot="body-xs"]');
    const detailBg = merchCard.querySelector('h4[slot="body-xxs"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(headingXs).to.exist;
    expect(body).to.exist;
    expect(detailBg).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('catalog');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(merchCard.classList.contains('intro-pricing')).to.be.true;
    expect(body.textContent).to.be.equal('Create gorgeous images, rich graphics, and incredible art. Save 10% for the first year. Ends Mar 20.');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Learn More');
    expect(buttons[1].textContent).to.be.equal('Save now');
  });
});

describe('UAR Card', () => {
  it('handles decorated <hr>', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/uar-card.html' });
    const cards = document.querySelectorAll('.merch-card');
    for (const card of cards) {
      await init(card);
    }
    const merchCard = document.querySelector('merch-card');
    expect(merchCard.classList.contains('has-divider')).to.be.true;
  });
});
describe('Mini Compare Chart Merch Card', () => {
  it('Supports Mini Compare Chart with footer rows', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/mini-compare-chart.html' });
    const merchCard = await init(document.querySelector('.merch-card.mini-compare-chart'));
    const heading = merchCard.querySelector('h2[slot="heading-m"]');
    const body = merchCard.querySelector('div[slot="body-m"]');
    const priceHeading = merchCard.querySelector('h2[slot="heading-m-price"]');
    const footer = merchCard.querySelector('div[slot="footer"]');
    const buttons = footer.querySelectorAll('.con-button');
    const footerRows = merchCard.querySelector('div[slot="footer-rows"]');
    const footerRowsIcon = footerRows.querySelector('picture.footer-row-icon');
    const footerRowsText = footerRows.querySelector('.footer-row-cell-description');

    expect(merchCard).to.exist;
    expect(heading).to.exist;
    expect(body).to.exist;
    expect(priceHeading).to.exist;
    expect(footerRows).to.exist;
    expect(footerRowsIcon).to.exist;
    expect(footerRowsText).to.exist;
    expect(merchCard.getAttribute('variant')).to.be.equal('mini-compare-chart');
    expect(merchCard.getAttribute('badge-background-color')).to.be.equal('#EDCC2D');
    expect(merchCard.getAttribute('badge-color')).to.be.equal('#000000');
    expect(merchCard.getAttribute('badge-text')).to.be.equal('LOREM IPSUM DOLOR');
    expect(body.textContent).to.be.equal('Get Illustrator on desktop and iPad as part of Creative Cloud. This is promo text');
    expect(buttons.length).to.be.equal(2);
    expect(buttons[0].textContent).to.be.equal('Buy now');
    expect(buttons[1].textContent).to.be.equal('free trial');
  });
  it('Supports Mini Compare Chart with quantity select', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/mini-compare-chart.html' });
    const merchCard = await init(document.querySelector('.merch-card.mini-compare-chart'));
    const quantitySelect = merchCard.querySelector('merch-quantity-select');
    expect(quantitySelect).to.exist;
    expect(quantitySelect.getAttribute('title')).to.equal('Select a quantity:');
    expect(quantitySelect.getAttribute('min')).to.equal('1');
    expect(quantitySelect.getAttribute('max')).to.equal('10');
    expect(quantitySelect.getAttribute('step')).to.equal('1');
  });
});

describe('Merch Card with Offer Selection', () => {
  it('Supports quantity select ', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/selection-cards.html' });
    await init(document.querySelector('.quantity-select'));
    const merchCard = document.querySelector('merch-card');
    const quantitySelect = merchCard.querySelector('merch-quantity-select');
    expect(quantitySelect).to.exist;
    expect(quantitySelect.getAttribute('title')).to.equal('Select a quantity:');
    expect(quantitySelect.getAttribute('min')).to.equal('1');
    expect(quantitySelect.getAttribute('max')).to.equal('3');
    expect(quantitySelect.getAttribute('step')).to.equal('1');
  });

  it('Change quantity select ', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/selection-cards.html' });
    await init(document.querySelector('.quantity-select'));
    await delay();
    const merchCard = document.querySelector('merch-card');
    const quantitySelect = merchCard.querySelector('merch-quantity-select');
    const items = quantitySelect.shadowRoot.querySelectorAll('.item');
    items[2].click();
    const button = merchCard.querySelector('.con-button');
    expect(button.getAttribute('data-quantity')).to.equal('3');
  });

  it('Skip Change quantity select render ', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/selection-cards.html' });
    await init(document.querySelector('.skip-quantity-select-render'));
    await delay();
    expect(document.querySelector('merch-quantity-select')).to.not.exist;
  });
});

describe('Section metadata rules', async () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/card-section-metadata.html' });
  });

  it('should not add default merch-card grid styles', async () => {
    const block = document.getElementById('with2ColumnsGrid');
    const merchCard = await init(block);
    expect(merchCard.parentElement.className).to.not.match(/three-merch-cards/);
  });

  it('should add default merch-card grid styles', async () => {
    const block = document.getElementById('withDefault3ColumnsGrid');
    const merchCard = await init(block);
    expect(merchCard.parentElement.className).to.match(/three-merch-cards/);
  });

  it('should add default merch-card grid styles with 2-up', async () => {
    const block = document.getElementById('with2Up');
    const merchCard = await init(block);
    expect(merchCard.parentElement.className).to.match(/section three-merch-cards product/);
  });
  it('Retains removed-manifest-id', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/mep.html' });
    const merchCard = await init(document.querySelector('.merch-card'));
    expect(merchCard.dataset.removedManifestId).to.exist;
  });
});
