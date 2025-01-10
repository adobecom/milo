import { getMetadata, loadStyle, getConfig, createTag } from '../../utils/utils.js';

function addBarLoader(elem) {
  const { base } = getConfig();
  loadStyle(`${base}/styles/progress-bar.css`);
  const container = createTag('div', { class: 'progress-bar-container' });
  const label = createTag('div', { class: 'progress-label' });
  label.textContent = 'Launching the app store...';
  const track = createTag('div', { class: 'progress-bar-value' });
  track.style.display = 'block';
  const progressBar = createTag('div', { class: 'progress-bar' }, track);
  container.append(label, progressBar);
  elem.replaceWith(container);
  return container;
}

function removeBarLoader(elem, a) {
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
  const loaderCheck = getMetadata('quick-link-loader');

  const getConsentStatus = () => {
    const cookieGrp = window.adobePrivacy?.activeCookieGroups();
    return cookieGrp?.includes('C0002') && cookieGrp?.includes('C0004');
  };

  const waitForConsent = new Promise((resolve) => {
    if (window.cookieConsent !== undefined) {
      resolve(window.cookieConsent);
    } else {
      if (window.adobePrivacy) resolve(getConsentStatus());
      ['adobePrivacy:PrivacyConsent', 'adobePrivacy:PrivacyReject', 'adobePrivacy:PrivacyCustom']
        .forEach((event) => {
          window.addEventListener(event, () => {
            window.cookieConsent = getConsentStatus();
            resolve(window.cookieConsent);
          });
        });
    }
  });

  a.addEventListener('click', async (e) => {
    e.preventDefault();
    let pb;
    if (loaderCheck === 'progress-bar') pb = addBarLoader(a);
    const hasConsent = await waitForConsent;
    if (loaderCheck === 'progress-bar') removeBarLoader(pb, a);
    decorateQuickLink(a, hasConsent);
  });
}
