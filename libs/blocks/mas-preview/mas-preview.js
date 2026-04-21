import { createTag, decorateAutoBlock, loadBlock, getConfig } from '../../utils/utils.js';
import { GeoMap, MAS_MERCH_CARD, MAS_MERCH_CARD_COLLECTION, getCheckoutAction } from '../../blocks/merch/merch.js'

const DEFAULT_LOCALE = 'en_US';

function registerCheckoutAction() {
  const service = document.head.querySelector('mas-commerce-service');
  if (typeof service?.registerCheckoutAction === 'function') {
    console.log('REGISTER');
    service.registerCheckoutAction(getCheckoutAction);
  }
}

function createMasCommerceService(selectLocale) {
  const { commerce } = getConfig();
  document.head.querySelector('mas-commerce-service')?.remove();
  const localeArray = selectLocale.value.split('_');
  const service = createTag('mas-commerce-service', { locale: selectLocale.value, country: localeArray[1], language: localeArray[0], ...commerce });
  document.head.append(service);
  registerCheckoutAction();
}

export default function init(el) {
  const url = new URL(window.location.href);
  const fragmentIdEl = createTag('input', { type: 'text', size: 40, value: url.searchParams.get('fragment-id') || '' });
  const selectType = createTag('select');
  const optionCard = createTag('option', { value: MAS_MERCH_CARD }, 'Card');
  const optionColl = createTag('option', { value: MAS_MERCH_CARD_COLLECTION }, 'Collection');
  selectType.appendChild(optionCard);
  selectType.appendChild(optionColl);
  if (url.searchParams.get('content-type')) {
    selectType.value = url.searchParams.get('content-type');
  }
  const selectLocale = createTag('select');
  const localeArray = [DEFAULT_LOCALE];
  for (const [, val] of Object.entries(GeoMap)) {
    const valArray = val.split('_');
    localeArray.push( `${valArray[1]}_${valArray[0]}`);
  }
  localeArray.sort();
  localeArray.forEach((value) => selectLocale.appendChild(createTag('option', { value }, value)));

  selectLocale.value = url.searchParams.get('locale') || DEFAULT_LOCALE;
  if (selectLocale.value !== DEFAULT_LOCALE) createMasCommerceService(selectLocale);

  const btnCopy = createTag('button', { type: 'button' }, 'Copy URL');
  const btnPreview = createTag('button', { type: 'button' }, 'Preview');
  btnPreview.addEventListener('click', async () => {
    divPreview.innerHTML = '';

    registerCheckoutAction();

    const href = `https://mas.adobe.com/studio.html#content-type=${selectType.value}&page=content&path=acom&query=${fragmentIdEl.value}`;
    const autoblock = createTag('a', { href });
    divPreview.appendChild(autoblock);
    decorateAutoBlock(autoblock);
    await loadBlock(autoblock);
    const merchBlock = divPreview.querySelector(selectType.value);
    await merchBlock.checkReady();
    if ((selectType.value === MAS_MERCH_CARD && !merchBlock.variant) 
      || (selectType.value === MAS_MERCH_CARD_COLLECTION && !merchBlock.classList.length)) {
        divPreview.innerText = 'Cannot load fragment';
    } else {
      const urlDeeplink = new URL(window.location.href);
      urlDeeplink.searchParams.set('fragment-id', fragmentIdEl.value);
      urlDeeplink.searchParams.set('content-type', selectType.value);
      urlDeeplink.searchParams.set('locale', selectLocale.value);
      history.replaceState(history.state, '', urlDeeplink.href);
    }
  });
  selectLocale.addEventListener('change', async () => {
    createMasCommerceService(selectLocale);
  });
  btnCopy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href);
  });
  const divMeta = createTag('div', { class: 'fragment-meta' });
  divMeta.appendChild(fragmentIdEl);
  divMeta.appendChild(selectType);
  divMeta.appendChild(selectLocale);
  divMeta.appendChild(btnPreview);
  divMeta.appendChild(btnCopy);
  el.appendChild(divMeta);
  const divPreview = createTag('div', { class: 'fragment-preview' });
  el.appendChild(divPreview);
  if (fragmentIdEl.value) {
    btnPreview.click();
  }
}