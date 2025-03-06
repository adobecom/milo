import { getMetadata, loadStyle, getConfig, createTag } from '../../utils/utils.js';

function addLoader(a) {
  const { base } = getConfig();
  loadStyle(`${base}/features/branch-quick-links/branch-quick-links.css`);
  const label = createTag('div', { class: 'pbar-label' });
  label.textContent = getMetadata('quick-link-loader-text') || '';
  const tr = createTag('div', { class: 'pbar-value' });
  tr.style.display = 'block';
  const progressBar = createTag('div', { class: 'pbar' }, tr);
  Object.assign(progressBar.style, {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#D5D5D5',
    marginTop: '10px',
    overflow: 'hidden',
  });
  const container = createTag('div', { class: 'pbar-container' }, [label, progressBar]);
  a.replaceWith(container);
  return container;
}

async function decorateQuickLink(a, hasConsent) {
  let ecid = null;
  try {
    const data = await window.alloy_getIdentity;
    ecid = data?.identity?.ECID;
  } catch (e) {
    window.lana.log(`Error fetching ECID: ${e}`, { tags: 'branch-quick-links' });
  }
  if (ecid && hasConsent && !a.href.includes('ecid')) {
    const urlObj = new URL(a.href, window.location.origin);
    urlObj.searchParams.set('ecid', ecid);
    a.href = urlObj.href;
  }
  window.location.href = a.href;
}

export default function processQuickLink(a) {
  a.classList.add('quick-link');
  const getConsentStatus = () => {
    const cookieGrp = window.adobePrivacy?.activeCookieGroups();
    return cookieGrp?.includes('C0002') && cookieGrp?.includes('C0004');
  };

  function waitForConsent() {
    return new Promise((resolve) => {
      const fallbackTimeout = setTimeout(() => resolve(false), 30000);
      if (window.adobePrivacy) {
        clearTimeout(fallbackTimeout);
        resolve(getConsentStatus());
      }
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
  }

  a.addEventListener('click', async (e) => {
    e.preventDefault();
    let loader;
    if (getMetadata('quick-link-loader') === 'on') loader = addLoader(a);
    const hasConsent = await waitForConsent();
    if (loader) loader.replaceWith(a);
    decorateQuickLink(a, hasConsent);
  });
}
