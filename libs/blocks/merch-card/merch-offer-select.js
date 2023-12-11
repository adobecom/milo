import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import '../../deps/merch-offer-select.js';

function createDynamicSlots(el, bodySlot) {
  const price = createTag('h5', { class: 'merch-card-price' });
  price.append(createTag('span', { slot: 'price', is: 'inline-price' }));
  bodySlot.append(price);

  const p = createTag('p', { class: 'action-area' });
  p.append(createTag('a', { slot: 'cta', is: 'checkout-link' }));
  const footer = el.querySelector('div[slot="footer"]');
  footer.append(p);
  bodySlot.querySelector('p')?.setAttribute('slot', 'description');
}
function createMerchOffer(option) {
  const merchOffer = createTag('merch-offer', { text: option.childNodes[0].textContent.trim() });
  [...option.querySelector('ul').children].forEach((li, index) => {
    const override = li.childNodes[0];
    if (override.nodeName === '#text') {
      if (index === 0) {
        merchOffer.setAttribute('badge-text', override.textContent.trim());
      } else {
        const desc = createTag('p', { slot: 'description' });
        desc.textContent = override.textContent.trim();
        merchOffer.append(desc);
      }
    } else {
      merchOffer.append(override);
    }
  });
  decorateButtons(merchOffer);
  return merchOffer;
}

export const initOfferSelection = (merchCard, offerSelection) => {
  const bodySlot = merchCard.querySelector('div[slot="body-xs"]');
  if (!bodySlot) return;
  createDynamicSlots(merchCard, bodySlot);
  const merchOffers = createTag('merch-offer-select', { container: 'merch-card' });
  [...offerSelection.children].forEach((option) => {
    merchOffers.append(createMerchOffer(option));
  });
  merchOffers.querySelectorAll('a[is="checkout-link"]').forEach((link) => { link.setAttribute('slot', 'cta'); });
  merchOffers.querySelectorAll('span[is="inline-price"]').forEach((price) => { price.setAttribute('slot', 'price'); });
  bodySlot.append(merchOffers);
};

export default initOfferSelection;
