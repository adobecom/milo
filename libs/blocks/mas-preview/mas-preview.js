import { createTag, decorateAutoBlock, loadBlock, getConfig } from '../../utils/utils.js';
import { MAS_MERCH_CARD, MAS_MERCH_CARD_COLLECTION, getCheckoutAction, getMasLibsBaseUrl } from '../merch/merch.js';

const DEFAULT_LOCALE = 'en_US';
const SURFACE = 'acom';
const MAS_AEM_LIVE = 'https://main--mas--adobecom.aem.live';

// Get the locales from mas so the dropdowns update when mas adds new ones.
function getSurfaceLocales() {
  const base = getMasLibsBaseUrl() || MAS_AEM_LIVE;
  return import(`${base}/io/www/src/fragment/locales.js`)
    .then((mod) => mod.getSurfaceLocales(SURFACE))
    .catch(() => []);
}
const TAG_MAS_COM_SERVICE = 'mas-commerce-service';
const FRAGMENT_ID = 'fragment-id';
const CONTENT_TYPE = 'content-type';
const LOCALE = 'locale';
const COUNTRY = 'country';
const MAS_PREVIEW = 'mas.preview';
const MASK = 'mask';
const PZN = 'pzn';

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

function setSearchParam(url, el, param) {
  if (el.value) {
    url.searchParams.set(param, el.value);
  } else {
    url.searchParams.delete(param);
  }
}

async function preview(args) {
  const {
    divPreview,
    selectType,
    selectLocale,
    selectCountry,
    fragmentIdEl,
    masPreview,
    maskEl,
    pznEl,
    btnPreview,
    deeplink,
  } = args;
  divPreview.innerHTML = '';

  registerCheckoutAction();

  fetch(`https://odinpreview.corp.adobe.com/adobe/contentFragments/${fragmentIdEl.value}`)
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
        btnPreview.click();
      }
    });

  const reloadPage = deeplink && (masPreview.initialValue || '') !== (masPreview.value || '');

  if (!reloadPage) {
    const mask = document.querySelector('.mask').value;
    const maskParam = mask ? `&mask=${mask}` : '';
    const pzn = document.querySelector('.pzn').value;
    const pznParam = pzn ? `&pzn=${pzn}` : '';
    const href = `https://mas.adobe.com/studio.html#content-type=${selectType.value}&page=content&path=acom&query=${fragmentIdEl.value}${maskParam}${pznParam}`;
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
    }

    if (selectType.value === MAS_MERCH_CARD_COLLECTION) {
      const firstSidenavItem = divPreview.querySelector('sp-sidenav-item');
      if (firstSidenavItem) firstSidenavItem.click();
    }
  }

  if (deeplink) {
    const urlDeeplink = new URL(window.location.href.split('#')[0]);
    urlDeeplink.searchParams.set(FRAGMENT_ID, fragmentIdEl.value);
    urlDeeplink.searchParams.set(CONTENT_TYPE, selectType.value);
    urlDeeplink.searchParams.set(LOCALE, selectLocale.value);

    setSearchParam(urlDeeplink, maskEl, MASK);
    setSearchParam(urlDeeplink, pznEl, PZN);
    setSearchParam(urlDeeplink, selectCountry, COUNTRY);

    window.history.replaceState(window.history.state, '', urlDeeplink.href);
  }
  if (reloadPage) {
    window.location.reload();
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

  const surfaceLocales = await getSurfaceLocales();

  const selectCountry = createTag('select');
  const countries = [...new Set(surfaceLocales.map((locale) => locale.country))].sort();
  countries.unshift('');
  countries.forEach((value) => selectCountry.appendChild(createTag('option', { value }, value)));
  if (url.searchParams.get(COUNTRY)) {
    selectCountry.value = url.searchParams.get(COUNTRY);
  }

  const selectLocale = createTag('select');
  const localeArray = [...new Set([DEFAULT_LOCALE, ...surfaceLocales.map((locale) => `${locale.lang}_${locale.country}`)])];
  localeArray.sort();
  localeArray.forEach((value) => selectLocale.appendChild(createTag('option', { value }, value)));

  selectLocale.value = url.searchParams.get(LOCALE) || DEFAULT_LOCALE;
  if (selectLocale.value !== DEFAULT_LOCALE || selectCountry.value) {
    createMasCommerceService(selectLocale, selectCountry);
  }

  const btnCopy = createTag('button', { type: 'button' }, 'Copy URL');
  const btnPreview = createTag('button', { type: 'button' }, 'Preview');
  const divPreview = createTag('div', { class: 'fragment-preview hidden' });
  const masPreview = createTag('select', { id: 'preview-toggle' });
  const maskEl = createTag('input', { class: MASK, type: 'text', size: 20, placeholder: MASK });
  const pznEl = createTag('input', { class: PZN, type: 'text', size: 20, placeholder: PZN });

  btnPreview.addEventListener('click', () => {
    divPreview.classList.add('hidden');
    const args = {
      divPreview,
      selectType,
      selectLocale,
      selectCountry,
      fragmentIdEl,
      masPreview,
      maskEl,
      pznEl,
      btnPreview,
      deeplink: true,
    };
    preview(args);
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

  const divMask = createTag('div', { class: 'fragment-mask' });
  divMask.appendChild(maskEl);
  divMask.appendChild(pznEl);

  const previewEmpty = createTag('option', { value: '' }, '');
  masPreview.appendChild(previewEmpty);
  const { hostname } = window.location;
  if (hostname === 'milo.adobe.com' || hostname.endsWith('.aem.live')) {
    masPreview.appendChild(createTag('option', { value: 'on' }, 'on'));
  } else {
    masPreview.appendChild(createTag('option', { value: 'off' }, 'off'));
  }
  const masPreviewLabel = createTag('label', { for: 'preview-toggle' }, 'Preview');
  divMask.appendChild(masPreviewLabel);
  divMask.appendChild(masPreview);

  if (url.searchParams.get(MAS_PREVIEW)) {
    masPreview.value = url.searchParams.get(MAS_PREVIEW);
    masPreview.initialValue = masPreview.value;
  }
  if (url.searchParams.get(MASK)) {
    maskEl.value = url.searchParams.get(MASK);
  }
  if (url.searchParams.get(PZN)) {
    pznEl.value = url.searchParams.get(PZN);
  }

  masPreview.addEventListener('change', async () => {
    const val = masPreview.value;
    const urlDeeplink = new URL(window.location.href.split('#')[0]);
    if (val) {
      urlDeeplink.searchParams.set(MAS_PREVIEW, val);
    } else {
      urlDeeplink.searchParams.delete(MAS_PREVIEW);
    }
    window.history.replaceState(window.history.state, '', urlDeeplink.href);
  });

  el.appendChild(divMask);
  el.appendChild(divPreview);
  if (fragmentIdEl.value) {
    setTimeout(async () => {
      document.body.style.cursor = 'progress';
      const args = {
        divPreview,
        selectType,
        selectLocale,
        selectCountry,
        fragmentIdEl,
        masPreview,
        maskEl,
        pznEl,
        btnPreview,
      };
      await preview(args);
      preview(args);
      divPreview.classList.remove('hidden');
      document.body.style.cursor = 'default';
    }, 1);
  }
}
