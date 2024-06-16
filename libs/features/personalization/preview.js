import { createTag, getConfig, getMetadata, loadStyle } from '../../utils/utils.js';
import { TRACKED_MANIFEST_TYPE, getFileName } from './personalization.js';

function updatePreviewButton() {
  const selectedInputs = document.querySelectorAll(
    '.mep-popup input[type="radio"]:checked, .mep-popup input[type="text"]',
  );
  const manifestParameter = [];

  selectedInputs.forEach((selected) => {
    let { value } = selected;
    if (selected.getAttribute('id') === 'new-manifest') {
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
      value = `${selected.getAttribute('name')}--${value}`;
      manifestParameter.push(value);
    }
  });

  const simulateHref = new URL(window.location.href);
  simulateHref.searchParams.set('mep', manifestParameter.join('---'));

  const mepHighlightCheckbox = document.querySelector(
    '.mep-popup input[type="checkbox"]#mepHighlightCheckbox',
  );
  document.body.dataset.mepHighlight = mepHighlightCheckbox.checked;
  if (mepHighlightCheckbox.checked) {
    simulateHref.searchParams.set('mepHighlight', true);
  } else {
    simulateHref.searchParams.delete('mepHighlight');
  }

  const mepPreviewButtonCheckbox = document.querySelector(
    '.mep-popup input[type="checkbox"]#mepPreviewButtonCheckbox',
  );
  if (mepPreviewButtonCheckbox.checked) {
    simulateHref.searchParams.set('mepButton', 'off');
  } else {
    simulateHref.searchParams.delete('mepButton');
  }

  document
    .querySelector('.mep-popup a.con-button')
    .setAttribute('href', simulateHref.href);
}

function getRepo() {
  const [, repo] = new URL(window.location.href).hostname.split('--');
  if (repo) return repo;
  try {
    const sidekick = document.querySelector('helix-sidekick');
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
  div.querySelectorAll('.mep-popup input[type="radio"], .mep-popup input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton);
  });

  div.querySelectorAll('.mep-popup input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton);
  });

  div.querySelector('.mep-manifest.mep-badge').addEventListener('click', () => {
    div.classList.toggle('mep-hidden');
  });

  div.querySelector('.mep-close').addEventListener('click', () => {
    document.body.removeChild(document.querySelector('.mep-preview-overlay'));
  });

  div.querySelector('.mep-toggle-advanced').addEventListener('click', () => {
    document.querySelector('.mep-advanced-container').classList.toggle('mep-advanced-open');
  });

  div.querySelectorAll('a[data-manifest-path]').forEach((a) => {
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

function createPreviewPill(manifests) {
  const overlay = createTag('div', { class: 'mep-preview-overlay static-links', style: 'display: none;' });
  document.body.append(overlay);
  const div = document.createElement('div');
  div.classList.add('mep-hidden');
  let manifestList = '';
  const manifestParameter = [];
  manifests?.forEach((manifest) => {
    const {
      variantNames,
      manifestPath = manifest.manifest,
      selectedVariantName,
      name,
      manifestType,
      manifestUrl,
      manifestOverrideName,
    } = manifest;
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
        <input type="radio" name="${manifestPath}" value="${variant}" id="${manifestPath}--${variant}" ${checked.attribute}>
        <label for="${manifestPath}--${variant}" ${checked.class}>${variant}</label>
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
      <input type="radio" name="${manifestPath}" value="default" id="${manifestPath}--default" ${checked.attribute}>
      <label for="${manifestPath}--default" ${checked.class}>Default (control)</label>
    </div>`;

    const manifestFileName = getFileName(manifestPath);
    const targetTitle = name ? `${name}<br><i>${manifestFileName}</i>` : manifestFileName;
    const scheduled = manifest.event
      ? `<p>Scheduled - ${manifest.disabled ? 'inactive' : 'active'}</p>
         <p>On: ${manifest.event.start?.toLocaleString()} - <a target= "_blank" href="?instant=${manifest.event.start?.toISOString()}">instant</a></p>
         <p>Off: ${manifest.event.end?.toLocaleString()}</p>` : '';
    let analyticsTitle = '';
    if (manifestType === TRACKED_MANIFEST_TYPE) {
      analyticsTitle = 'N/A for this manifest type';
    } else if (manifestOverrideName) {
      analyticsTitle = manifestOverrideName;
    } else {
      analyticsTitle = manifestFileName.replace('.json', '').slice(0, 20);
    }
    manifestList += `<div class="mep-manifest-info" title="Full url: ${manifestUrl}&#013;Analytics manifest name: ${analyticsTitle}">
      <div class="mep-manifest-title">
        ${targetTitle}
        <i></i>
        <a class="mep-edit-manifest" data-manifest-url="${manifestUrl}" data-manifest-path="${manifestPath}" target="_blank" title="Open manifest">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="16px" height="16px" fill-rule="nonzero"><g transform=""><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M22.82813,3c-0.51175,0 -1.02356,0.19544 -1.41406,0.58594l-2.41406,2.41406l5,5l2.41406,-2.41406c0.781,-0.781 0.781,-2.04713 0,-2.82812l-2.17187,-2.17187c-0.3905,-0.3905 -0.90231,-0.58594 -1.41406,-0.58594zM17,8l-11.74023,11.74023c0,0 0.91777,-0.08223 1.25977,0.25977c0.342,0.342 0.06047,2.58 0.48047,3c0.42,0.42 2.64389,0.12436 2.96289,0.44336c0.319,0.319 0.29688,1.29688 0.29688,1.29688l11.74023,-11.74023zM4,23l-0.94336,2.67188c-0.03709,0.10544 -0.05623,0.21635 -0.05664,0.32813c0,0.55228 0.44772,1 1,1c0.11177,-0.00041 0.22268,-0.01956 0.32813,-0.05664c0.00326,-0.00128 0.00652,-0.00259 0.00977,-0.00391l0.02539,-0.00781c0.00196,-0.0013 0.00391,-0.0026 0.00586,-0.00391l2.63086,-0.92773l-1.5,-1.5z"></path></g></g></g></svg>
        </a>
        ${scheduled}
      </div>
      <div class="mep-manifest-variants">${radio}</div>
    </div>`;
  });
  const config = getConfig();
  let targetOnText = config.mep.targetEnabled ? 'on' : 'off';
  if (config.mep.targetEnabled === 'gnav') targetOnText = 'on for gnav only';
  const personalizationOn = getMetadata('personalization');
  const personalizationOnText = personalizationOn && personalizationOn !== '' ? 'on' : 'off';
  const simulateHref = new URL(window.location.href);
  simulateHref.searchParams.set('mep', manifestParameter.join('---'));

  let mepHighlightChecked = '';
  if (config.mep?.highlight) {
    mepHighlightChecked = 'checked="checked"';
    document.body.dataset.mepHighlight = true;
  }

  const PREVIEW_BUTTON_ID = 'preview-button';

  div.innerHTML = `
    <div class="mep-manifest mep-badge">
      <span class="mep-open"></span>
      <div class="mep-manifest-count">${manifests?.length || 0} Manifest(s) served</div>
    </div>
    <div class="mep-popup">
      <div class="mep-popup-header">
        <div>
          <h4>${manifests?.length || 0} Manifest(s) served</h4>
          <span class="mep-close"></span>
          <div class="mep-manifest-page-info-title">Page Info:</div>
          <div>Target integration feature is ${targetOnText}</div>
          <div>Personalization feature is ${personalizationOnText}</div>
          <div>Page's Locale is ${config.locale.ietf}</div>
        </div>
      </div>
      <div class="mep-manifest-list">
        <div class="mep-manifest-info">
          <div class="mep-manifest-variants">
            <input type="checkbox" name="mepHighlight" id="mepHighlightCheckbox" ${mepHighlightChecked} value="true"> <label for="mepHighlightCheckbox">Highlight changes</label>
          </div>
        </div>
        ${manifestList}
        <div class="mep-advanced-container">
          <div class="mep-toggle-advanced">Advanced options</div>
          <div class="mep-manifest-info mep-advanced-options">
            <div>
              Optional: new manifest location or path
            </div>
            <div class="mep-manifest-variants">
              <div>
                <input type="text" name="new-manifest" id="new-manifest">
              </div>
            </div>
          </div>
          <div class="mep-manifest-info">
            <div class="mep-manifest-variants mep-advanced-options">
              <input type="checkbox" name="mepPreviewButtonCheckbox" id="mepPreviewButtonCheckbox" value="off"> <label for="mepPreviewButtonCheckbox">add mepButton=off to preview link</label>
            </div>
          </div>
        </div>
      </div>
      <div class="dark">
        <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices">Preview</a>
      </div>
    </div>`;

  const previewButton = div.querySelector(`a[data-id="${PREVIEW_BUTTON_ID}"]`);

  if (previewButton) previewButton.href = simulateHref.href;

  overlay.append(div);
  addPillEventListeners(div);
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

export default async function decoratePreviewMode() {
  const { miloLibs, codeRoot, mep } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/features/personalization/preview.css`);
  createPreviewPill(mep?.experiments);
  if (mep?.experiments) addHighlightData(mep.experiments);
}
