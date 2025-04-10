/* eslint-disable consistent-return */
import { loadScript, createTag, getConfig, loadIms, isSignedOut } from '../../utils/utils.js';

const loadSusiLight = async (env) => {
  const lib = `https://auth-light.identity${env.name === 'prod' ? '' : '-stage'}.adobe.com/sentry/wrapper.js`;
  await loadScript(lib);
};

const redirectIfLoggedIn = async (destURL) => {
  const redirect = () => window.location.replace(destURL);
  if (!isSignedOut()) return redirect();
  try {
    if (!window.adobeIMS) await loadIms();
    if (window.adobeIMS?.isSignedInUser()) return redirect();
  } catch (e) {
    window.lana?.log(`Product Login pages: Unable to load IMS: ${e}`);
  }
};

const onRedirect = (e) => window.location.replace(e.detail);

const onError = (e) => window.lana?.log('Product Login pages: SUSI Light Error: ', e);

export class SusiLight {
  constructor(el) {
    this.el = el;
    this.children = el.querySelectorAll(':scope > div');
    this.isDesktop = window.matchMedia('(min-width: 900px)');
  }

  getRedirectURL = (env) => this.children[5]?.textContent?.trim() || `https://www.${env.name === 'prod' ? '' : 'stage.'}adobe.com/home`;

  init = async () => {
    const { env } = getConfig();
    redirectIfLoggedIn(this.getRedirectURL(env));
    await loadSusiLight(env);
    this.isDesktop.addEventListener('change', this.handleViewportChange);
    this.setBackground();
    this.el.innerHTML = '';

    const loginContainer = this.createLoginContainer();
    const productInfo = this.createProductInfoElement();

    this.el.append(loginContainer, productInfo);
  };

  handleViewportChange = () => this.setBackground();

  createAuthParams = () => {
    const { imsClientId, locale, imsScope, env } = getConfig();
    return {
      client_id: imsClientId,
      scope: imsScope || window.adobeid.scope || 'AdobeID,openid,gnav',
      response_type: 'token',
      redirect_uri: this.getRedirectURL(env),
      locale: locale?.ietf || 'en-US',
    };
  };

  createSusiElement = () => {
    const sentry = createTag('susi-sentry-light');
    sentry.stage = true;
    sentry.variant = 'standard';
    sentry.authParams = this.createAuthParams();
    sentry.config = {};
    sentry.addEventListener('redirect', onRedirect);
    sentry.addEventListener('on-error', onError);
    return sentry;
  };

  createLoginContainer = () => {
    const loginContainer = createTag('div', { class: 'login-container' });
    const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
    const loginProduct = createTag('div', { class: 'login-product' });
    this.createProductInfo(loginProduct);
    const loginTitle = createTag('div', { class: 'login-title' }, this.children[1]?.textContent);
    const loginDesc = createTag('div', { class: 'login-description' }, this.children[2]?.textContent);
    const susiElement = this.createSusiElement();
    const guestFooter = createTag('div', { class: 'guest-footer' }, this.children[4]);

    susiWrapper.append(loginProduct, loginTitle, loginDesc, susiElement);
    loginContainer.append(susiWrapper, guestFooter);

    return loginContainer;
  };

  createProductInfo = (product) => {
    const prodInfo = this.children[3]?.querySelectorAll(':scope p');
    const titleText = prodInfo[1]?.textContent;
    const title = createTag('span', { class: 'susi-product-title' }, titleText);
    const logoURL = prodInfo[0]?.querySelector('img')?.getAttribute('src') || '';
    const logo = createTag('img', { class: 'susi-product-logo', src: logoURL, alt: `${titleText}-logo` });
    product.append(logo, title);
    return product;
  };

  createProductInfoElement = () => {
    const prodInfo = this.children[3]?.querySelectorAll(':scope p');
    const productInfo = createTag('div', { class: 'susi-product-info' });
    const tagline = createTag('div', { class: 'susi-product-tagline' }, prodInfo[2].textContent);
    const product = createTag('div', { class: 'susi-product' });
    productInfo.append(this.createProductInfo(product), tagline);
    return productInfo;
  };

  parseBgImg = () => {
    const backgroundElement = this.children[0];

    const href = backgroundElement?.querySelector('a')?.getAttribute('href');
    if (href) return `url(${href})`;
    const src = backgroundElement?.querySelector('img')?.getAttribute('src');
    if (src) return `url${href})`;

    const text = backgroundElement?.textContent?.trim();
    const gradientPattern = /^(repeating?-)?(linear|radial|conic)-gradient\(.+\)$/;
    if (gradientPattern.test(text)) return text;

    return null;
  };

  setBackground = () => {
    const bgImg = this.parseBgImg();
    if (this.isDesktop.matches && bgImg) this.el.style.backgroundImage = bgImg;
    else this.el.style.removeProperty('background-image');
  };
}

export default async function init(el) {
  const susi = new SusiLight(el);
  await susi.init();
  return susi;
}
