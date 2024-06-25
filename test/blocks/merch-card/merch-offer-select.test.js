import { expect } from '@esm-bundle/chai';
import { mockFetch, unmockFetch, readMockText } from '../merch/mocks/fetch.js';
import { mockIms, unmockIms } from '../merch/mocks/ims.js';
import { initService } from '../../../libs/blocks/merch/merch.js';
import initCard from '../../../libs/blocks/merch-card/merch-card.js';
import { setConfig } from '../../../libs/utils/utils.js';

const delay = (duration = 100) => new Promise((resolve) => { setTimeout(resolve, duration); });

function validateMerchOffer(offer, selected, text, badgeText, osi, description) {
  expect(offer.selected).to.equal(selected);
  expect(offer.getAttribute('text')).to.equal(text);
  expect(offer.getAttribute('badge-text')).to.equal(badgeText);
  expect(offer.getAttribute('tabindex')).to.equal('0');
  const price = offer.getOptionValue('price');
  expect(price.dataset.wcsOsi).to.equal(osi);
  expect(price.getAttribute('slot')).to.equal('price');
  const cta = offer.getOptionValue('cta');
  expect(cta.dataset.wcsOsi).to.equal(osi);
  expect(cta.getAttribute('slot')).to.equal('cta');
  if (description) {
    expect(offer.getOptionValue('description').innerText).to.equal(description);
  } else {
    expect(offer.getOptionValue('description')).not.to.exist;
  }
}

function validateMerchCard(card, badge, description, osi) {
  if (badge) {
    expect(card.shadowRoot.querySelector('div.plans-badge').innerText).to.equal(badge);
  } else {
    expect(card.shadowRoot.querySelector('div.plans-badge')).not.to.exist;
  }
  expect(card.querySelector('div[slot="body-xs"] p[slot="description"]').innerText).to.equal(description);
  expect(card.querySelector('div[slot="footer"] a[slot="cta"]').dataset.wcsOsi).to.equal(osi);
  expect(card.querySelector('div[slot="body-xs"] span[is="inline-price"]').dataset.wcsOsi).to.equal(osi);
}

const config = {
  codeRoot: '/libs',
  env: { name: 'prod' },
  imsClientId: 'test_client_id',
};

setConfig(config);

describe('Merch Offer Select', () => {
  before(async () => {
    mockIms();
    await mockFetch();
    await initService(true);
    document.body.innerHTML = await readMockText('/test/blocks/merch-card/mocks/selection-cards.html');
    await initCard(document.querySelector('.acrobat'));
    await delay();
  });

  after(() => {
    unmockIms();
    unmockFetch();
  });

  it('Should render offer select and inital card state', async () => {
    const merchCard = document.querySelector('merch-card');
    const merchOffers = merchCard.querySelector('merch-offer-select').querySelectorAll('merch-offer');
    expect(merchOffers.length).to.equal(3);
    validateMerchOffer(merchOffers[0], true, 'Annual, monthly payment', 'Recommended', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE', null);
    validateMerchOffer(merchOffers[1], false, 'Annual, one-time payment', 'Best Offer', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA', 'New Description');
    validateMerchCard(merchCard, 'Recommended', 'Access advanced PDF.', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE');
  });

  it('Should select and render second offer', async () => {
    const merchCard = document.querySelector('merch-card');
    merchCard.querySelectorAll('merch-offer')[1].click();
    await delay();

    const merchOffers = merchCard.querySelector('merch-offer-select').querySelectorAll('merch-offer');
    validateMerchOffer(merchOffers[0], false, 'Annual, monthly payment', 'Recommended', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE', null);
    validateMerchOffer(merchOffers[1], true, 'Annual, one-time payment', 'Best Offer', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA', 'New Description');
    validateMerchCard(merchCard, 'Best Offer', 'New Description', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA');
  });

  it('Should remove badge and set back description', async () => {
    const merchCard = document.querySelector('merch-card');
    merchCard.querySelectorAll('merch-offer')[2].click();
    await delay();
    validateMerchCard(merchCard, null, 'Access advanced PDF.', 'BWGlzrQG6jgkf-_zPJm55M5QpAyb4skYi05BizQIJ3U');
  });

  it('Should display photography storage card with horizontal options, and price before description, and 2 ctas', async () => {
    await initCard(document.querySelector('.photography'));
    await delay();
    const merchCard = document.querySelector('merch-card.photography');
    const merchOffers = merchCard.querySelectorAll('merch-offer');
    expect(merchOffers.length).to.equal(2);
    // options should be displayed horizontally
    expect(merchOffers[0].getBoundingClientRect().y)
      .to.equal(merchOffers[1].getBoundingClientRect().y);
    const description = merchCard.querySelector('p[slot="description"]');
    const price = merchCard.querySelector('[slot="price"]');
    // price should be above description
    expect(description.getBoundingClientRect().y).to.greaterThan(price.getBoundingClientRect().y);
    // there should be 2 CTAs
    merchOffers[1].click();
    await delay(200);
    const osis = [...merchCard.querySelectorAll('.action-area a')]
      .map((a) => a.dataset.wcsOsi);
    expect(osis).to.deep.equal(['1TB_TRIAL', '1TB_BUY']);
  });
});

describe('Merch quantity select', () => {
  let merchCard;
  let quantitySelect;
  let items;

  before(async () => {
    mockIms();
    await mockFetch();
    await initService(true);
    document.body.innerHTML = await readMockText('/test/blocks/merch-card/mocks/selection-cards.html');
    await initCard(document.querySelector('.quantity-select-with-offer-selection'));
    await delay();
    merchCard = document.querySelector('merch-card');
    quantitySelect = merchCard.querySelector('merch-quantity-select');
    items = quantitySelect.shadowRoot.querySelectorAll('.item');
  });

  after(() => {
    unmockIms();
    unmockFetch();
  });

  it('Should render quantity select and initial card state', async () => {
    const merchOffers = merchCard.querySelector('merch-quantity-select').querySelectorAll('merch-offer');
    await delay(50);
    validateMerchOffer(merchOffers[0], true, null, null, '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE', null);
    validateMerchOffer(merchOffers[1], false, null, null, 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA', null);
    validateMerchCard(merchCard, null, 'Access advanced PDF.', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE');
  });

  it('Should render and select 3 offer ', async () => {
    items[2].click();
    await delay(200);

    validateMerchCard(merchCard, null, 'Access advanced PDF.', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA');
    expect(merchCard.querySelector('div[slot="footer"] a[slot="cta"]').dataset.quantity).to.equal('3');
  });

  it('Should render and select 1 offer when 2 is not specified ', async () => {
    items[1].click();
    await delay(200);

    validateMerchCard(merchCard, null, 'Access advanced PDF.', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE');
    expect(merchCard.querySelector('div[slot="footer"] a[slot="cta"]').dataset.quantity).to.equal('2');
  });
});

describe('Merch quantity select: twp', () => {
  before(async () => {
    mockIms();
    await mockFetch();
    await initService(true);
    document.body.innerHTML = await readMockText('/test/blocks/merch-card/mocks/selection-cards.html');
  });

  after(() => {
    unmockIms();
    unmockFetch();
  });

  it('Should initialize twp card with stock', async () => {
    const twpCard = await initCard(document.querySelector('.twp'));
    await delay(200);
    const [merchOfferSelect, merchOffer1, merchOffer2, merchOffer3] = twpCard.querySelectorAll('merch-offer-select, merch-offer');
    expect(merchOfferSelect.getAttribute('stock')).to.exist;
    expect(merchOffer1.getAttribute('text')).to.equal('Annual, monthly payment');
    expect(merchOffer2.getAttribute('text')).to.equal('Annual, one-time payment');
    expect(merchOffer3.getAttribute('text')).to.equal('Monthly, without commitment');
  });
});
