import { loadScript, createTag } from '../../utils/utils.js';

export default async function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const bgImg = children[0].textContent?.trim();
  el.style.backgroundImage = `url(${bgImg})`;
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
  sentry.config = { title: 'Hello' };
  const onRedirect = (e) => {
    // eslint-disable-next-line no-console
    console.log('redirecting to:', e.detail);
    setTimeout(() => {
      window.location.assign(e.detail);
      // temporary solution: allows analytics to go thru
    }, 100);
  };

  sentry.addEventListener('redirect', onRedirect);

  const lib = 'https://auth-light.identity-stage.adobe.com/sentry/wrapper.js';
  await loadScript(lib);

  const loginContainer = createTag('div', { class: 'login-container' });

  const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
  susiWrapper.appendChild(sentry);
  loginContainer.appendChild(susiWrapper);

  const guestFooter = createTag('div', { class: 'guest-footer' }, children[2]);
  loginContainer.appendChild(guestFooter);

  const ps = children[1].querySelectorAll(':scope p');
  const productInfo = createTag('div', { class: 'susi-product-info' });
  const logoURL = ps[0].querySelector('img')?.getAttribute('src');
  const logo = createTag('img', { class: 'susi-product-logo', src: logoURL });
  const titleText = ps[1].textContent;
  const title = createTag('span', { class: 'susi-product-title' }, titleText);
  const taglineText = ps[2].textContent;
  const tagline = createTag('div', { class: 'susi-product-tagline' }, taglineText);
  productInfo.appendChild(logo);
  productInfo.appendChild(title);
  productInfo.appendChild(tagline);

  el.appendChild(loginContainer);
  el.appendChild(productInfo);
}
