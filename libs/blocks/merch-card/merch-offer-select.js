import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import '../../deps/merch-offer-select.js';

function createDynamicSlots(el, bodySlot) {
  const pricePlaceholder = el.querySelector("span[is='inline-price']");
  if (pricePlaceholder) {
    pricePlaceholder.parentNode.replaceChild(createTag('span', { slot: 'price', is: 'inline-price' }), pricePlaceholder);
  } else {
    const priceSlot = createTag('h5', { class: 'merch-card-price' });
    createTag('span', { slot: 'price', is: 'inline-price' }, null, { parent: priceSlot });
    bodySlot.append(priceSlot);
  }
  const p = createTag('p', { class: 'action-area' });
  createTag('a', { slot: 'secondary-cta', is: 'checkout-link' }, null, { parent: p });
  createTag('a', { slot: 'cta', is: 'checkout-link' }, null, { parent: p });
  const footer = el.querySelector('div[slot="footer"]');
  footer.append(p);
  bodySlot.querySelector('p')?.setAttribute('slot', 'description');
}
function createMerchOffer(option, quantitySelector) {
  const merchOffer = createTag('merch-offer', { [quantitySelector ? 'value' : 'text']: option.childNodes[0].textContent.trim() });
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

const isHorizontal = (offerSelection) => [...offerSelection.querySelectorAll('merch-offer')].map((o) => o.text).every((t) => /^\d+.B$/.test(t));

export const initOfferSelection = (merchCard, offerSelection, quantitySelector) => {
  const bodySlot = merchCard.querySelector('div[slot="body-xs"]');
  if (!bodySlot) return;
  createDynamicSlots(merchCard, bodySlot);
  const merchOffers = createTag('merch-offer-select', { container: 'merch-card' });
  [...offerSelection.children].forEach((option) => {
    merchOffers.append(createMerchOffer(option, quantitySelector));
  });
  merchOffers.querySelectorAll('a[is="checkout-link"]').forEach((link) => { link.setAttribute('slot', 'cta'); });
  if (isHorizontal(merchOffers)) {
    merchOffers.setAttribute('variant', 'horizontal');
  }
  merchOffers.querySelectorAll('merch-offer').forEach((offer) => {
    const links = offer.querySelectorAll('a[is="checkout-link"]');
    if (links.length > 1) {
      links[0].setAttribute('slot', 'secondary-cta');
      links[1].setAttribute('slot', 'cta');
    } else if (links.length === 1) {
      links[0].setAttribute('slot', 'cta');
    }
  });
  merchOffers.querySelectorAll('span[is="inline-price"]').forEach((price) => { price.setAttribute('slot', 'price'); });
  if (quantitySelector) {
    quantitySelector.append(merchOffers);
  } else {
    bodySlot.append(merchOffers);
  }
};

export default initOfferSelection;
