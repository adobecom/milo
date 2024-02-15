import { toFragment } from '../../blocks/global-navigation/utilities/utilities.js';
import { getConfig } from '../../utils/utils.js'; // TODO: doesn't make sense outside of Milo
import { replaceKey, replaceText } from '../placeholders.js';

const CONFIG = {
  selectors: { prompt: '.appPrompt' },
  delay: 7000,
  loaderColor: '#EB1000',
};
// update
const getElemText = (elem) => elem?.textContent?.trim().toLowerCase();

// Note: this might be used outside of Milo,
// thus trying to reduce imported modules that would cause an overhead
const getMetadata = (el) => [...el.childNodes].reduce((acc, row) => {
  if (row.children?.length === 2) {
    const key = getElemText(row.children[0]);
    const val = getElemText(row.children[1]);
    if (key && val) acc[key] = val;
  }
  return acc;
}, {});

class AppPrompt {
  constructor({ promptPath, id, profileApi } = {}) {
    this.promptPath = promptPath;
    this.id = id;
    this.profileApi = profileApi;
    this.elements = {};

    if (this.isDismissedPrompt()) return;

    this.init();
  }

  init = async () => {
    const content = await this.fetchContent();
    if (!content) return;

    await this.getData(content);
    // TODO: we might need to set this at the page level through metadata
    // so that the same prompt can lead to different apps
    if (!this.options['redirect-url']) return;

    this.template = this.decorate();

    this.addEventListeners();

    document.body.appendChild(this.template);
    this.elements.closeIcon.focus();

    this.redirectFn = this.initRedirect();
  };

  fetchContent = async () => {
    const res = await fetch(`${this.promptPath}.plain.html`);

    if (!res.ok) return '';

    const text = await res.text();
    // TODO: fetch placeholders from the federal project
    const content = await replaceText(text, getConfig());
    const html = new DOMParser().parseFromString(content, 'text/html');

    return html;
  };

  getData = async (content) => {
    // TODO: should we have a default app image?
    const image = content.querySelector('picture');
    this.image = image || '';

    const title = content.querySelector('h2');
    this.title = title?.innerText || '';

    const subtitle = content.querySelector('h3');
    // TODO: add placeholder to sheet and document that consumers will need to add it too
    this.subtitle = subtitle?.innerText || await replaceKey('pep-prompt-subtitle', getConfig());

    // TODO: we might need to also define a primary-like CTA
    const cancelText = content.querySelector('em > a');
    // TODO: add placeholder to sheet and document that consumers will need to add it too
    // TODO: is there a better way to let authors define the CTA text? Should we just use a placeholder?
    this.cancelText = cancelText?.innerText || await replaceKey('pep-prompt-cancel', getConfig());

    this.profile = {};
    const accessToken = window.adobeIMS.getAccessToken()?.token;

    const [imsProfile, ppsProfile] = await Promise.all([
      window.adobeIMS.getProfile(),
      // TODO: get profile data from the new PPS service, no clear API as of yet
      fetch(this.profileApi, { headers: new Headers({ Authorization: `Bearer ${accessToken}` }) }),
    ]).catch(() => [null, null]);

    if (imsProfile && ppsProfile) {
      ({ displayName: this.profile.name, email: this.profile.email } = imsProfile);
      ({ user: { avatar: this.profile.avatar } } = await ppsProfile.json());
    }

    const metadata = getMetadata(content.querySelector('.section-metadata'));
    metadata['loader-duration'] = parseInt(metadata['loader-duration'] || CONFIG.delay, 10);
    metadata['loader-color'] = metadata['loader-color'] || CONFIG.defaultColor;
    this.options = metadata;
  };

  // TODO: should we allow for app icon to be set as SVG?
  decorate = () => {
    this.elements.closeIcon = toFragment`<button class="appPrompt-close"></button>`;
    this.elements.cta = toFragment`<button class="appPrompt-cta appPrompt-cta--close">${this.cancelText}</button>`;
    this.elements.profile = Object.keys(this.profile).length
      ? toFragment`<div class="appPrompt-profile">
        <div class="appPrompt-avatar">
          <img class="appPrompt-avatar-image" src="${this.profile.avatar}" />
        </div>
        <div class="appPrompt-user">
          <div class="appPrompt-name">${this.profile.name}</div>
          <div class="appPrompt-email">${this.profile.email}</div>
        </div>
      </div>`
      : '';

    return toFragment`<div class="appPrompt">
      <div class="appPrompt-icon">
        ${this.image}
      </div>
      <div class="appPrompt-title">${this.title}</div>
      ${this.elements.profile}
      <div class="appPrompt-footer">
        <div class="appPrompt-text">${this.subtitle}</div>
        ${this.elements.cta}
      </div>
      <div class="appPrompt-progressWrapper">
        <div class="appPrompt-progress" style="background-color: ${this.options['loader-color']}; animation-duration: ${this.options['loader-duration']}ms;"></div>
      </div>
      ${this.elements.closeIcon}
    </div>`;
  };

  addEventListeners = () => {
    // TODO: not clear if this is still needed
    // document.addEventListener('click', (e) => {
    //   if (!e.target.closest(CONFIG.selectors.prompt)) AppPrompt.close();
    // });

    [this.elements.closeIcon, this.elements.cta]
      .forEach((elem) => elem.addEventListener('click', this.close));
  };

  initRedirect = () => setTimeout(() => {
    // TODO: uncomment for actual redirect
    // this.close();
    // window.location = this.options['redirect-url'];
  }, this.options['loader-duration']);

  isDismissedPrompt = () => AppPrompt.getDismissedPrompts().includes(this.id);

  setDismissedPrompt = () => {
    const dismissedPrompts = new Set(AppPrompt.getDismissedPrompts());
    dismissedPrompts.add(this.id);
    document.cookie = `dismissedAppPrompts=${JSON.stringify([...dismissedPrompts])};path=/`;
  };

  close = () => {
    const appPromptElem = document.querySelector(CONFIG.selectors.prompt);
    appPromptElem?.remove();
    clearTimeout(this.redirectFn);
    this.setDismissedPrompt();
  };

  static getDismissedPrompts = () => {
    const cookie = document.cookie
      .split(';')
      .find((item) => item.trim().startsWith('dismissedAppPrompts='))
      ?.split('=')[1];

    return cookie ? JSON.parse(cookie) : [];
  };
}

export default async function init(config) {
  // TODO: fail gracefully and log errors
  const appPrompt = await new AppPrompt(config);
  return appPrompt;
}
