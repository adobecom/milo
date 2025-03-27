import { loadScript, createTag, getConfig, loadIms } from '../../utils/utils.js';

const loadSusiLight = async () => {
  const lib = 'https://auth-light.identity-stage.adobe.com/sentry/wrapper.js';
  await loadScript(lib);
};

const redirectIfLoggedIn = async (el, destURL = 'https://www.adobe.com') => {
  const redirect = () => {
    window.location.assign(destURL);
  };
  if (window.adobeIMS?.isSignedInUser()) redirect();
  try {
    await loadIms();
    if (window.adobeIMS?.isSignedInUser()) {
      return redirect();
    }
  } catch (e) {
    window.lana?.log(`Unable to load IMS in SUSI: ${e}`);
  }
};

const createAuthParams = (children) => {
  const { imsClientId } = getConfig();
  return {
    client_id: imsClientId,
    scope: 'AdobeID,openid,gnav',
    response_type: 'token',
    redirect_uri: children[5].textContent.trim(),
    locale: window.location.hash.substring(1) || 'en-us',
  };
};

const onRedirect = (e) => {
  // eslint-disable-next-line no-console
  console.log('redirecting to:', e.detail);
  setTimeout(() => {
    window.location.assign(e.detail);
    // temporary solution: allows analytics to go thru
  }, 100);
};

const onAnalytics = (e) => {
  // eslint-disable-next-line no-console
  console.log('analytics:', e.detail);
  // setTimeout(() => {
  //   window.location.assign(e.detail);
  //   // temporary solution: allows analytics to go thru
  // }, 100);
};

const createSusiElement = (children) => {
  const sentry = createTag('susi-sentry-light');
  sentry.stage = true;
  sentry.variant = 'standard';
  sentry.authParams = createAuthParams(children);
  sentry.config = {};
  sentry.addEventListener('redirect', onRedirect);
  sentry.addEventListener('on-analytics', onAnalytics);
  return sentry;
};

const createLoginContainer = (children) => {
  const loginContainer = createTag('div', { class: 'login-container' });
  const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
  const loginTitle = createTag('div', { class: 'login-title' }, children[1].textContent);
  const loginDesc = createTag('div', { class: 'login-description' }, children[2].textContent);
  susiWrapper.appendChild(loginTitle);
  susiWrapper.appendChild(loginDesc);

  susiWrapper.appendChild(createSusiElement(children));
  loginContainer.appendChild(susiWrapper);
  const guestFooter = createTag('div', { class: 'guest-footer' }, children[4]);
  loginContainer.appendChild(guestFooter);
  return loginContainer;
};

const createProductInfoElement = (children) => {
  const ps = children[3].querySelectorAll(':scope p');
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
  return productInfo;
};

const setBackground = (children, el, isDesktop) => {
  const bgImg = children[0].textContent?.trim();
  if (isDesktop.matches && bgImg) el.style.backgroundImage = `url(${bgImg})`;
  else el.style.removeProperty('background-image');
};

export default async function init(el) {
  redirectIfLoggedIn(el);
  const isDesktop = window.matchMedia('(min-width: 900px)');
  await loadSusiLight();
  const children = el.querySelectorAll(':scope > div');
  isDesktop.addEventListener('change', () => { setBackground(children, el, isDesktop); });
  setBackground(children, el, isDesktop);
  el.innerHTML = '';

  const loginContainer = createLoginContainer(children);
  const productInfo = createProductInfoElement(children);

  el.appendChild(loginContainer);
  el.appendChild(productInfo);
}
