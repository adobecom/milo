import { loadScript, createTag } from '../../utils/utils.js';

export default async function init(el) {
  const bgImg = el.querySelectorAll(':scope > div')[0].textContent?.trim();
  el.innerHTML = '';
  const sentry = createTag('susi-sentry-light');
  sentry.setAttribute('stage', 'true');
  sentry.setAttribute('variant', 'standard');
  sentry.authParams = {
    client_id: 'milo',
    scope: 'AdobeID,openid,gnav',
    response_type: 'token',
    redirect_uri: window.location.href,
    locale: window.location.hash.substring(1) || 'en-us',
  };
  sentry.config = {};

  const lib = 'https://auth-light.identity-stage.adobe.com/sentry/wrapper.js';
  await loadScript(lib);

  const susiContainer = createTag('div', { class: 'susi-light-container' });
  susiContainer.style.backgroundImage = `url(${bgImg})`;
  const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
  susiWrapper.appendChild(sentry);

  // const productInfo = createTag('div', { class: 'susi-product-info' });
  // const logo = createTag('div', { class: 'susi-product-logo' });
  // const title = createTag('div', { class: 'susi-product-title' });
  // const tagline = createTag('div', { class: 'susi-product-tagline' });
  susiWrapper.appendChild(sentry);

  susiContainer.appendChild(susiWrapper);

  el.appendChild(susiContainer);
}
