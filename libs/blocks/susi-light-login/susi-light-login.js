/* eslint-disable consistent-return */
import { loadScript, createTag, getConfig, loadIms, getMetadata } from '../../utils/utils.js';

const loadSusiLight = async (env) => {
  const lib = `https://auth-light.identity${env.name === 'prod' ? '' : '-stage'}.adobe.com/sentry/wrapper.js`;
  await loadScript(lib);
};

const redirectIfLoggedIn = async (destURL) => {
  const redirect = () => window.location.replace(destURL);
  try {
    if (!window.adobeIMS) await loadIms();
    if (window.adobeIMS?.isSignedInUser()) return redirect();
  } catch (e) {
    window.lana?.log(`Product Login pages: Unable to load IMS: ${e}`);
  }
};

const onRedirect = (e) => window.location.assign(e.detail);

const onError = (e) => window.lana?.log('Product Login pages: SUSI Light Error: ', e);

const getText = (e) => e?.textContent?.trim();
const layoutClasses = ['socialAndEmail', 'emailAndSocial', 'socialOnly', 'emailOnly'];
export class SusiLight {
  constructor(el) {
    this.el = el;
    this.children = el.querySelectorAll(':scope > div');
    this.isDesktop = window.matchMedia('(min-width: 900px)');
  }

  getRedirectURL = (env) => getText(this.children[4]) || `https://www.${env.name === 'prod' ? '' : 'stage.'}adobe.com/home`;

  init = async () => {
    const { env } = getConfig();
    redirectIfLoggedIn(this.getRedirectURL(env));
    await loadSusiLight(env);
    this.isDesktop.addEventListener('change', this.handleViewportChange);
    this.setBackground();
    this.el.innerHTML = '';

    const loginContainer = this.createLoginContainer();
    this.el.append(loginContainer);
  };

  handleViewportChange = () => this.setBackground();

  createAuthParams = () => {
    const { imsClientId, locale, imsScope, env } = getConfig();
    return {
      client_id: imsClientId,
      scope: imsScope || window.adobeid.scope || 'AdobeID,openid,gnav',
      response_type: 'code',
      redirect_uri: this.getRedirectURL(env),
      locale: locale?.ietf || 'en-US',
    };
  };

  createSusiElement = () => {
    const { env } = getConfig();
    const sentry = createTag('susi-sentry-light');
    const { classList } = this.el;
    const layoutClass = layoutClasses.find((layout) => classList.contains(layout.toLowerCase()));

    if (env.name !== 'prod') sentry.stage = true;
    sentry.variant = 'standard';
    sentry.authParams = this.createAuthParams();
    const dctxId = getMetadata('susi-light-dctx-id');
    if (dctxId) sentry.authParams.dctx_id = dctxId;
    sentry.config = { consentProfile: 'free' };
    sentry.addEventListener('redirect', onRedirect);
    sentry.addEventListener('on-error', onError);
    if (layoutClass) {
      sentry.config.layout = layoutClass;
    }
    return sentry;
  };

  createLoginContainer = () => {
    const loginContainer = createTag('div', { class: 'login-container' });
    const susiWrapper = createTag('div', { class: 'susi-light-wrapper' });
    const loginProduct = createTag('div', { class: 'login-product' });
    this.createProductInfo(loginProduct);
    const loginText = this.children[1]?.querySelectorAll('p');
    const loginTitle = createTag('h1', { class: 'login-title' }, loginText.length > 0 ? getText(loginText[0]) : getText(this.children[1]));
    const loginDesc = createTag('div', { class: 'login-description' }, loginText.length > 1 ? getText(loginText[1]) : '');
    const susiElement = this.createSusiElement();
    const guestFooter = createTag('div', { class: 'guest-footer' }, this.children[3]);

    susiWrapper.append(loginProduct, loginTitle, loginDesc, susiElement);
    loginContainer.append(susiWrapper, guestFooter);

    return loginContainer;
  };

  createProductInfo = (product) => {
    const prodInfo = this.children[2]?.querySelectorAll(':scope p');
    const titleText = getText(prodInfo[1]);
    const title = createTag('span', { class: 'susi-product-title' }, titleText);
    const logoEl = this.children[2]?.querySelector('img');
    const logoURL = logoEl?.getAttribute('src') || '';
    const altText = logoEl?.getAttribute('alt') || 'logo';
    const logo = createTag('img', { class: 'susi-product-logo', src: logoURL, alt: altText });
    if (!titleText) logo.style.width = 'auto';
    product.append(logo, title);
    return product;
  };

  parseBgImg = () => {
    const backgroundElement = this.children[0];

    const href = backgroundElement?.querySelector('a')?.getAttribute('href');
    if (href) return `url(${href})`;
    const src = backgroundElement?.querySelector('img')?.getAttribute('src');
    if (src) return `url(${src})`;

    const text = getText(backgroundElement);
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
