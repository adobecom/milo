import { createTag, getConfig, getMetadata, loadStyle } from '../../utils/utils.js';
import { US_GEO, getFileName, normalizePath } from './personalization.js';

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page?id=`,
  save: `${API_DOMAIN}/save-mep-call`,
};

function updatePreviewButton(popup, pageId) {
  const selectedInputs = popup.querySelectorAll(
    'option:checked, input[type="text"]',
  );
  const manifestParameter = [];

  selectedInputs.forEach((selected) => {
    let { value } = selected;
    if (selected.classList.contains('new-manifest')) {
      if (selected.value !== '') {
        try {
          const newManifest = new URL(value);
          if (newManifest) {
            value = newManifest.pathname;
          }
        } catch (e) {
          // do nothing
        }
        manifestParameter.push(value);
      }
    } else {
      value = `${selected.dataset.manifest}--${value}`;
      manifestParameter.push(value);
    }
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
  const { experiments, targetEnabled, prefix, highlight } = mep;
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
      target: targetEnabled ? 'on' : 'off',
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
  const { pageId = 1 } = page;
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
    let options = '';
    const variantNamesArray = typeof variantNames === 'string' ? variantNames.split('||') : variantNames;
    variantNamesArray.forEach((variant) => {
      const checked = {
        attribute: '',
        // class: '',
        isCurrent: '',
      };
      if (variant === selectedVariantName) {
        checked.attribute = 'selected';
        checked.isCurrent = '*';
        // checked.class = 'class="mep-manifest-selected-variant"';
        manifestParameter.push(`${manifestPath}--${variant}`);
      }
      options += `<option name="${editPath}${pageId}" value="${variant}" 
      id="${editPath}${pageId}--${variant}" data-manifest="${editPath}" ${checked.attribute}>
      <label for="${editPath}${pageId}--${variant}" ${checked.class}>${variant}${checked.isCurrent}</option>`;
    });
    const checked = {
      attribute: '',
      class: '',
      isCurrent: '',
    };
    if (!variantNames.includes(selectedVariantName)) {
      checked.attribute = 'selected';
      checked.isCurrent = '*';
      // checked.class = 'class="mep-manifest-selected-variant"';
      manifestParameter.push(`${editUrl}--default`);
    }
    options += `<option name="${editPath}${pageId}" value="default" 
    id="${editPath}${pageId}--default" data-manifest="${editPath}" ${checked.attribute}>
    <label for="${editPath}${pageId}--default" ${checked.class}>Default (control)${checked.isCurrent}</option>`;
    manifestList += `<div class="mep-manifest-section" title="Manifest location: ${editUrl}&#013;Analytics manifest name: ${analyticsTitle || 'N/A for this manifest type'}">
      <div class="mep-manifest-title">  
          <a class="mep-edit-manifest" href="${editUrl}" target="_blank" title="Open manifest">
          ${mIdx + 1}. ${getFileName(manifestPath)}
          </a>
          ${targetActivityName ? `<div class="target-activity-name">${targetActivityName || ''}</div>` : ''}
          <div class="mep-columns">
            <div class="mep-column">
              <div>Source</div>
              ${manifest.lastSeen ? '<div>Last seen</div>' : ''}
              ${eventStart && eventEnd ? '<div>Scheduled</div>' : ''}
            
            </div>
            <div class="mep-column">
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
        <label for="experiences">Experience</label>
        <select name="experiences" class="mep-manifest-variants">${options}</select>
      </div>
    </div>`;
  });
  return { manifestList, manifestParameter };
}
function addMepPopupListeners(popup, pageId) {
  popup.querySelectorAll('select, input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton.bind(null, popup, pageId));
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
}
function formatManifestText(count) {
  return count > 1 ? 'Manifests' : 'Manifest';
}
export function getMepPopup(mepConfig, isMmm = false) {
  const { activities, page } = mepConfig;
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
  const listInfo = createTag('div', { class: 'mep-manifest-section' });
  const advancedOptions = createTag('div', { class: 'mep-manifest-section' });
  const mepManifestList = createTag('div', { class: 'mep-manifest-list' });

  const targetOnText = page.target === 'postlcp' ? 'on post LCP' : page.target;
  listInfo.innerHTML = `
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
        <div class="mep-uppercase">${targetOnText}</div>
        <div class="mep-uppercase">${page.personalization}</div>
        <div>${page.geo || 'Nothing (US)'}</div>
        <div>${page.locale?.toLowerCase()}</div>
        ${page.lastSeen ? `<div>${formatDate(new Date(page.lastSeen))}</div>` : ''}
      </div>
    </div>
    `;
  advancedOptions.innerHTML = `
    <h6 class="mep-manifest-page-info-title">Options</h6>
    <div class="mep-manifest-variants">
      <div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepHighlightCheckbox${pageId}" ${mepHighlightChecked} value="true">
        <label for="mepHighlightCheckbox${pageId}">Highlight changes</label>
      </div>
      <div>
        <input type="checkbox" name="mepPreviewButtonCheckbox${pageId}"
        id="mepPreviewButtonCheckbox${pageId}" value="off">
        <label for="mepPreviewButtonCheckbox${pageId}">Add mepButton=off to preview link</label>
      </div>
    </div>
    <div>New manifest location or path*</div>
    <input type="text" name="new-manifest${pageId}" class="new-manifest">`;

  const mepManifestPreviewButton = createTag('div', { class: `mep-manifest-footer${isMmm ? '' : ' dark'}` });
  mepManifestPreviewButton.innerHTML = `
    <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices" ${isMmm ? ' target="_blank"' : ''}>Preview</a>`;

  mepPopupHeader.innerHTML = `
      <h4>${activities?.length || 0} ${formatManifestText(activities?.length)}</h4>
      <span class="mep-close"></span>`;
  mepManifestList.innerHTML = manifestList;
  if (listInfo) mepManifestList.prepend(listInfo);
  if (advancedOptions) mepManifestList.append(advancedOptions);

  mepPopup.append(mepPopupHeader);
  mepPopup.append(mepManifestList);
  mepPopup.append(mepManifestPreviewButton);

  mepManifestList.querySelectorAll('.mep-manifest-section:not(:last-child)').forEach((section) => {
    const mepDivider = createTag('div', { class: 'mep-divider' });
    section.insertAdjacentElement('afterend', mepDivider);
  });

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
  mepBadge.innerHTML = `
   <span class="mep-open"></span>
      <div class="mep-manifest-count">${activities?.length || 0} ${formatManifestText(activities?.length)} found</div>`;
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
