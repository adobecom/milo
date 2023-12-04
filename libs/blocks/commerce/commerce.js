import { debounce } from '../../utils/action.js';
import { createTag } from '../../utils/utils.js';
import { buildCta, initService } from '../merch/merch.js';

export const filterOfferDetails = (offerDetails) => {
  const formattedOffer = {};

  function formatPrice(price, format) {
    const currency = format.match(/'([^']+)'/);
    return `${currency[1]}${price}`;
  }

  const {
    offerType,
    offerId,
    productArrangementCode,
    pricePoint,
    customerSegment,
    commitment,
    term,
    offerSelectorIds,
    priceDetails,
  } = offerDetails;

  formattedOffer.offerType = offerType;
  formattedOffer.offerId = offerId;
  formattedOffer.productArrangementCode = productArrangementCode;
  formattedOffer.pricePoint = pricePoint;
  formattedOffer.customerSegment = customerSegment;
  formattedOffer.commitment = commitment;
  formattedOffer.term = term;
  formattedOffer.offerSelectorIds = offerSelectorIds;
  formattedOffer.price = formatPrice(priceDetails.price, priceDetails.formatString);
  return formattedOffer;
};

export function buildClearButton() {
  const button = createTag('button', { type: 'button', class: 'con-button' });
  button.textContent = 'Clear';
  return button;
}

export async function decorateOfferDetails(el, of, searchParams) {
  function formatOfferDetailKeys(str) {
    const details = str.split(/(?=[A-Z])/);
    const allCapsDetail = details.map((detail) => detail.toUpperCase());
    const result = allCapsDetail.join(' ');
    if (result === 'OFFER SELECTOR IDS') {
      return 'OSI';
    }
    return result;
  }
  const offerDetailsList = document.createElement('ul');
  offerDetailsList.className = 'offer-details';
  const offer = filterOfferDetails(of);
  const promotionCode = searchParams.get('promo');
  offer.type = searchParams.get('type');
  if (offer.type === 'checkoutUrl') {
    offer.cta = searchParams.get('text');
  }
  if (promotionCode) {
    offer.promo = promotionCode;
  }

  Object.entries(offer).forEach(([key, value]) => {
    const offerData = document.createElement('li');
    const offerKey = document.createElement('span');
    const offerValue = document.createElement('span');
    offerData.classList.add('offer-detail');
    offerKey.classList.add('offer-key');
    offerValue.classList.add('offer-value');
    offerKey.textContent = `${formatOfferDetailKeys(key)}: `;
    offerValue.textContent = value;
    offerData.appendChild(offerKey);
    offerData.appendChild(offerValue);
    offerDetailsList.appendChild(offerData);
  });
  const checkoutLink = document.createElement('a');
  checkoutLink.textContent = 'Checkout link';
  const checkoutUrl = await buildCta(checkoutLink, searchParams);
  checkoutUrl.target = '_blank';
  const clearButton = buildClearButton();

  clearButton.addEventListener('click', () => {
    const input = document.querySelector('.offer-search');
    input.value = '';
    offerDetailsList.textContent = '';
  });
  offerDetailsList.appendChild(clearButton);
  offerDetailsList.appendChild(checkoutUrl);
  el.append(offerDetailsList);
}

export async function handleOfferSearch(event, el) {
  el.textContent = '';
  const { searchParams } = new URL(event.target.value, window.location.href);
  const osi = searchParams.get('osi');
  if (osi != null) {
    const service = await initService();
    const [promise] = await service.resolveOfferSelectors({ wcsOsi: [osi] });
    const [offer] = await promise;
    await decorateOfferDetails(el, offer, searchParams);
  } else {
    const notValidUrl = document.createElement('h4');
    notValidUrl.classList.add('not-valid-url');
    notValidUrl.textContent = 'Not a valid offer link';
    el.append(notValidUrl);
  }
}

export function decorateSearch(el) {
  const search = createTag('input', { class: 'offer-search', placeholder: 'Enter offer URL to preview' });
  const icon = createTag('div', { class: 'offer-search-icon' });
  const searchWrapper = createTag('div', { class: 'offer-search-wrapper' }, [search, icon]);
  const offerDetailsWrapper = createTag('div', { class: 'offer-details-wrapper' });
  el.append(searchWrapper);
  el.append(offerDetailsWrapper);
  search.addEventListener(
    'keyup',
    debounce((event) => handleOfferSearch(event, offerDetailsWrapper), 500),
  );
}

function detectContext() {
  if (window.self === window.top) document.body.classList.add('in-page');
}

export default async function init(el) {
  detectContext();
  decorateSearch(el);
}
