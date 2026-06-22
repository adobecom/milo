import { createTag, decorateAutoBlock, loadBlock, getConfig } from '../../utils/utils.js';
import { GeoMap, MAS_MERCH_CARD, MAS_MERCH_CARD_COLLECTION, getCheckoutAction } from '../merch/merch.js';

const DEFAULT_LOCALE = 'en_US';
const TAG_MAS_COM_SERVICE = 'mas-commerce-service';
const FRAGMENT_ID = 'fragment-id';
const CONTENT_TYPE = 'content-type';
const LOCALE = 'locale';
const COUNTRY = 'country';

function registerCheckoutAction() {
  const service = document.head.querySelector(TAG_MAS_COM_SERVICE);
  if (typeof service?.registerCheckoutAction === 'function') {
    service.registerCheckoutAction(getCheckoutAction);
  }
}

function createMasCommerceService(selectLocale, selectCountry) {
  const { commerce } = getConfig();
  document.head.querySelector(TAG_MAS_COM_SERVICE)?.remove();
  const localeArray = selectLocale.value.split('_');
  const attrs = {
    locale: selectLocale.value,
    country: selectCountry.value || localeArray[1],
    language: localeArray[0],
    ...commerce,
  };
  const service = createTag(TAG_MAS_COM_SERVICE, attrs);
  document.head.append(service);
  registerCheckoutAction();
}

const MODEL_IDS = {
  L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NvbGxlY3Rpb24: MAS_MERCH_CARD_COLLECTION,
  L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NhcmQ: MAS_MERCH_CARD,
};

async function preview(divPreview, selectType, selectLoc, selectCo, fragmentEl, btn, deeplink) {
  divPreview.innerHTML = '';

  registerCheckoutAction();

  fetch(`https://odinpreview.corp.adobe.com/adobe/contentFragments/${fragmentEl.value}`)
    // eslint-disable-next-line consistent-return
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      divPreview.innerText = 'Cannot load fragment';
      divPreview.classList.remove('hidden');
    })
    .then((fragment) => {
      if (fragment?.model?.id && MODEL_IDS[fragment.model.id] !== selectType.value) {
        selectType.value = MODEL_IDS[fragment.model.id];
        btn.click();
      }
    });

  const href = `https://mas.adobe.com/studio.html#content-type=${selectType.value}&page=content&path=acom&query=${fragmentEl.value}`;
  const autoblock = createTag('a', { href });
  divPreview.appendChild(autoblock);
  decorateAutoBlock(autoblock);
  await loadBlock(autoblock);
  const merchBlock = divPreview.querySelector(selectType.value);
  if (!merchBlock) return;
  await merchBlock.checkReady();
  divPreview.classList.remove('hidden');
  if ((selectType.value === MAS_MERCH_CARD && !merchBlock.variant)
    || (selectType.value === MAS_MERCH_CARD_COLLECTION && !merchBlock.classList.length)) {
    divPreview.innerText = 'Cannot load fragment';
  } else if (deeplink) {
    const urlDeeplink = new URL(window.location.href.split('#')[0]);
    urlDeeplink.searchParams.set(FRAGMENT_ID, fragmentEl.value);
    urlDeeplink.searchParams.set(CONTENT_TYPE, selectType.value);
    urlDeeplink.searchParams.set(LOCALE, selectLoc.value);
    if (selectCo.value) {
      urlDeeplink.searchParams.set(COUNTRY, selectCo.value);
    } else {
      urlDeeplink.searchParams.delete(COUNTRY);
    }
    window.history.replaceState(window.history.state, '', urlDeeplink.href);
  }
  if (selectType.value === MAS_MERCH_CARD_COLLECTION) {
    const firstSidenavItem = divPreview.querySelector('sp-sidenav-item');
    if (firstSidenavItem) firstSidenavItem.click();
  }
}

export default async function init(el) {
  const url = new URL(window.location.href);
  const fragmentIdEl = createTag('input', { type: 'text', size: 40, value: url.searchParams.get(FRAGMENT_ID) || '' });
  const selectType = createTag('select');
  const optionCard = createTag('option', { value: MAS_MERCH_CARD }, 'Card');
  const optionColl = createTag('option', { value: MAS_MERCH_CARD_COLLECTION }, 'Collection');
  selectType.appendChild(optionCard);
  selectType.appendChild(optionColl);
  if (url.searchParams.get(CONTENT_TYPE)) {
    selectType.value = url.searchParams.get(CONTENT_TYPE);
  }

  const selectCountry = createTag('select');
  const countries = ['AR', 'BE', 'BR', 'CA', 'CH', 'MX', 'MU', 'DK', 'DE', 'EE', 'EG', 'ES', 'FR', 'GR', 'IE', 'IL', 'IT', 'LV', 'LT', 'LU', 'MY', 'HU', 'NL', 'NO', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE', 'TR', 'GB', 'AT', 'CZ', 'BG', 'UA', 'AU', 'IN', 'ID', 'NZ', 'SA', 'SG', 'TW', 'HK', 'JP', 'KR', 'ZA', 'NG', 'US', 'TH', 'CO', 'PE', 'DO', 'CL', 'DZ', 'CR', 'EC', 'GT'];
  countries.sort();
  countries.unshift('');
  countries.forEach((value) => selectCountry.appendChild(createTag('option', { value }, value)));
  if (url.searchParams.get(COUNTRY)) {
    selectCountry.value = url.searchParams.get(COUNTRY);
  }

  const selectLocale = createTag('select');
  const localeArray = [DEFAULT_LOCALE];
  for (const [, val] of Object.entries(GeoMap)) {
    const valArray = val.split('_');
    localeArray.push(`${valArray[1]}_${valArray[0]}`);
  }
  localeArray.sort();
  localeArray.forEach((value) => selectLocale.appendChild(createTag('option', { value }, value)));

  selectLocale.value = url.searchParams.get(LOCALE) || DEFAULT_LOCALE;
  if (selectLocale.value !== DEFAULT_LOCALE || selectCountry.value) {
    createMasCommerceService(selectLocale, selectCountry);
  }

  const btnCopy = createTag('button', { type: 'button' }, 'Copy URL');
  const btnPreview = createTag('button', { type: 'button' }, 'Preview');
  const divPreview = createTag('div', { class: 'fragment-preview hidden' });
  btnPreview.addEventListener('click', () => {
    divPreview.classList.add('hidden');
    preview(divPreview, selectType, selectLocale, selectCountry, fragmentIdEl, btnPreview, true);
  });
  selectLocale.addEventListener('change', async () => {
    createMasCommerceService(selectLocale, selectCountry);
  });
  selectCountry.addEventListener('change', async () => {
    createMasCommerceService(selectLocale, selectCountry);
  });
  btnCopy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href.split('#')[0]);
  });
  const divMeta = createTag('div', { class: 'fragment-meta' });
  divMeta.appendChild(fragmentIdEl);
  divMeta.appendChild(selectType);
  divMeta.appendChild(selectLocale);
  divMeta.appendChild(selectCountry);
  divMeta.appendChild(btnPreview);
  divMeta.appendChild(btnCopy);
  el.appendChild(divMeta);
  el.appendChild(divPreview);
  if (fragmentIdEl.value) {
    await preview(divPreview, selectType, selectLocale, selectCountry, fragmentIdEl, btnPreview);
    preview(divPreview, selectType, selectLocale, selectCountry, fragmentIdEl, btnPreview);
    divPreview.classList.remove('hidden');
  }
}
