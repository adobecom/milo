import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: initCard } = await import('../../../libs/blocks/merch-card/merch-card.js');
const delay = (duration = 100) => new Promise((resolve) => { setTimeout(resolve, duration); });

describe('Merch Offer Select', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/acrobat-card.html' });
    await initCard(document.querySelector('.acrobat'));
    await delay();
  });

  function validateMerchOffer(offer, selected, text, badgeText, osi, description) {
    expect(offer.hasAttribute('selected')).to.equal(selected === 'true');
    expect(offer.getAttribute('aria-checked')).to.equal(selected);
    expect(offer.getAttribute('text')).to.equal(text);
    expect(offer.getAttribute('badge-text')).to.equal(badgeText);
    expect(offer.getAttribute('tabindex')).to.equal('0');
    const price = offer.get('price');
    expect(price.dataset.wcsOsi).to.equal(osi);
    expect(price.getAttribute('slot')).to.equal('price');
    const cta = offer.get('cta');
    expect(cta.dataset.wcsOsi).to.equal(osi);
    expect(cta.getAttribute('slot')).to.equal('cta');
    if (description) {
      expect(offer.get('description').innerText).to.equal(description);
    } else {
      expect(offer.get('description')).not.to.exist;
    }
  }

  function validateMerchCard(card, badge, description, osi) {
    if (badge) {
      expect(card.shadowRoot.querySelector('div.plans-badge').innerText).to.equal(badge);
    } else {
      expect(card.shadowRoot.querySelector('div.plans-badge')).not.to.exist;
    }
    expect(card.querySelector('div[slot="body-xs"] p[slot="description"]').innerText).to.equal(description);
    expect(card.querySelector('div[slot="footer"] a[is="checkout-link"]').dataset.wcsOsi).to.equal(osi);
    expect(card.querySelector('div[slot="body-xs"] span[is="inline-price"]').dataset.wcsOsi).to.equal(osi);
  }

  it('Should render offer select and inital card state', async () => {
    const merchCard = document.querySelector('merch-card');
    const merchOffers = merchCard.querySelector('merch-offer-select').querySelectorAll('merch-offer');
    expect(merchOffers.length).to.equal(3);
    validateMerchOffer(merchOffers[0], 'true', 'Annual, monthly payment', 'Recommended', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE', null);
    validateMerchOffer(merchOffers[1], 'false', 'Annual, one-time payment', 'Best Offer', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA', 'New Description');
    validateMerchCard(merchCard, 'Recommended', 'Access advanced PDF.', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE');
  });

  it('Should select and render second offer', async () => {
    const merchCard = document.querySelector('merch-card');
    merchCard.querySelectorAll('merch-offer')[1].click();
    await delay();

    const merchOffers = merchCard.querySelector('merch-offer-select').querySelectorAll('merch-offer');
    validateMerchOffer(merchOffers[0], 'false', 'Annual, monthly payment', 'Recommended', '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE', null);
    validateMerchOffer(merchOffers[1], 'true', 'Annual, one-time payment', 'Best Offer', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA', 'New Description');
    validateMerchCard(merchCard, 'Best Offer', 'New Description', 'gr3e95wowwDvLJyphdXmBf9-vTub0fhbdxQfGJ7tdhA');
  });

  it('Should remove badge and set back description', async () => {
    const merchCard = document.querySelector('merch-card');
    merchCard.querySelectorAll('merch-offer')[2].click();
    await delay();
    validateMerchCard(merchCard, null, 'Access advanced PDF.', 'BWGlzrQG6jgkf-_zPJm55M5QpAyb4skYi05BizQIJ3U');
  });
});
