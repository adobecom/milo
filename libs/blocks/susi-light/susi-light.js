import { loadScript, createTag, getConfig, loadIms, isSignedOut } from '../../utils/utils.js';

const loadSusiLight = async () => {
  const lib = 'https://auth-light.identity-stage.adobe.com/sentry/wrapper.js';
  await loadScript(lib);
};

const redirectIfLoggedIn = async (destURL = 'https://www.adobe.com') => {
  const redirect = () => {
    window.location.replace(destURL);
  };
  if (!isSignedOut()) redirect();
  if (window.adobeIMS?.isSignedInUser()) redirect();
  try {
    await loadIms();
    if (window.adobeIMS?.isSignedInUser()) {
      redirect();
    }
  } catch (e) {
    window.lana?.log(`Unable to load IMS in SUSI Light: ${e}`);
  }
};

const onRedirect = (e) => {
  window.location.replace(e.detail);
};

class SusiLight {
  constructor(el) {
    this.el = el;
    this.children = el.querySelectorAll(':scope > div');
    this.isDesktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    redirectIfLoggedIn(this.children[5]?.textContent?.trim());
    await loadSusiLight();
    this.isDesktop.addEventListener('change', this.handleViewportChange);
    this.setBackground(this.children, this.el, this.isDesktop);
    this.el.innerHTML = '';

    const loginContainer = this.createLoginContainer();
    const productInfo = this.createProductInfoElement();

    this.el.appendChild(loginContainer);
    this.el.appendChild(productInfo);
  };

  handleViewportChange = () => {
    this.setBackground(this.children, this.el, this.isDesktop);
  };

  createAuthParams = () => {
    const { imsClientId } = getConfig();
    return {
      client_id: imsClientId,
      scope: 'AdobeID,openid,gnav',
      response_type: 'token',
      redirect_uri: this.children[5]?.textContent?.trim() || 'https://www.adobe.com/home',
      locale: window.location.hash.substring(1) || 'en-us',
    };
  };

  createSusiElement = () => {
    const sentry = createTag('susi-sentry-light');
    sentry.stage = true;
    sentry.variant = 'standard';
    sentry.authParams = this.createAuthParams();
    sentry.config = {};
    sentry.addEventListener('redirect', onRedirect);
    return sentry;
  };

  createLoginContainer = () => {
    const loginContainer = createTag('div', { class: 'login-container' });
    const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
    const loginProduct = createTag('div', { class: 'login-product' });
    this.createProductInfo(loginProduct);
    const loginTitle = createTag('div', { class: 'login-title' }, this.children[1]?.textContent);
    const loginDesc = createTag('div', { class: 'login-description' }, this.children[2]?.textContent);
    susiWrapper.appendChild(loginProduct);
    susiWrapper.appendChild(loginTitle);
    susiWrapper.appendChild(loginDesc);
    susiWrapper.appendChild(this.createSusiElement());
    loginContainer.appendChild(susiWrapper);
    const guestFooter = createTag('div', { class: 'guest-footer' }, this.children[4]);
    loginContainer.appendChild(guestFooter);
    return loginContainer;
  };

  createProductInfo = (product) => {
    const ps = this.children[3].querySelectorAll(':scope p');
    const logoURL = ps[0].querySelector('img')?.getAttribute('src');
    const logo = createTag('img', { class: 'susi-product-logo', src: logoURL });
    const titleText = ps[1].textContent;
    const title = createTag('span', { class: 'susi-product-title' }, titleText);
    product.appendChild(logo);
    product.appendChild(title);
    return product;
  };

  createProductInfoElement = () => {
    const ps = this.children[3].querySelectorAll(':scope p');
    const productInfo = createTag('div', { class: 'susi-product-info' });
    const taglineText = ps[2].textContent;
    const tagline = createTag('div', { class: 'susi-product-tagline' }, taglineText);
    const product = createTag('div', { class: 'susi-product' });
    productInfo.appendChild(this.createProductInfo(product));
    productInfo.appendChild(tagline);
    return productInfo;
  };

  setBackground = () => {
    const bgImg = this.children[0].textContent?.trim();
    try {
      const bgUrl = new URL(bgImg).href;
      if (this.isDesktop.matches && bgImg) this.el.style.backgroundImage = `url(${bgUrl})`;
      else this.el.style.removeProperty('background-image');
    } catch (e) {
      const gradientPattern = /^(repeating?-)?(linear|radial|conic)-gradient\(.+\)$/;
      if (gradientPattern.test(bgImg)) {
        if (this.isDesktop.matches && bgImg) this.el.style.backgroundImage = bgImg;
        else this.el.style.removeProperty('background-image');
      }
    }
  };
}

export default async function init(el) {
  const susi = new SusiLight(el);
  await susi.init();
  return susi;
}
