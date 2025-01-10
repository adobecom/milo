import { getMetadata, loadStyle, getConfig, createTag } from '../../utils/utils.js';

function addLoader(elem) {
  const { base } = getConfig();
  loadStyle(`${base}/features/branch-quick-links/branch-quick-links.css`);
  const container = createTag('div', { class: 'pbar-container' });
  const lbl = createTag('div', { class: 'pbar-label' });
  lbl.textContent = 'Launching the app store...';
  const tr = createTag('div', { class: 'pbar-value' });
  tr.style.display = 'block';
  const pBar = createTag('div', { class: 'pbar' }, tr);
  container.append(lbl, pBar);
  elem.replaceWith(container);
  return container;
}

function removeLoader(elem, a) {
  elem.replaceWith(a);
}

async function decorateQuickLink(a, hasConsent) {
  if (!window.alloy) return;
  let ecid = null;
  try {
    const data = await window.alloy('getIdentity');
    ecid = data?.identity?.ECID;
  } catch (e) {
    window.lana.log(`Error fetching ECID: ${e}`, { tags: 'branch-quick-links' });
  }
  if (hasConsent && !a.href.includes('ecid')) {
    a.href = a.href.concat(`?ecid=${ecid}`);
  }
  window.location.href = a.href;
}

export default function processQL(a) {
  a.classList.add('quick-link');
  const isLoader = getMetadata('quick-link-loader');

  const getConsentStatus = () => {
    const cookieGrp = window.adobePrivacy?.activeCookieGroups();
    return cookieGrp?.includes('C0002') && cookieGrp?.includes('C0004');
  };

  const waitForConsent = new Promise((resolve) => {
    const fallbackTimeout = setTimeout(() => resolve(false), 10000);
    if (window.adobePrivacy) resolve(getConsentStatus());
    window.addEventListener('adobePrivacy:PrivacyConsent', () => {
      clearTimeout(fallbackTimeout);
      resolve(true);
    });
    window.addEventListener('adobePrivacy:PrivacyReject', () => {
      clearTimeout(fallbackTimeout);
      resolve(false);
    });
    window.addEventListener('adobePrivacy:PrivacyCustom', () => {
      clearTimeout(fallbackTimeout);
      resolve(getConsentStatus());
    });
  });

  a.addEventListener('click', async (e) => {
    e.preventDefault();
    let pb;
    if (isLoader === 'progress-bar') pb = addLoader(a);
    const hasConsent = await waitForConsent;
    if (pb) removeLoader(pb, a);
    decorateQuickLink(a, hasConsent);
  });
}
