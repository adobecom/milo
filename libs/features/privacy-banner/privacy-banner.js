// libs/features/privacy-banner/privacy-banner.js

import privacyState from '../privacy-modal/privacy-state.js';

async function fetchBannerJson(config) {
  // Default: SharePoint or fallback URL. Adjust as needed for your environment.
  const root = config.contentRoot ?? '';
  const url1 = `${root}/privacy/privacy-banner.json`;
  const url2 = 'https://stage--federal--adobecom.aem.page/federal/dev/snehal/privacy/privacy-banner.json';
  let resp = await fetch(url1, { cache: 'no-cache' });
  if (resp.ok) return resp.json();
  resp = await fetch(url2, { cache: 'no-cache' });
  if (resp.ok) return resp.json();
  throw new Error('Privacy banner JSON not found');
}

export default async function loadPrivacyBanner(config, createTag, getMetadata, loadStyle) {
  if (document.querySelector('.privacy-banner')) return; // Prevent duplicates

  // Load CSS
  loadStyle(`${config.miloLibs || config.codeRoot}/features/privacy-banner/privacy-banner.css`);

  // Fetch banner JSON
  let bannerData = {
    title: 'Make It Your Own',
    description: 'Adobe and its vendors use cookies and similar technologies to improve your experience and measure your interactions with our websites, products and services. We also use them to provide you more relevant information in searches and in ads on this and other sites. If that’s okay, click “Enable all”. Clicking “Don’t enable” will set only cookies that are strictly necessary. You can also view our vendors and customize your choices by clicking "Cookie Settings".'
  };
  try {
    const json = await fetchBannerJson(config);
    if (json?.data?.[0]) {
      bannerData = json.data[0];
    }
  } catch (e) {
    // If fetch fails, use defaults
  }

  // Banner elements
  const banner = createTag('div', { class: 'privacy-banner', role: 'region', 'aria-label': 'Cookie banner' });
  const wrap = createTag('div', { class: 'privacy-banner-wrap' });

  const content = createTag('div', { class: 'privacy-banner-content' });
  content.append(
    createTag('h2', { class: 'privacy-banner-title' }, bannerData.title),
    createTag('div', { class: 'privacy-banner-desc' }, bannerData.description)
  );

  // Actions
  const btnRow = createTag('div', { class: 'privacy-banner-actions' });
  const btnSettings = createTag('button', { class: 'privacy-banner-btn settings', type: 'button' }, 'Cookie Settings');
  const btnGroup = createTag('div', { class: 'privacy-banner-action-group' });
  const btnReject = createTag('button', { class: 'privacy-banner-btn reject', type: 'button' }, "Don't Enable");
  const btnAccept = createTag('button', { class: 'privacy-banner-btn accept', type: 'button' }, 'Enable all');
  btnGroup.append(btnReject, btnAccept);
  btnRow.append(btnSettings, btnGroup);

  wrap.append(content, btnRow);
  banner.append(wrap);

  // Button Actions
  btnAccept.onclick = () => {
    privacyState.setConsent(['C0001', 'C0002', 'C0003', 'C0004']);
    banner.remove();
  };
  btnReject.onclick = () => {
    privacyState.setConsent(['C0001']);
    banner.remove();
  };
  btnSettings.onclick = () => {
    document.dispatchEvent(new CustomEvent('adobePrivacy:OpenModal'));
    banner.remove();
  };

  // Show banner if no consent
  if (!privacyState.hasExistingConsent()) {
    document.body.append(banner);
  }
}
