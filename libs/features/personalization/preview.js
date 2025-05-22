import { createTag, getConfig, getMetadata, loadStyle } from '../../utils/utils.js';
import { US_GEO, getFileName, normalizePath } from './personalization.js';

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page`,
  pageDataByURL: `${API_DOMAIN}/get-page?url=`,
  save: `${API_DOMAIN}/save-mep-call`,
  report: `${API_DOMAIN}/get-report`,
};

function updatePreviewButton(popup, pageId) {
  const selectedInputs = popup.querySelectorAll(
    'option:checked, input[type="text"]',
  );
  const manifestParameter = [];

  selectedInputs.forEach((selected) => {
    const isHidden = selected.closest('select')?.disabled;

    if (!selected.value || isHidden) return;

    let { value } = selected;

    if (selected.classList.contains('new-manifest') && value) {
      try {
        const newManifest = new URL(value);
        value = newManifest.pathname || value;
      } catch {
        // Ignore invalid URL
      }
    } else {
      value = `${selected.dataset.manifest}--${value}`;
    }

    manifestParameter.push(value);
  });

  const isMmm = pageId.length;
  const page = isMmm ? popup.closest('[data-url]').dataset.url : window.location.href;
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

  const mepPreviewButtonCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepPreviewButtonCheckbox${pageId}`,
  );
  if (mepPreviewButtonCheckbox.checked) {
    simulateHref.searchParams.set('mepButton', 'off');
  } else {
    simulateHref.searchParams.delete('mepButton');
  }

  popup
    .querySelector('a.con-button')
    .setAttribute('href', simulateHref.href);
}
function addDividers(node, selector) {
  node.querySelectorAll(selector).forEach((section) => {
    const mepDivider = createTag('div', { class: 'mep-divider' });
    section.insertAdjacentElement('afterend', mepDivider);
  });
}
function addPillEventListeners(div) {
  div.querySelector('.mep-manifest.mep-badge').addEventListener('click', () => {
    div.classList.toggle('mep-hidden');
  });
  div.querySelector('.mep-close').addEventListener('click', () => {
    document.body.removeChild(document.querySelector('.mep-preview-overlay'));
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
  const { experiments, prefix, highlight } = mep;
  const activities = experiments.map((experiment) => {
    const {
      name, event, manifest, variantNames, selectedVariantName, disabled, analyticsTitle, source,
    } = experiment;
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
    };
  });
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: (getMetadata('personalization')) ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale.ietf,
      region: locale.region,
      highlight,
    },
    activities,
  };
}
function formatDate(dateTime, format = 'local') {
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
    manifestList += `<div class="mep-section" title="Manifest location: ${editUrl}&#013;Analytics manifest name: ${analyticsTitle || 'N/A for this manifest type'}">
      <div class="mep-manifest-info">  
          <a class="mep-edit-manifest" href="${editUrl}" target="_blank" title="Open manifest">
          ${mIdx + 1}. ${getFileName(manifestPath)}
          </a>
          ${targetActivityName ? `<div class="target-activity-name">${targetActivityName || ''}</div>` : ''}
          <div class="mep-columns">
            <div class="mep-column">
              <div class="mep-active">Active</div>
              <div>Source</div>
              ${manifest.lastSeen ? '<div>Last seen</div>' : ''}
              ${eventStart && eventEnd ? '<div>Scheduled</div>' : ''}
            
            </div>
            <div class="mep-column">
              ${!variantNames.includes(selectedVariantName) ? '<div class="mep-active">default (control)</div>' : `<div class='mep-selected-variant mep-active'>${selectedVariantName}</div>`}
              <div>${source}</div>
              ${manifest.lastSeen ? `<div>${formatDate(new Date(manifest.lastSeen))}</div>` : ''}
              ${eventStart && eventEnd ? `<div>${disabled ? 'inactive' : 'active'}</div>` : ''}
            </div>
          </div>
          ${eventStart && eventEnd ? `<div class="mep-columns">
            <div class="mep-column">
              <div>On</div>
              <div>Off</div>
            </div>
            <div class="mep-column">
              <div>${formatDate(eventStart)} <a target= "_blank" href="?instant=${formatDate(eventStart, 'iso')}">Instant</a></div>
              <div>${formatDate(eventEnd)}</div>
            </div>
          </div>
        </div>` : ''}
        <div class="mep-experience-dropdown">
          <label for="experiences">Experience</label>
          <select name="experiences" class="mep-manifest-variants">${options}</select>
        </div>
      </div>
    </div>`;
  });

  return { manifestList, manifestParameter };
}
function formatManifestText(count) {
  return count > 1 ? 'Manifests' : 'Manifest';
}
function getPillText(manifestCount) {
  return `
    <span class="mep-open"></span>
    <div class="mep-manifest-count">${manifestCount || 0} ${formatManifestText(manifestCount)} found</div>
  `;
}
let sevenDayPageData;
async function mmmToggleManifests(event, popup, pageId) {
  const mepConfig = parseMepConfig();
  const mmmManifestsElement = document.querySelector('.mep-manifest-list.mmm-list');

  if (!sevenDayPageData) {
    try {
      const pageDataUrl = `${API_URLS.pageDataByURL}${mepConfig.page.url}&lastSeen=week`;

      const response = await fetch(pageDataUrl);

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      if (data) {
        sevenDayPageData = data;
        sevenDayPageData.activities = sevenDayPageData.activities.filter(
          (activity) => !mepConfig.activities.some(
            (existingActivity) => normalizePath(existingActivity.url)
            === normalizePath(activity.url),
          ),
        ).map((activity) => {
          activity.source = 'MMM';
          return activity;
        });
        mmmManifestsElement.innerHTML = `<h6>MMM data for last 7 days</h6> ${getManifestListDomAndParameter(data).manifestList}`;
        mmmManifestsElement.querySelectorAll('select').forEach((input) => {
          input.querySelector('option[title="none"]').selected = true;
          input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
        });
        addDividers(mmmManifestsElement, '.mep-section');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching 7-day page data:', error);
    }
  }

  const pill = document.querySelector('.mep-manifest.mep-badge');
  if (event.target.checked && sevenDayPageData) {
    mmmManifestsElement.classList.add('mep-show');
    mmmManifestsElement.querySelectorAll('select').forEach((select) => {
      select.disabled = false;
    });
    pill.innerHTML = getPillText(sevenDayPageData.activities.length + mepConfig.activities.length);
  } else {
    mmmManifestsElement.classList.remove('mep-show');
    mmmManifestsElement.querySelectorAll('select').forEach((select) => {
      select.disabled = true;
    });
    pill.innerHTML = getPillText(mepConfig.activities?.length);
  }
}
function addMepPopupListeners(popup, pageId) {
  popup.querySelectorAll('select, input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton.bind(null, popup, pageId));
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('#mepManifestsCheckbox').forEach((input) => {
    input.addEventListener('change', (event) => mmmToggleManifests.bind(null, event, popup, pageId)());
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
}
function setTargetOnText(target, page) {
  if (target === undefined) return page.target;
  return target === 'postlcp' ? 'on post LCP' : target;
}
export function getMepPopup(mepConfig, isMmm = false) {
  const { page } = mepConfig;
  const pageId = page?.pageId ? `-${page.pageId}` : '';
  const { manifestList } = getManifestListDomAndParameter(mepConfig);
  let mepHighlightChecked = '';
  if (page?.highlight) {
    mepHighlightChecked = 'checked="checked"';
    document.body.dataset.mepHighlight = true;
  }
  const PREVIEW_BUTTON_ID = 'preview-button';
  const pageUrl = isMmm ? page.url : new URL(window.location.href).href;
  const mepPopup = createTag('div', {
    class: `mep-popup${isMmm ? '' : ' in-page'}`,
    'data-url': pageUrl,
  });
  const mepPopupHeader = createTag('div', { class: 'mep-popup-header' });
  const mepPageInfo = createTag('div', { class: 'mep-section' });
  const mepOptions = createTag('div', { class: 'mep-section' });
  const mepPopupBody = createTag('div', { class: 'mep-popup-body' });
  const mepManifestList = createTag('div', { class: 'mep-manifest-list' });
  const mepManifestListMMM = createTag('div', { class: 'mep-manifest-list mmm-list' });

  const config = getConfig();
  const targetMapping = {
    postlcp: 'postlcp',
    true: 'on',
    false: 'off',
  };
  const targetEnabled = targetMapping[config.mep?.targetEnabled];
  const mepTarget = isMmm ? page.target : targetEnabled;
  const targetOnText = setTargetOnText(mepTarget, page);

  mepPageInfo.innerHTML = `
    <h6 class="mep-manifest-page-info-title">Page Info</h6>
    <div class="mep-columns">
      <div class="mep-column">
        <div>Target Integration</div>
        <div>Personalization</div>
        <div>Geo Folder</div>
        <div>Locale</div>
        ${page.lastSeen ? '<div>Last Seen</div>' : ''}
      </div>
      <div class="mep-column">
        <div>${targetOnText}</div>
        <div>${page.personalization}</div>
        <div>${page.geo || 'Nothing (US)'}</div>
        <div>${page.locale?.toLowerCase()}</div>
        ${page.lastSeen ? `<div>${formatDate(new Date(page.lastSeen))}</div>` : ''}
      </div>
    </div>
    `;
  const hasProdManifests = config.env?.name === 'prod'
    ? `<div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepManifestsCheckbox" value="false">
        <label for="mepManifestsCheckbox">MMM data for last 7 days</label>
      </div>`
    : '';
  mepOptions.innerHTML = `
    <h6 class="mep-manifest-page-info-title">Options</h6>
    <div class="mep-manifest-variants">
      <div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepHighlightCheckbox${pageId}" ${mepHighlightChecked} value="true">
        <label for="mepHighlightCheckbox${pageId}">Highlight changes</label>
      </div>
      ${hasProdManifests}
      <div>
        <input type="checkbox" name="mepPreviewButtonCheckbox${pageId}"
        id="mepPreviewButtonCheckbox${pageId}" value="off">
        <label for="mepPreviewButtonCheckbox${pageId}">Add mepButton=off to preview link</label>
      </div>
    </div>
    <div>New manifest location or path*</div>
    <input type="text" name="new-manifest${pageId}" class="new-manifest">`;

  const mepPopupFooter = createTag('div', { class: `mep-popup-footer${isMmm ? '' : ' dark'}` });
  mepPopupFooter.innerHTML += `
    <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices" ${isMmm ? ' target="_blank"' : ''}>Preview</a>`;
  const mmmSVG = `<svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.8359 20.9998H18.0635C17.8561 21.0036 17.6523 20.9458 17.478 20.8338C17.3037 20.7219 17.1669 20.5607 17.0849 20.371L11.9039 8.30626C11.8958 8.27747 11.8821 8.25055 11.8636 8.22704C11.845 8.20353 11.822 8.18389 11.7958 8.16924C11.7696 8.1546 11.7408 8.14523 11.711 8.14167C11.6812 8.13812 11.651 8.14044 11.6221 8.14852L11.617 8.15001C11.5806 8.1604 11.5475 8.17958 11.5204 8.20585C11.4934 8.23212 11.4733 8.26466 11.462 8.30055L8.23347 15.9607C8.20525 16.0273 8.20475 16.1023 8.23207 16.1692C8.25939 16.2362 8.31229 16.2896 8.37914 16.3177L8.37983 16.318C8.41348 16.3319 8.44957 16.339 8.486 16.3389H12.035C12.1425 16.3389 12.2477 16.3704 12.3373 16.4295C12.427 16.4887 12.4972 16.5728 12.5391 16.6715L14.0926 20.1157C14.1588 20.2708 14.1603 20.4457 14.097 20.602C14.0336 20.7583 13.9105 20.8831 13.7548 20.949L13.754 20.9493C13.6753 20.9826 13.5907 20.9998 13.5053 20.9998H0.58545C0.488275 20.9993 0.392732 20.9749 0.307356 20.9287C0.22198 20.8824 0.149429 20.8159 0.0961835 20.7349C0.0429379 20.6539 0.0106559 20.5611 0.00222085 20.4647C-0.00621415 20.3683 0.00946049 20.2713 0.0478448 20.1824L8.26598 0.690892C8.35033 0.483823 8.49562 0.307024 8.68274 0.183739C8.86987 0.0604533 9.09007 -0.00354744 9.31441 0.000151769H14.0543C14.2779 -0.0028459 14.4972 0.0615004 14.6834 0.184758C14.8697 0.308015 15.0142 0.484433 15.098 0.690892L23.3726 20.1824C23.4107 20.2712 23.4263 20.3681 23.4178 20.4644C23.4094 20.5606 23.3771 20.6533 23.324 20.7342C23.2709 20.8151 23.1986 20.8817 23.1134 20.928C23.0283 20.9744 22.933 20.999 22.8359 20.9998Z" fill="white"/>
    <path d="M27.6434 20.9998H32.4159C32.5129 20.999 32.6082 20.9744 32.6934 20.928C32.7785 20.8817 32.8509 20.8151 32.904 20.7342C32.9571 20.6533 32.9893 20.5606 32.9978 20.4644C33.0062 20.3681 32.9907 20.2712 32.9525 20.1824L24.6779 0.690892C24.5941 0.484433 24.4496 0.308015 24.2634 0.184758C24.0771 0.0615004 23.8579 -0.0028459 23.6343 0.000151769H18.8943C18.67 -0.00354743 18.4498 0.0604533 18.2627 0.183739C18.0756 0.307024 17.38 1.16222 17.2956 1.36928L20.4916 8.97894C20.503 8.94305 21.0733 8.23212 21.1004 8.20585C21.1274 8.17958 21.1606 8.1604 21.1969 8.15001L21.202 8.14852C21.2309 8.14044 21.2611 8.13812 21.2909 8.14167C21.3207 8.14523 21.3496 8.1546 21.3757 8.16924C21.4019 8.18389 21.4249 8.20353 21.4435 8.22704C21.462 8.25055 21.4758 8.27747 21.4839 8.30626L26.6648 20.371C26.7468 20.5607 26.8837 20.7219 27.058 20.8338C27.2322 20.9458 27.436 21.0036 27.6434 20.9998Z" fill="white"/>
    </svg>`;
  const mmmLink = !isMmm ? `<a href="https://main--milo--adobecom.aem.page/docs/authoring/features/mmm" title="Open Mep Manifest Manager" target="_blank" >${mmmSVG}</a>` : mmmSVG;
  mepPopupHeader.innerHTML = `
    ${mmmLink}
    <span class="mep-close"></span>`;
  mepManifestList.innerHTML = `<h6>Page Manifests</h6>${manifestList}`;

  if (mepPageInfo) mepPopupBody.append(mepPageInfo);
  if (mepManifestList) mepPopupBody.append(mepManifestList);
  if (mepManifestListMMM && config.env?.name === 'prod') mepPopupBody.append(mepManifestListMMM);
  if (mepOptions) mepPopupBody.append(mepOptions);

  mepPopup.append(mepPopupHeader);
  mepPopup.append(mepPopupBody);
  mepPopup.append(mepPopupFooter);

  addDividers(mepPopup, '.mep-popup-body > .mep-section:not(:last-child), .mep-manifest-list > .mep-section');

  const previewButton = mepPopup.querySelector(`a[data-id="${PREVIEW_BUTTON_ID}"]`);
  if (previewButton) updatePreviewButton(mepPopup, pageId);
  addMepPopupListeners(mepPopup, pageId);
  return mepPopup;
}

function createPreviewPill() {
  const mepConfig = parseMepConfig();
  const { activities } = mepConfig;
  const overlay = createTag('div', { class: 'mep-preview-overlay static-links', style: 'display: none;' });
  const pill = document.createElement('div');
  pill.classList.add('mep-hidden');
  const mepBadge = createTag('div', { class: 'mep-manifest mep-badge' });
  mepBadge.innerHTML = getPillText(activities?.length);
  pill.append(mepBadge);
  pill.append(getMepPopup(mepConfig));
  overlay.append(pill);
  document.body.append(overlay);
  addPillEventListeners(pill);
}
function addHighlightData(manifests) {
  manifests.forEach(({ selectedVariant, manifest }) => {
    const manifestName = getFileName(manifest);

    const updateManifestId = (selector, prop = 'manifestId') => {
      document.querySelectorAll(selector).forEach((el) => (el.dataset[prop] = manifestName));
    };

    selectedVariant?.replacefragment?.forEach(
      ({ val }) => updateManifestId(`[data-path*="${val}"]`),
    );

    selectedVariant?.useblockcode?.forEach(({ selector }) => {
      if (selector) updateManifestId(`.${selector}`, 'codeManifestId');
    });

    selectedVariant?.updatemetadata?.forEach(({ selector }) => {
      if (selector === 'gnav-source') updateManifestId('header, footer');
    });

    // eslint-disable-next-line max-len
    document.querySelectorAll(`.section[class*="merch-cards"] .fragment[data-manifest-id="${manifestName}"] merch-card`)
      .forEach((el) => (el.dataset.manifestId = manifestName));
  });
}
export async function saveToMmm() {
  const data = parseMepConfig();
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
export default async function decoratePreviewMode() {
  const { miloLibs, codeRoot, mep } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/features/personalization/preview.css`);
  createPreviewPill();
  if (mep?.experiments) addHighlightData(mep.experiments);
}
