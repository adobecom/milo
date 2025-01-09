import { getMetadata, loadStyle, getConfig, createTag } from '../../utils/utils.js';

function addCircleLoader(elem) {
  const { base } = getConfig();
  loadStyle(`${base}/styles/progress-circle.css`);
  const loader = createTag('div', { class: 'loader' });
  loader.style.display = 'block';
  const overlay = createTag('div', { class: 'overlay' }, loader);
  elem.prepend(overlay);
}

function removeCircleLoader(elem) {
  elem.querySelector('.overlay, .loader').style.display = 'none';
}

function addBarLoader(elem) {
  const { base } = getConfig();
  loadStyle(`${base}/styles/progress-bar.css`);
  const container = createTag('div', { class: 'progress-bar-container' });
  const progressBar = createTag('div', { class: 'progress-bar' });

  const label = createTag('div', { class: 'progress-label' });
  label.textContent = 'Launching the app store...';
  container.append(label);

  const track = createTag('div', { class: 'progress-bar-value' });
  track.style.display = 'block';
  progressBar.append(track);
  container.append(progressBar);
  elem.replaceWith(container);
  return container;
}

function removeBarLoader(elem, a) {
  elem.replaceWith(a);
}

async function decorateQuickLink(a, hasConsent) {
  if (!window.alloy) return;
  const { getECID } = await import('../../blocks/mobile-app-banner/mobile-app-banner.js');
  const ecid = await getECID();
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
      window.addEventListener('adobePrivacy:PrivacyConsent', () => {
        window.cookieConsent = getConsentStatus();
        resolve(window.cookieConsent);
      });
    }
  });

  a.addEventListener('click', async (e) => {
    e.preventDefault();
    let pb;
    if (loaderCheck === 'progress-circle') addCircleLoader(a);
    else if (loaderCheck === 'progress-bar') pb = addBarLoader(a);
    const hasConsent = await waitForConsent;
    if (loaderCheck === 'progress-bar') removeBarLoader(pb, a);
    else if (loaderCheck === 'progress-circle') removeCircleLoader(a);
    decorateQuickLink(a, hasConsent);
  });
}
