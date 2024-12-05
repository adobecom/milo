import { createTag, getConfig, getMetadata, loadStyle } from '../../utils/utils.js';
import { TRACKED_MANIFEST_TYPE, getFileName } from './personalization.js';

function updatePreviewButton(popup, pageId) {
  const selectedInputs = popup.querySelectorAll(
    'input[type="radio"]:checked, input[type="text"]',
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
      value = `${selected.getAttribute('name').replace(/\.json-\d+/, '.json')}--${value}`;
      manifestParameter.push(value);
    }
  });

  const isMmm = !!pageId;
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

function getRepo() {
  const [, repo] = new URL(window.location.href).hostname.split('--');
  if (repo) return repo;
  try {
    const sidekick = document.querySelector('aem-sidekick, helix-sidekick');
    if (sidekick) {
      const [, sidekickRepo] = new URL(JSON.parse(sidekick.getAttribute('status'))?.live.url).hostname.split('--');
      return sidekickRepo;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error getting repo from sidekick', e);
  }
  return false;
}

async function getEditManifestUrl(a, w) {
  const repo = getRepo();
  if (!repo) {
    w.location = a.dataset.manifestPath;
    return false;
  }

  // TODO: fix editUrl issue to handle this
  // console.log('a.dataset.manifestPath', a.dataset.manifestPath);
  // console.log(`https://admin.hlx.page/status/adobecom/${repo}/main${a.dataset.manifestPath}?editUrl=auto`);
  const response = await fetch(`https://admin.hlx.page/status/adobecom/${repo}/main${a.dataset.manifestPath}?editUrl=auto`);
  const body = await response.json();
  const editUrl = body?.edit?.url;
  if (editUrl) {
    w.location = editUrl;
    a.href = editUrl;
    return true;
  }
  w.location = a.dataset.manifestUrl;
  return false;
}

function addPillEventListeners(div) {
  div.querySelector('.mep-manifest.mep-badge').addEventListener('click', () => {
    div.classList.toggle('mep-hidden');
  });
  div.querySelector('.mep-close').addEventListener('click', () => {
    document.body.removeChild(document.querySelector('.mep-preview-overlay'));
  });
}

function parseMepConfig() {
  const config = getConfig();
  const { mep, locale, stageDomainsMap } = config;
  const { experiments, targetEnabled, geoPrefix } = mep;
  const activities = experiments.map((experiment) => {
    const {
      name, variantNames, event, disabled, manifest, source, selectedVariantName,
      manifestType, manifestOverrideName, region,
    } = experiment;
    // const manifestUrl = new URL(manifest);
    return {
      name,
      variantNames,
      selectedVariantName,
      url: manifest,
      event,
      disabled,
      manifest,
      manifestType,
      manifestOverrideName,
      // url: manifestUrl.href,
      // pathname: manifestUrl.pathname,
      source,
    };
  });
  const { pathname, origin } = window.location;
  let url = `www.adobe.com${pathname}`;
  if (origin.includes('.adobe.com')) url = `${origin.replace('.stage.', '')}${pathname}`;
  if (origin.includes('--adobecom.hlx.') && stageDomainsMap) {
    const domain = Object.keys(stageDomainsMap).find((key) => key.includes('.adobe.com'));
    if (domain) url = `${domain}${pathname}`;
  }
  return {
    page: {
      url: `https://${url}`,
      pathname,
      target: targetEnabled ? 'on' : 'off',
      personalization: (getMetadata('personalization')) ? 'on' : 'off',
      prefix: geoPrefix === 'en-us' ? '' : geoPrefix,
      locale: locale.ietf,
      region: locale.region,
    },
    activities,
  };
}

function getManifestListDomAndParameter(manifests, pageId) {
  let manifestList = '';
  const manifestParameter = [];
  manifests?.forEach((manifest) => {
    const {
      variantNames,
      manifestPath = manifest.url,
      selectedVariantName,
      manifestType,
      manifestUrl,
      manifestOverrideName,
      name,
    } = manifest;
    const editUrl = manifestUrl || manifestPath;
    // MUST FIX:
    // editUrl BREAKS mep manifest link pencil on normal pages -- it's expecting a relative path
    let radio = '';
    variantNames.forEach((variant) => {
      const checked = {
        attribute: '',
        class: '',
      };
      if (variant === selectedVariantName) {
        checked.attribute = 'checked="checked"';
        checked.class = 'class="mep-manifest-selected-variant"';
        manifestParameter.push(`${manifestPath}--${variant}`);
      }
      radio += `<div>
        <input type="radio" name="${manifestPath}${pageId}" value="${variant}" id="${manifestPath}${pageId}--${variant}" ${checked.attribute}>
        <label for="${manifestPath}${pageId}--${variant}" ${checked.class}>${variant}</label>
      </div>`;
    });
    const checked = {
      attribute: '',
      class: '',
    };
    if (!variantNames.includes(selectedVariantName)) {
      checked.attribute = 'checked="checked"';
      checked.class = 'class="mep-manifest-selected-variant"';
      manifestParameter.push(`${manifestPath}--default`);
    }
    radio += `<div>
      <input type="radio" name="${manifestPath}${pageId}" value="default" id="${manifestPath}${pageId}--default" ${checked.attribute}>
      <label for="${manifestPath}${pageId}--default" ${checked.class}>Default (control)</label>
    </div>`;

    const manifestFileName = getFileName(manifestPath);
    const targetTitle = name ? `${name}<br><i>${manifestFileName}</i>` : manifestFileName;
    if (manifest.eventStart) {
      manifest.event = {
        start: new Date(manifest.eventStart),
        end: new Date(manifest.eventEnd),
      };
    }
    const scheduled = manifest.event
      ? `<p>Scheduled - ${manifest.disabled ? 'inactive' : 'active'}</p>
         <p>On: ${manifest.event.start?.toLocaleString()} - <a target= "_blank" href="?instant=${manifest.event.start?.toISOString()}">instant</a></p>
         <p>Off: ${manifest.event.end?.toLocaleString()}</p>` : '';
    let analyticsTitle = '';
    if (manifestType !== TRACKED_MANIFEST_TYPE) {
      analyticsTitle = 'N/A for this manifest type';
    } else if (manifestOverrideName) {
      analyticsTitle = manifestOverrideName;
    } else {
      analyticsTitle = manifestFileName.replace('.json', '').slice(0, 20);
    }
    manifestList += `<div class="mep-manifest-info" title="Manifest location: ${editUrl}&#013;Analytics manifest name: ${analyticsTitle}">
      <div class="mep-manifest-title">
        ${targetTitle}
        <i></i>
        <a class="mep-edit-manifest" data-manifest-url="${editUrl}" data-manifest-path="${editUrl}" target="_blank" title="Open manifest">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="16px" height="16px" fill-rule="nonzero"><g transform=""><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M22.82813,3c-0.51175,0 -1.02356,0.19544 -1.41406,0.58594l-2.41406,2.41406l5,5l2.41406,-2.41406c0.781,-0.781 0.781,-2.04713 0,-2.82812l-2.17187,-2.17187c-0.3905,-0.3905 -0.90231,-0.58594 -1.41406,-0.58594zM17,8l-11.74023,11.74023c0,0 0.91777,-0.08223 1.25977,0.25977c0.342,0.342 0.06047,2.58 0.48047,3c0.42,0.42 2.64389,0.12436 2.96289,0.44336c0.319,0.319 0.29688,1.29688 0.29688,1.29688l11.74023,-11.74023zM4,23l-0.94336,2.67188c-0.03709,0.10544 -0.05623,0.21635 -0.05664,0.32813c0,0.55228 0.44772,1 1,1c0.11177,-0.00041 0.22268,-0.01956 0.32813,-0.05664c0.00326,-0.00128 0.00652,-0.00259 0.00977,-0.00391l0.02539,-0.00781c0.00196,-0.0013 0.00391,-0.0026 0.00586,-0.00391l2.63086,-0.92773l-1.5,-1.5z"></path></g></g></g></svg>
        </a>
        ${manifest.lastSeen ? `<div>Last seen: ${new Date(manifest.lastSeen).toLocaleString()}</div>` : ''}
        ${scheduled}
      </div>
      <div class="mep-manifest-variants">${radio}</div>
    </div>`;
  });
  return { manifestList, manifestParameter };
}
function addMepPopupListeners(popup, pageId) {
  popup.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelector('.mep-toggle-advanced').addEventListener('click', (e) => {
    e.target.closest('.mep-popup')?.querySelector('.mep-advanced-container')?.classList.toggle('mep-advanced-open');
  });
  popup.querySelectorAll('a[data-manifest-path]').forEach((a) => {
    a.addEventListener('click', () => {
      if (a.getAttribute('href')) return false;
      const w = window.open('', '_blank');
      w.document.write(`<html><head></head><body>
          Please wait while we redirect you. 
          If you are not redirected, please check that you are signed into the AEM sidekick
          and try again.
          </body></html>`);
      w.document.close();
      w.focus();
      getEditManifestUrl(a, w);
      return true;
    });
  });
}

export function getMepPopup(manifests, pageInfo = false, isMmm = false) {
  const pageId = pageInfo?.pageId ? `-${pageInfo.pageId}` : '';
  const { manifestList } = getManifestListDomAndParameter(manifests, pageId);
  let mepHighlightChecked = '';
  if (!isMmm && pageInfo?.highlight) {
    mepHighlightChecked = 'checked="checked"';
    document.body.dataset.mepHighlight = true;
  }
  const PREVIEW_BUTTON_ID = 'preview-button';
  const pageUrl = isMmm ? pageInfo.url : new URL(window.location.href).href;
  const mepPopup = createTag('div', {
    class: `mep-popup${isMmm ? '' : ' in-page'}`,
    'data-url': pageUrl,
  });
  const mepPopupHeader = createTag('div', { class: 'mep-popup-header' });
  const listInfo = createTag('div', { class: 'mep-manifest-info' });
  const advancedOptions = createTag('div', { class: 'mep-advanced-container' });
  const mepManifestList = createTag('div', { class: 'mep-manifest-list' });

  listInfo.innerHTML = `
    <div class="mep-manifest-variants">
      <input type="checkbox" name="mepHighlight${pageId}" id="mepHighlightCheckbox${pageId}" ${mepHighlightChecked} value="true"> <label for="mepHighlightCheckbox${pageId}">Highlight changes</label>
    </div>`;
  advancedOptions.innerHTML = `
    <div class="mep-toggle-advanced">Advanced options</div>
      <div class="mep-manifest-info mep-advanced-options">
        <div>Optional: new manifest location or path</div>
            <div class="mep-manifest-variants">
              <div>
                <input type="text" name="new-manifest${pageId}" class="new-manifest">
              </div>
            </div>
          </div>
          <div class="mep-manifest-info">
            <div class="mep-manifest-variants mep-advanced-options">
              <input type="checkbox" name="mepPreviewButtonCheckbox${pageId}" id="mepPreviewButtonCheckbox${pageId}" value="off"> <label for="mepPreviewButtonCheckbox${pageId}">add mepButton=off to preview link</label>
            </div>
          </div>
        </div>`;

  const mepManifestPreviewButton = createTag('div', { class: `advanced-options${isMmm ? '' : ' dark'}` });
  mepManifestPreviewButton.innerHTML = `
    <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices" ${isMmm ? ' target="_blank"' : ''}>Preview</a>`;
  mepPopupHeader.innerHTML = `
    <div>
      <h4>${manifests?.length || 0} Manifest(s) served</h4>
        <span class="mep-close"></span>
        <div class="mep-manifest-page-info-title">Page Info:</div>
        <div>Target integration feature is ${pageInfo.target}</div>
        <div>Personalization feature is ${pageInfo.personalization}</div>
        <div>Page's Prefix/Region/Locale are ${pageInfo.prefix} / ${pageInfo.region} / ${pageInfo.locale}</div>
        ${pageInfo.lastSeen ? `<div>Last seen: ${new Date(pageInfo.lastSeen).toLocaleString()}</div>` : ''}
    </div>`;
  mepManifestList.innerHTML = manifestList;
  if (listInfo) mepManifestList.prepend(listInfo);
  if (advancedOptions) mepManifestList.append(advancedOptions);
  mepPopup.append(mepPopupHeader);
  mepPopup.append(mepManifestList);
  mepPopup.append(mepManifestPreviewButton);
  const previewButton = mepPopup.querySelector(`a[data-id="${PREVIEW_BUTTON_ID}"]`);
  if (previewButton) updatePreviewButton(mepPopup, pageId);
  addMepPopupListeners(mepPopup, pageId);
  return mepPopup;
}

function createPreviewPill(manifests) {
  const overlay = createTag('div', { class: 'mep-preview-overlay static-links', style: 'display: none;' });
  const pill = document.createElement('div');
  pill.classList.add('mep-hidden');
  const mepBadge = createTag('div', { class: 'mep-manifest mep-badge' });
  mepBadge.innerHTML = `
   <span class="mep-open"></span>
      <div class="mep-manifest-count">${manifests?.length || 0} Manifest(s) served</div>`;
  pill.append(mepBadge);
  const config = getConfig();
  let targetOnText = config.mep.targetEnabled ? 'on' : 'off';
  if (config.mep.targetEnabled === 'postlcp') targetOnText = 'on post LCP';
  const personalizationOn = getMetadata('personalization');
  const personalizationOnText = personalizationOn && personalizationOn !== '' ? 'on' : 'off';
  const pageInfo = {
    target: targetOnText,
    personalization: personalizationOnText,
    highlight: config.mep.highlight,
    prefix: config.mep.geoPrefix,
    region: config.locale.region,
    locale: config.locale.ietf,
  };
  pill.append(getMepPopup(manifests, pageInfo));
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

async function saveToMmm(data) {
  if (data.page.url.includes('/drafts/')) return false;
  const { page, activities } = data;
  activities.filter((activity) => {
    const { url, source } = activity;
    return (source?.length && !url.includes('/drafts/'));
  });
  if (!activities.length) return false;
  activities.map((activity) => {
    activity.eventStart = activity.event?.startUtc ? activity.event?.startUtc : null;
    activity.eventEnd = activity.event?.endUtc ? activity.event?.endUtc : null;
    delete activity.selectedVariantName;
    delete activity.event;
    delete activity.disabled;
    activity.variantNames = activity.variantNames?.join('||') || '';
    activity.source = activity.source?.join(',') || '';
    const manifestUrl = new URL(activity.url);
    activity.pathname = manifestUrl.pathname;
    return activity;
  });
  page.url = page.url.replace('stage.adobe.com', 'adobe.com').replace('/homepage/index-loggedout', '/');
  page.pathname = page.pathname.replace('/homepage/index-loggedout', '/');
  if (page.url.includes('adobe.com')
    && !page.url.endsWith('/')
    && !page.url.includes('milo.adobe.com')) {
    page.url += '.html';
  }
  return fetch('https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws/save-mep-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer legit',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}
export default async function decoratePreviewMode() {
  const mepConfig = parseMepConfig();
  const { miloLibs, codeRoot, mep } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/features/personalization/preview.css`);

  createPreviewPill(mepConfig.activities);
  if (mep?.experiments) addHighlightData(mep.experiments);
  saveToMmm(mepConfig);
}
