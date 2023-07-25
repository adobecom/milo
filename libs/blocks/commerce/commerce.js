import { createTag, getConfig, loadScript } from '../../utils/utils.js';
import { getTacocatEnv, runTacocat, buildCheckoutButton, getCheckoutContext, omitNullValues } from '../merch/merch.js';
import { debounce } from '../../utils/action.js';

window.tacocat.loadPromise = new Promise((resolve) => {
  const { env, locale } = getConfig();
  const {
    literalScriptUrl,
    scriptUrl,
    country,
    language,
    tacocatEnv,
  } = getTacocatEnv(env.name, locale);

  loadScript(literalScriptUrl)
    .catch(() => ({})) /* ignore if literals fail */
    .then(() => loadScript(scriptUrl))
    .then(() => {
      runTacocat(tacocatEnv, country, language);
      resolve(false);
    })
    .catch((error) => {
      console.error('Failed to load tacocat', error);
      resolve(true);
    });
});

export const filterOfferDetails = (o) => {
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
  } = o;

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
  window.tacocat.imsCountryPromise.then((countryCode) => {
    if (countryCode) {
      button.dataset.imsCountry = countryCode;
    }
  })
    .catch(() => { /* do nothing */ });
  return button;
}

export const decorateOfferDetails = async (el, of, searchParams) => {
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
  const perpetual = searchParams.get('perp') === 'true' || undefined;
  const options = omitNullValues({
    perpetual,
    promotionCode,
    wcsOsi: searchParams.get('osi'),
    ...getCheckoutContext(searchParams, getConfig()),
  });
  const checkoutUrl = buildCheckoutButton(checkoutLink, options);
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
};

export const handleSearch = async (event, el) => {
  const displaySearchError = () => {
    const notValidUrl = createTag('h4', { class: 'not-valid-url' }, 'Not a valid offer link');
    el.append(notValidUrl);
  };
  el.textContent = '';
  const search = event.target.value;
  try {
    const url = new URL(search);
    const osi = url.searchParams.get('osi');
    if (!osi) { displaySearchError(); return; }
    window.tacocat.wcs.resolveOfferSelector(osi).then(([offerDetails]) => {
      decorateOfferDetails(el, offerDetails, url.searchParams);
    }).catch(displaySearchError);
  } catch (e) {
    displaySearchError();
  }
};

export const decorateSearch = (el) => {
  const search = createTag('input', { class: 'offer-search', placeholder: 'Enter offer URL to preview' });
  const icon = createTag('div', { class: 'offer-search-icon' });
  const searchWrapper = createTag('div', { class: 'offer-search-wrapper' }, [search, icon]);
  const offerDetailsWrapper = createTag('div', { class: 'offer-details-wrapper' });
  el.append(searchWrapper);
  el.append(offerDetailsWrapper);
  search.addEventListener('keyup', debounce((event) => handleSearch(event, offerDetailsWrapper), 500));
};

function detectContext() {
  if (window.self === window.top) document.body.classList.add('in-page');
}

// eslint-disable-next-line consistent-return
const init = async (el) => {
  const fail = await window.tacocat.loadPromise;
  if (fail) {
    return undefined;
  }
  detectContext();
  decorateSearch(el);
};

export default init;
