import {
  createTag,
  getConfig,
  getMetadata,
  lingoActive,
} from '../../../utils/utils.js';
import { getMarketConfig, marketsLangForLocale } from '../../../utils/market.js';
import { getMiloLocaleSettings, isMasGeoDetectionEnabled } from '../../../blocks/merch/merch.js';
import { mepMasSubCollections } from './mep-mas-subcollection.js';
import { US_GEO, getFileName, normalizePath } from '../../personalization/personalization.js';
import {
  MAS_OSI_SELECTOR,
  hasMasSurfaces,
  injectMasBadges,
  removeMasBadges,
  watchForMasContent,
  unwatchForMasContent,
} from './mep-mas.js';
import {
  injectCaasBadges,
  removeCaasBadges,
  watchForCaasBlocks,
  unwatchForCaasBlocks,
} from './mep-caas.js';

export function escapeHtml(str) {
  if (str == null || str === '') return str;
  const el = document.createElement('span');
  el.textContent = String(str);
  return el.innerHTML;
}

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page`,
  pageDataByURL: `${API_DOMAIN}/get-page?url=`,
  save: `${API_DOMAIN}/save-mep-call`,
  report: `${API_DOMAIN}/get-report`,
};

function toActivity({
  name, event, manifest, variantNames, selectedVariantName,
  disabled, analyticsTitle, source, geoRestriction, mktgAction,
}) {
  let pathname = manifest;
  try { pathname = new URL(manifest).pathname; } catch (e) { /* do nothing */ }
  return {
    targetActivityName: name,
    variantNames,
    selectedVariantName,
    url: manifest,
    disabled,
    source,
    eventStart: event?.start,
    eventEnd: event?.end,
    pathname,
    analyticsTitle,
    geoRestriction,
    mktgAction,
  };
}

function updatePreviewButton(popup, pageId) {
  const selectedInputs = popup.querySelectorAll(
    'option:checked, input[type="text"]',
  );
  const manifestParameter = [];

  selectedInputs.forEach((selected) => {
    const parentSelect = selected.closest('select');
    const isHidden = parentSelect?.disabled;
    const parentSelectId = parentSelect?.id || '';
    // Spoofer dropdowns drive ?akamaiLocale; no data-manifest = serializes as "undefined--…".
    const isSpooferSelect = parentSelectId.startsWith('mepLingoRegionSelect')
      || parentSelectId.startsWith('mepMasMarketSelect');

    if (!selected.value || isHidden || isSpooferSelect) return;

    let { value } = selected;

    if (selected.classList.contains('new-manifest') && value) {
      try {
        const newManifest = new URL(value);
        // A parsed URL's pathname is never empty (at minimum '/'), so this fallback
        // to the original value is defensive only.
        /* c8 ignore next */
        value = newManifest.pathname || value;
      } catch {
        // Ignore invalid URL
      }
    } else {
      value = `${selected.dataset.manifest}--${value}`;
    }

    manifestParameter.push(value);
  });

  // MMM always renders a data-url on the popup (see getMepPopup); no other caller remains.
  const page = popup.closest('[data-url]').dataset.url;
  const simulateHref = new URL(page);
  simulateHref.searchParams.set('mep', manifestParameter.join('---'));

  const mepHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepHighlightCheckbox${pageId}`,
  );

  document.body.dataset.mepHighlight = mepHighlightCheckbox.checked;
  if (mepHighlightCheckbox.checked) {
    simulateHref.searchParams.set('mepHighlight', true);
  } else {
    simulateHref.searchParams.delete('mepHighlight');
  }

  const mepFragmentsCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepFragmentsCheckbox${pageId}`,
  );

  document.body.dataset.mepFragments = mepFragmentsCheckbox.checked;
  if (mepFragmentsCheckbox.checked) {
    simulateHref.searchParams.set('mepFragments', true);
  } else {
    simulateHref.searchParams.delete('mepFragments');
  }

  const mepCaasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepCaasHighlightCheckbox${pageId}`,
  );

  if (mepCaasHighlightCheckbox) {
    document.body.dataset.mepCaasHighlight = mepCaasHighlightCheckbox.checked;
    if (mepCaasHighlightCheckbox.checked) {
      simulateHref.searchParams.set('mepCaasHighlight', true);
      watchForCaasBlocks();
      injectCaasBadges();
    } else {
      simulateHref.searchParams.delete('mepCaasHighlight');
      unwatchForCaasBlocks();
      removeCaasBadges();
    }
  }

  const mepMasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasHighlightCheckbox${pageId}`,
  );
  if (mepMasHighlightCheckbox) {
    document.body.dataset.mepMasHighlight = mepMasHighlightCheckbox.checked;
    if (mepMasHighlightCheckbox.checked) {
      simulateHref.searchParams.set('mepMasHighlight', true);
      watchForMasContent();
      injectMasBadges();
    } else {
      simulateHref.searchParams.delete('mepMasHighlight');
      unwatchForMasContent();
      removeMasBadges();
    }
  }

  const mepPreviewButtonCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepPreviewButtonCheckbox${pageId}`,
  );
  if (mepPreviewButtonCheckbox.checked) {
    simulateHref.searchParams.set('mepButton', 'off');
  } else {
    simulateHref.searchParams.delete('mepButton');
  }

  // Three popup shapes for the region/market spoofer (see getMepPopup):
  //   1) Lingo + M@S: checkbox toggles which dropdown writes ?akamaiLocale
  //   2) Lingo only:  Lingo dropdown writes ?akamaiLocale unconditionally
  //   3) Non-Lingo + M@S: standalone M@S dropdown writes ?akamaiLocale +
  //      ?mepMasMarket=true (re-pre-selects on reload)
  const mepMasMarketCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasMarketCheckbox${pageId}`,
  );
  const mepLingoRegionSelect = popup.querySelector(
    `select#mepLingoRegionSelect${pageId}`,
  );
  const mepMasMarketSelect = popup.querySelector(
    `select#mepMasMarketSelect${pageId}`,
  );
  const mepMasMarketWrapper = popup.querySelector('.mep-mas-market-dropdown');
  const masMarketOn = !!mepMasMarketCheckbox?.checked;
  if (mepLingoRegionSelect) mepLingoRegionSelect.disabled = masMarketOn;
  // Only Lingo+M@S gates the dropdown on the checkbox; the standalone variant is always visible.
  if (mepMasMarketWrapper && !mepMasMarketWrapper.classList.contains('standalone')) {
    mepMasMarketWrapper.hidden = !masMarketOn;
  }
  if (masMarketOn) {
    simulateHref.searchParams.set('mepMasMarket', 'true');
    const masVal = mepMasMarketSelect?.value;
    if (masVal) {
      simulateHref.searchParams.set('akamaiLocale', masVal);
    } else {
      simulateHref.searchParams.delete('akamaiLocale');
    }
  } else if (!mepMasMarketCheckbox && mepMasMarketSelect) {
    // Standalone shape (non-Lingo + M@S): dropdown is authoritative,
    // mepMasMarket=true persists the selection across reloads.
    const masVal = mepMasMarketSelect.value;
    if (masVal) {
      simulateHref.searchParams.set('mepMasMarket', 'true');
      simulateHref.searchParams.set('akamaiLocale', masVal);
    } else {
      simulateHref.searchParams.delete('mepMasMarket');
      simulateHref.searchParams.delete('akamaiLocale');
    }
  } else {
    simulateHref.searchParams.delete('mepMasMarket');
    if (mepLingoRegionSelect) {
      const selectedRegion = mepLingoRegionSelect.value;
      if (selectedRegion) {
        simulateHref.searchParams.set('akamaiLocale', selectedRegion);
      } else {
        simulateHref.searchParams.delete('akamaiLocale');
      }
    }
  }

  popup
    .querySelector('a.con-button')
    .setAttribute('href', simulateHref.href);
}

function changeTab(event) {
  const tabs = event.target.closest('.mep-popup-tabs').querySelectorAll('.mep-tab');
  const index = Array.from(tabs).indexOf(event.target);

  tabs.forEach((tab, i) => {
    tab.toggleAttribute('active', i === index);
    event.target.closest('.mep-popup').querySelectorAll('.mep-popup-body')[i]?.toggleAttribute('active', i === index);
  });
}

function expandManifest(event) {
  event.target.closest('.mep-manifest-toggle').toggleAttribute('active');
  event.target.closest('.mep-section').querySelector('.mep-manifest-info')?.toggleAttribute('active');
}

function addDividers(node, selector) {
  node.querySelectorAll(selector).forEach((section, index) => {
    if (index === node.querySelectorAll(selector).length - 1) return;
    const mepDivider = createTag('div', { class: 'mep-divider' });
    section.insertAdjacentElement('afterend', mepDivider);
  });
}

export function parsePageAndUrl(config, windowLocation, prefix) {
  const { stageDomainsMap, env } = config;
  const { pathname, origin } = windowLocation;
  const allowedHosts = [
    'business.stage.adobe.com',
    'www.stage.adobe.com',
    'milo.stage.adobe.com',
  ];
  if (env?.name === 'prod' || !stageDomainsMap
    || allowedHosts.includes(origin.replace('https://', ''))) {
    const domain = origin.replace('stage.adobe.com', 'adobe.com');
    return { page: pathname.replace(`/${prefix}/`, '/'), url: `${domain}${pathname}` };
  }
  let path = pathname;
  let domain = origin;
  const domainCheck = Object.keys(stageDomainsMap)
    .find((key) => {
      try {
        const { host } = new URL(`https://${key}`);
        return allowedHosts.includes(host);
      } catch (e) {
        /* c8 ignore next 2 */
        return false;
      }
    });
  if (domainCheck) domain = `https://${domainCheck}`;
  path = path.replace('/homepage/index-loggedout', '/');
  if (!path.endsWith('/') && !path.endsWith('.html') && !domain.includes('milo')) {
    path += '.html';
  }
  domain = domain.replace('stage.adobe.com', 'adobe.com');
  return { page: path.replace(`/${prefix}/`, '/'), url: `${domain}${path}` };
}
function parseMepConfig() {
  const config = getConfig();
  const { mep, locale } = config;
  if (!mep || !locale) return null;
  const { experiments, prefix, highlight } = mep;
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: getMetadata('personalization') ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale?.ietf,
      region: locale?.region,
      highlight,
    },
    activities: experiments.map(toActivity),
  };
}
function formatDate(dateTime, format = 'local') {
  // Every call site already guards with a truthy check before calling formatDate.
  /* c8 ignore next */
  if (!dateTime) return '';
  let dateObj = dateTime;
  if (typeof dateObj === 'string') dateObj = new Date(dateObj);
  if (format === 'iso') return dateObj.toISOString();
  const date = dateObj.toLocaleDateString(false, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const time = dateObj.toLocaleTimeString(false, { timeStyle: 'short' });
  return `${date} ${time}`;
}
function getManifestListDomAndParameter(mepConfig) {
  const { activities, page } = mepConfig;
  const { pageId = 0 } = page;
  let manifestList = '';
  const manifestParameter = [];
  activities?.forEach((manifest, mIdx) => {
    const {
      variantNames,
      manifestPath = manifest.url,
      selectedVariantName = manifest.selectedVariantName || 'default',
      manifestUrl,
      targetActivityName,
      source,
      analyticsTitle,
      eventStart,
      eventEnd,
      disabled,
      geoRestriction,
      mktgAction,
    } = manifest;
    const editUrl = manifestUrl || manifestPath;
    const editPath = normalizePath(editUrl);
    const variantNamesArray = typeof variantNames === 'string' ? variantNames.split('||') : variantNames;
    let options = '';
    let isSelected = '';
    if (!variantNames.includes(selectedVariantName) && pageId === 0) {
      isSelected = 'selected';
      manifestParameter.push(`${editUrl}--default`);
    }
    options += `<option name="${editPath}${pageId}" value="" title="none">None (Don't add manifest)</option>`;
    options += `<option name="${editPath}${pageId}" value="default" 
    id="${editPath}${pageId}--default" data-manifest="${editPath}" ${isSelected} title="Default (control)">Default (control)</option>`;
    isSelected = '';
    variantNamesArray.forEach((variant) => {
      isSelected = '';
      if (variant === selectedVariantName) {
        isSelected = 'selected';
        manifestParameter.push(`${manifestPath}--${variant}`);
      }
      options += `<option name="${editPath}${pageId}" value="${variant}" 
      id="${editPath}${pageId}--${variant}" data-manifest="${editPath}" ${isSelected} title="${variant}">${variant}</option>`;
    });
    const expandSVG = `
    <svg xmlns="<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="mep-toggle-expand">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
    </svg>`;
    const collapseSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="mep-toggle-collapse">
      <path d="M200-440v-80h560v80H200Z"/>
    </svg>`;
    manifestList += `
    <div class="mep-section" title="Manifest location: ${editUrl}&#013;Analytics manifest name: ${analyticsTitle || 'N/A for this manifest type'}">
      <div class="mep-manifest-title">
        <a class="mep-edit-manifest" href="${editUrl}" target="_blank" title="Open manifest">
          ${mIdx + 1}. ${getFileName(manifestPath)}
        </a>
        <div class="mep-manifest-toggle">${expandSVG}${collapseSVG}</div>
      </div>   
      <div class="mep-manifest-info">
            ${targetActivityName ? `<div class="target-activity-name">${targetActivityName || ''}</div>` : ''}
              <div class="mep-section-data">
                  <span class="mep-active">Experience</span>
                ${!variantNames.includes(selectedVariantName) ? `
                  <span class="mep-active">default (control)</span>` : `
                  <span class='mep-active mep-selected-variant'>${selectedVariantName}</span>`}
                  <span>Source</span>
                  <span>${source}</span>
                  <span>Mktg action</span>
                  <span>${mktgAction}</span>
                ${geoRestriction ? `
                  <span>Geo</span>
                  <span>${geoRestriction.toUpperCase()}</span>` : ''}
                ${(eventStart && eventEnd) || disabled ? `
                  <span>Active?</span>
                  <span>${disabled ? 'inactive' : 'active'}</span>` : ''}
                ${manifest.lastSeen ? `
                  <span>Last Seen</span>
                  <span>${formatDate(new Date(manifest.lastSeen))}</span>` : ''}  
                ${eventStart && eventEnd ? `
                  <span>On</span>
                  <span>${formatDate(eventStart)} 
                  <br><a target= "_blank" href="?instant=${formatDate(eventStart, 'iso')}">Instant</a>
                  </span>
                  <span>Off</span>
                  <span>${formatDate(eventEnd)}</span>` : ''}
              </div>
      </div>
      <div class="mep-experience-dropdown">
        <select name="experiences" class="mep-manifest-variants">${options}</select>
      </div>
    </div>`;
  });

  return { manifestList, manifestParameter };
}
function addMepPopupListeners(popup, pageId) {
  // One-way auto-check: flipping Highlight M@S ON also pre-toggles "Use M@S markets instead"
  // so the dropdown unhides in the same click. Never auto-unchecks. Must run BEFORE the
  // blanket change listener below so the first updatePreviewButton sees the auto-check.
  const mepMasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasHighlightCheckbox${pageId}`,
  );
  const mepMasMarketCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasMarketCheckbox${pageId}`,
  );
  if (mepMasHighlightCheckbox && mepMasMarketCheckbox) {
    mepMasHighlightCheckbox.addEventListener('change', (event) => {
      if (event.target.checked && !mepMasMarketCheckbox.checked) {
        mepMasMarketCheckbox.checked = true;
      }
    });
  }
  popup.querySelectorAll('select, input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton.bind(null, popup, pageId));
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('.mep-popup-tabs .mep-tab').forEach((input) => {
    input.addEventListener('click', (event) => changeTab.bind(null, event)());
    input.addEventListener('click', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('.mep-manifest-title .mep-manifest-toggle').forEach((input) => {
    input.addEventListener('click', (event) => expandManifest.bind(null, event)());
  });
}
function setTargetOnText(target, page) {
  if (target === undefined) return page.target;
  return target === 'postlcp' ? 'on post LCP' : target;
}
// getMepPopup now only serves MMM (libs/blocks/mmm/mmm.js) — the in-page preview
// popup it used to render is replaced by mep-overlay/mep-overlay.js.
export async function getMepPopup(mepConfig) {
  const { page } = mepConfig;
  const pageId = page?.pageId ? `-${page.pageId}` : '';

  // Check URL parameters for highlight and fragments
  const urlParams = new URLSearchParams(window.location.search);
  const highlightParam = urlParams.get('mepHighlight');
  const fragmentsParam = urlParams.get('mepFragments');
  const caasHighlightParam = urlParams.get('mepCaasHighlight');
  const masHighlightParam = urlParams.get('mepMasHighlight');
  const masMarketParam = urlParams.get('mepMasMarket');

  let mepHighlightChecked = '';
  if (page?.highlight || highlightParam === 'true') {
    mepHighlightChecked = 'checked="checked"';
    document.body.dataset.mepHighlight = true;
  }
  let mepFragmentsChecked = '';
  if (page?.fragments || fragmentsParam === 'true') {
    mepFragmentsChecked = 'checked="checked"';
    document.body.dataset.mepFragments = true;
  }
  let mepCaasHighlightChecked = '';
  if (caasHighlightParam === 'true') {
    mepCaasHighlightChecked = 'checked="checked"';
    document.body.dataset.mepCaasHighlight = true;
  }
  let mepMasHighlightChecked = '';
  if (masHighlightParam === 'true') {
    mepMasHighlightChecked = 'checked="checked"';
    document.body.dataset.mepMasHighlight = true;
  }
  const masMarketChecked = masMarketParam === 'true';
  const mepMasMarketCheckedAttr = masMarketChecked ? 'checked="checked"' : '';
  const PREVIEW_BUTTON_ID = 'preview-button';
  const mepPopup = createTag('div', {
    class: 'mep-popup',
    'data-url': page.url,
  });

  const config = getConfig();
  const regionKeys = Object.keys(config?.locale?.regions || {});

  // Build Header
  function buildHeader() {
    const mepPopupHeader = createTag('div', { class: 'mep-popup-header' });
    const mmmSVG = `<svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.8359 20.9998H18.0635C17.8561 21.0036 17.6523 20.9458 17.478 20.8338C17.3037 20.7219 17.1669 20.5607 17.0849 20.371L11.9039 8.30626C11.8958 8.27747 11.8821 8.25055 11.8636 8.22704C11.845 8.20353 11.822 8.18389 11.7958 8.16924C11.7696 8.1546 11.7408 8.14523 11.711 8.14167C11.6812 8.13812 11.651 8.14044 11.6221 8.14852L11.617 8.15001C11.5806 8.1604 11.5475 8.17958 11.5204 8.20585C11.4934 8.23212 11.4733 8.26466 11.462 8.30055L8.23347 15.9607C8.20525 16.0273 8.20475 16.1023 8.23207 16.1692C8.25939 16.2362 8.31229 16.2896 8.37914 16.3177L8.37983 16.318C8.41348 16.3319 8.44957 16.339 8.486 16.3389H12.035C12.1425 16.3389 12.2477 16.3704 12.3373 16.4295C12.427 16.4887 12.4972 16.5728 12.5391 16.6715L14.0926 20.1157C14.1588 20.2708 14.1603 20.4457 14.097 20.602C14.0336 20.7583 13.9105 20.8831 13.7548 20.949L13.754 20.9493C13.6753 20.9826 13.5907 20.9998 13.5053 20.9998H0.58545C0.488275 20.9993 0.392732 20.9749 0.307356 20.9287C0.22198 20.8824 0.149429 20.8159 0.0961835 20.7349C0.0429379 20.6539 0.0106559 20.5611 0.00222085 20.4647C-0.00621415 20.3683 0.00946049 20.2713 0.0478448 20.1824L8.26598 0.690892C8.35033 0.483823 8.49562 0.307024 8.68274 0.183739C8.86987 0.0604533 9.09007 -0.00354744 9.31441 0.000151769H14.0543C14.2779 -0.0028459 14.4972 0.0615004 14.6834 0.184758C14.8697 0.308015 15.0142 0.484433 15.098 0.690892L23.3726 20.1824C23.4107 20.2712 23.4263 20.3681 23.4178 20.4644C23.4094 20.5606 23.3771 20.6533 23.324 20.7342C23.2709 20.8151 23.1986 20.8817 23.1134 20.928C23.0283 20.9744 22.933 20.999 22.8359 20.9998Z" fill="white"/>
      <path d="M27.6434 20.9998H32.4159C32.5129 20.999 32.6082 20.9744 32.6934 20.928C32.7785 20.8817 32.8509 20.8151 32.904 20.7342C32.9571 20.6533 32.9893 20.5606 32.9978 20.4644C33.0062 20.3681 32.9907 20.2712 32.9525 20.1824L24.6779 0.690892C24.5941 0.484433 24.4496 0.308015 24.2634 0.184758C24.0771 0.0615004 23.8579 -0.0028459 23.6343 0.000151769H18.8943C18.67 -0.00354743 18.4498 0.0604533 18.2627 0.183739C18.0756 0.307024 17.38 1.16222 17.2956 1.36928L20.4916 8.97894C20.503 8.94305 21.0733 8.23212 21.1004 8.20585C21.1274 8.17958 21.1606 8.1604 21.1969 8.15001L21.202 8.14852C21.2309 8.14044 21.2611 8.13812 21.2909 8.14167C21.3207 8.14523 21.3496 8.1546 21.3757 8.16924C21.4019 8.18389 21.4249 8.20353 21.4435 8.22704C21.462 8.25055 21.4758 8.27747 21.4839 8.30626L26.6648 20.371C26.7468 20.5607 26.8837 20.7219 27.058 20.8338C27.2322 20.9458 27.436 21.0036 27.6434 20.9998Z" fill="white"/>
      </svg>`;
    mepPopupHeader.innerHTML = `${mmmSVG}<span class="mep-close"></span>`;
    return mepPopupHeader;
  }
  const mepPopupHeader = buildHeader();

  function buildTabsAndContainers() {
    const mepPopupTabs = createTag('div', { class: 'mep-popup-tabs' });
    const tabs = ['Options', 'Summary'];
    const mepPopupBody = tabs.map((tab, index) => {
      const mepTab = createTag('div', { class: 'mep-tab' });
      if (index === 0) mepTab.setAttribute('active', '');
      mepTab.textContent = tab;
      mepPopupTabs.append(mepTab);
      const bodyDiv = createTag('div', { class: `mep-popup-body mep-${tabs[index].toLocaleLowerCase()}-body` });
      if (index === 0) bodyDiv.setAttribute('active', '');
      return bodyDiv;
    });
    return { mepPopupTabs, mepPopupBody };
  }
  const { mepPopupTabs, mepPopupBody } = buildTabsAndContainers();

  function BuildOptionsManifestList() {
    const { manifestList } = getManifestListDomAndParameter(mepConfig);
    const manifestTag = createTag('div', { class: 'mep-manifest-list' });
    manifestTag.innerHTML = `<h6>Manifests</h6>
      ${mepConfig.activities?.length ? manifestList : '<div class="mep-section">(0 manifests found.)</div>'}
    `;
    mepPopupBody[0].append(manifestTag);
  }
  BuildOptionsManifestList();

  // Visibility gates for the market spoofers. Computed once per popup-build:
  //   - lingoOk: page exposes Lingo regions, so the existing Lingo dropdown
  //     and its companion "Use M@S markets instead" checkbox make sense.
  //   - hasMas:  page has any M@S surface (collection / card / inline / OST
  //     / offer); without one, neither M@S control is useful.
  // Resulting render matrix:
  //                          Lingo dropdown    M@S checkbox    M@S dropdown
  //   Lingo + no M@S         shown             hidden          hidden
  //   Lingo + M@S            shown             shown           gated by checkbox
  //   non-Lingo + no M@S     "no Lingo" hint   hidden          hidden
  //   non-Lingo + M@S        "no Lingo" hint   hidden          shown standalone
  // Standalone variant drops the green left border (a visual link to the
  // adjacent toggle) since there's no checkbox to anchor to.
  const lingoOk = lingoActive() && regionKeys.length > 0;
  const hasMas = hasMasSurfaces();

  function buildOptionsLingoSelect() {
    if (lingoOk) {
      const regionOptions = regionKeys.map((key) => {
        const country = key.split('_')[0];
        // M@S Markets mode disables the Lingo dropdown — surfacing a "selected" option would
        // mislead since its value no longer drives akamaiLocale.
        const currentAkamaiLocale = masMarketChecked ? null : urlParams.get('akamaiLocale');
        const selected = currentAkamaiLocale === country ? ' selected' : '';
        return `<option value="${country}"${selected}>${key}</option>`;
      }).join('');

      const disabledAttr = masMarketChecked ? ' disabled' : '';
      return `
        <div class="mep-experience-dropdown">
          <label for="mepLingoRegionSelect${pageId}">Supported Lingo Geos</label>
          <select name="mepLingoRegion${pageId}" id="mepLingoRegionSelect${pageId}" class="mep-manifest-variants"${disabledAttr}>
            <option value="">-- Select Region --</option>
            ${regionOptions}
          </select>
        </div>`;
    } return '<div>(No Lingo supported geos for this page.)</div>';
  }
  const regionDropdownHTML = buildOptionsLingoSelect();

  // Sync read from cache — do NOT await getMarketConfig(). Cold cache renders the placeholder;
  // the deferred reload at the end of getMepPopup picks up live data. Returns '' on no M@S.
  function buildOptionsMasMarketSelect() {
    if (!hasMas) return '';
    const cached = config?.marketsConfig;
    const languages = cached?.languages?.data ?? cached?.data ?? [];
    const lang = languages.length
      ? marketsLangForLocale({ languages }, config?.locale)
      : null;
    const supported = lang?.supportedRegions
      ?.split(',').map((m) => m.trim().toLowerCase())
      .filter(Boolean) || [];

    // Standalone (non-Lingo + M@S): always visible, pre-selected from
    // akamaiLocale. Lingo + M@S: hidden until the companion checkbox flips.
    const standalone = !lingoOk;
    const hiddenAttr = standalone || masMarketChecked ? '' : 'hidden';
    const currentAkamaiLocale = (standalone || masMarketChecked)
      ? urlParams.get('akamaiLocale')
      : null;
    const opts = supported.map((c) => {
      const selected = currentAkamaiLocale === c ? ' selected' : '';
      return `<option value="${c}"${selected}>${c}</option>`;
    }).join('');
    // Always emit <select> (disabled when empty) — keeps shape stable; no downstream branches.
    const disabledAttr = supported.length === 0 ? ' disabled' : '';
    const placeholderOpt = supported.length === 0
      ? '<option value="">-- No M@S markets for this page --</option>'
      : '<option value="">-- Select Market --</option>';
    const standaloneClass = standalone ? ' standalone' : '';
    return `
      <div class="mep-experience-dropdown mep-mas-market-dropdown${standaloneClass}" ${hiddenAttr}>
        <label for="mepMasMarketSelect${pageId}">Supported M@S Markets</label>
        <select name="mepMasMarket${pageId}" id="mepMasMarketSelect${pageId}" class="mep-manifest-variants"${disabledAttr}>
          ${placeholderOpt}
          ${opts}
        </select>
      </div>`;
  }
  // Warm the cache for next popup open. Fire-and-forget.
  if (!config?.marketsConfig) getMarketConfig();
  const masMarketDropdownHTML = buildOptionsMasMarketSelect();
  // Checkbox only makes sense between two dropdowns — suppress on non-Lingo (M@S alone).
  const masMarketToggleHTML = (hasMas && lingoOk) ? `
    <div class="mep-mas-market-toggle">
      <input type="checkbox" name="mepMasMarket${pageId}"
        id="mepMasMarketCheckbox${pageId}" ${mepMasMarketCheckedAttr} value="true">
      <label for="mepMasMarketCheckbox${pageId}">Use M@S markets</label>
    </div>` : '';

  function buildOptionsToggles() {
    const mepToggleOptions = createTag('div', { class: 'mep-section' });

    mepToggleOptions.innerHTML = `
    <h6 class="mep-section-header">
      Toggles
    </h6>
    <div class="mep-manifest-variants">
      <div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepHighlightCheckbox${pageId}" ${mepHighlightChecked} value="true">
        <label for="mepHighlightCheckbox${pageId}">Highlight changes</label>
      </div>
      <div>
        <input type="checkbox" name="mepFragments${pageId}"
        id="mepFragmentsCheckbox${pageId}" ${mepFragmentsChecked} value="true">
        <label for="mepFragmentsCheckbox${pageId}">Highlight fragments</label>
      </div>
      <div>
        <input type="checkbox" name="mepCaasHighlight${pageId}"
        id="mepCaasHighlightCheckbox${pageId}" ${mepCaasHighlightChecked} value="true">
        <label for="mepCaasHighlightCheckbox${pageId}">Highlight CaaS</label>
      </div>
      <div>
        <input type="checkbox" name="mepMasHighlight${pageId}"
        id="mepMasHighlightCheckbox${pageId}" ${mepMasHighlightChecked} value="true">
        <label for="mepMasHighlightCheckbox${pageId}">Highlight M@S</label>
        <div class="mep-mas-no-content" hidden>No M@S content found on this page.</div>
      </div>
      <div>
        <input type="checkbox" name="mepPreviewButtonCheckbox${pageId}"
        id="mepPreviewButtonCheckbox${pageId}" value="off">
        <label for="mepPreviewButtonCheckbox${pageId}">Add mepButton=off to preview link</label>
      </div>
    </div>
    ${regionDropdownHTML}
    ${masMarketToggleHTML}
    ${masMarketDropdownHTML}
    <div>New manifest location or path*</div>
    <input type="text" name="new-manifest${pageId}" class="new-manifest">
  `;
    mepPopupBody[0].append(mepToggleOptions);
  }
  buildOptionsToggles();

  // Build Options : Footer
  function buildOptionsFooter() {
    const mepFooterHTML = `
      <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices" target="_blank" active>
        Preview
      </a>`;

    mepPopupBody[0].append(createTag('div', { class: 'mep-popup-footer' }, mepFooterHTML));
  }
  buildOptionsFooter();

  // Build Summary : Page
  function buildSummaryPage() {
    const mepTarget = page.target;

    const foundation = (getMetadata('foundation') || 'c1').toUpperCase();
    const pageData = {
      manifestsFound: mepConfig.activities?.length || 0,
      foundation,
      targetIntegration: setTargetOnText(mepTarget, page),
      personalization: page.personalization,
      locale: page.locale?.toLowerCase(),
      lastSeen: formatDate(new Date(page.lastSeen)),
    };

    const pageHTML = `
    <h6 class="mep-section-header">Page</h6>
    <div class="mep-section-data">
        <span>Manifests Found</span>
        <span>${pageData.manifestsFound}</span>
        <span>Foundation</span>
        <span>${pageData.foundation}</span>
        <span>Target Integration</span>
        <span>${pageData.targetIntegration}</span>
        <span>Personalization</span>
        <span>${pageData.personalization}</span>
    ${page.lastSeen ? `
        <span>Locale</span>
        <span>${pageData.locale}</span>`
    : ''}
    </div>
    `;

    mepPopupBody[1].append(createTag('div', { class: 'mep-section' }, pageHTML));
  }
  buildSummaryPage();

  // Build Summary : Lingo
  // MMM always takes the isMmm=true branch: shows Total instead of Mep Lingo
  // Updates, and never shows Country cookie / User Country / Geo + User (those
  // depend on the CURRENT page/session, which doesn't apply to an arbitrary
  // page being managed in MMM). getGeoUserSupport/countryCookie/userCountry/
  // updates were only used by the removed in-page (isMmm=false) branch.
  function buildSummaryLingo() {
    const regionalFragments = document.querySelectorAll('[data-mep-lingo-roc]');
    const fallbackFragments = document.querySelectorAll('[data-mep-lingo-fallback]');

    const lingoData = {
      langFirst: lingoActive() ? 'on' : 'off',
      geoFolder: page.geo || 'Us (None)',
      total: regionalFragments.length + fallbackFragments.length,
    };

    const lingoHTML = `
    <h6 class="mep-section-header">Lingo</h6>
    <div class="mep-section-data">
        <span>Total</span>
        <span>${lingoData.total}</span>
        <span>Lang First / Lingo</span>
        <span>${lingoData.langFirst}</span>
        <span>Geo Folder</span>
        <span>${lingoData.geoFolder}</span>
    </div>
  `;
    mepPopupBody[1].append(createTag('div', { class: 'mep-section' }, lingoHTML));
  }
  buildSummaryLingo();

  // M@S summary. Surfaces Detected = Collections + Cards + Inline Fields + Standalone Offers.
  // Sub-collections are a sub-row (live inside the parent collection payload, not a separate
  // DOM surface). Counts query real elements (merch-card, mas-field, MAS_OSI_SELECTOR) — the
  // [data-mas-block] stamps only land while mep.preview is on. Standalone Offers excludes
  // card-internal offers (~5x multiplier per card; per-card "View in OST" handles them).
  function buildSummaryMas() {
    const collectionContainers = document.querySelectorAll('[data-mas-block="collection"]');
    let subCollectionCount = 0;
    collectionContainers.forEach((c) => {
      subCollectionCount += mepMasSubCollections.get(c)?.length || 0;
    });
    const standaloneOfferCount = [...document.querySelectorAll(MAS_OSI_SELECTOR)]
      .filter((el) => !el.closest('merch-card')).length;
    const masCounts = {
      collection: collectionContainers.length,
      subCollection: subCollectionCount,
      card: document.querySelectorAll('merch-card').length,
      inlineField: document.querySelectorAll('mas-field').length,
      standaloneOffer: standaloneOfferCount,
    };
    const masSurfaces = masCounts.collection
      + masCounts.card
      + masCounts.inlineField
      + masCounts.standaloneOffer;
    const geoDetectionOn = isMasGeoDetectionEnabled();
    const masGeoDetectionParam = new URLSearchParams(window.location.search).get('mas-geo-detection');
    const masGeoDetectionMeta = getMetadata('mas-geo-detection');
    let geoDetectionSource = 'none';
    if (geoDetectionOn) {
      geoDetectionSource = masGeoDetectionParam ? 'URL param' : 'Metadata';
    } else if (masGeoDetectionParam || masGeoDetectionMeta) {
      geoDetectionSource = masGeoDetectionParam ? 'URL param (off)' : 'Metadata (off)';
    }

    const svc = document.head.querySelector('mas-commerce-service');
    const liveCountry = svc?.getAttribute('country');
    const localeCountry = getMiloLocaleSettings(config.locale)?.country;
    // getMiloLocaleSettings always resolves a country (defaults to 'US'), so the
    // empty-string and 'unknown' fallbacks below are defensive only.
    /* c8 ignore next */
    const pageMarket = (liveCountry || localeCountry || '').toUpperCase() || 'unknown';
    const pageMarketSource = liveCountry ? 'mas-commerce-service' : 'page locale';

    const section = createTag('div', { class: 'mep-section' });
    section.append(createTag('h6', { class: 'mep-section-header' }, 'M@S'));
    const data = createTag('div', { class: 'mep-section-data' });
    const rows = [
      ['Mas Geo Detection', geoDetectionOn ? 'on' : 'off'],
      ['Geo Source', geoDetectionSource],
      ['Page Market', pageMarket],
      ['Market Source', pageMarketSource],
      ['Surfaces Detected', masSurfaces],
      ['Collections', masCounts.collection, true],
      ['Sub-collections', masCounts.subCollection, true],
      ['Cards', masCounts.card, true],
      ['Inline Fields', masCounts.inlineField, true],
      ['Standalone Offers', masCounts.standaloneOffer, true],
    ];
    rows.forEach(([label, value, sub]) => {
      data.append(createTag('span', sub ? { class: 'mep-mas-subitem' } : null, label));
      const valueSpan = createTag('span');
      valueSpan.textContent = String(value);
      data.append(valueSpan);
    });
    section.append(data);
    mepPopupBody[1].append(section);
  }
  buildSummaryMas();

  // Inject Overlay
  function compileOverlay() {
    mepPopup.append(mepPopupHeader, mepPopupTabs, ...mepPopupBody);

    mepPopupBody.forEach((body) => {
      addDividers(body, '.mep-section');
    });

    addMepPopupListeners(mepPopup, pageId);

    const previewButton = mepPopup.querySelector(`a[data-id="${PREVIEW_BUTTON_ID}"]`);
    if (previewButton) updatePreviewButton(mepPopup, pageId);
  }
  compileOverlay();

  // Cold-cache defer-populate: if marketsConfig wasn't ready at build time, await the fetch
  // and re-render the dropdown in place. Guarded so it never clobbers user selection.
  if (!config?.marketsConfig) {
    getMarketConfig().then(() => {
      const wrapper = mepPopup.querySelector('.mep-mas-market-dropdown');
      if (!wrapper) return;
      const existingSelect = wrapper.querySelector('select');
      if (existingSelect?.value) return;
      wrapper.outerHTML = buildOptionsMasMarketSelect();
      const newSelect = mepPopup.querySelector(`select#mepMasMarketSelect${pageId}`);
      newSelect?.addEventListener('change', () => updatePreviewButton(mepPopup, pageId));
    });
  }

  return mepPopup;
}

export async function saveToMmm() {
  const data = parseMepConfig();
  if (!data) return false;
  const excludedStrings = ['/drafts/', '.stage.', '.page/', '.live/', '/fragments/', '/nala/'];
  if (excludedStrings.some((str) => data.page.url.includes(str))) return false;
  data.activities = data.activities.filter((activity) => {
    const { url, source } = activity;
    activity.source = source.filter((item) => item !== 'mep param');
    return (!!(activity.source?.length && !url.includes('/drafts/')));
  });
  data.activities = data.activities.map((activity) => {
    activity.variantNames = activity.variantNames?.join('||') || '';
    activity.source = activity.source?.join(',') || '';
    delete activity.selectedVariantName;
    return activity;
  });
  if (data.page.prefix === US_GEO) data.page.prefix = '';
  data.page.target = getMetadata('target') || 'off';
  delete data.page.highlight;
  return fetch(API_URLS.save, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const res = await response.json();
      if (response.ok) return res;
      /* c8 ignore next 1 */
      throw new Error(res.message || 'Network response failed');
    });
}
