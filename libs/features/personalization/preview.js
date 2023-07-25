/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

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
  simulateHref.searchParams.set('mep', manifestParameter.join(','));

  const mepMarkerCheckbox = document.querySelector(
    '.mep-popup input[type="checkbox"]#mepMarkerCheckbox',
  );
  document.body.dataset.mepMarker = mepMarkerCheckbox.checked;
  if (mepMarkerCheckbox.checked) {
    simulateHref.searchParams.set('mepMarker', true);
  } else {
    simulateHref.searchParams.delete('mepMarker');
  }

  const mepPreviewButtonCheckbox = document.querySelector(
    '.mep-popup input[type="checkbox"]#mepPreviewButtonCheckbox',
  );
  if (mepPreviewButtonCheckbox.checked) {
    simulateHref.searchParams.set('mepButton', 'off');
  } else {
    simulateHref.searchParams.delete('mepMarker');
  }

  document
    .querySelector('.mep-popup a.con-button')
    .setAttribute('href', simulateHref.href);
}

async function createPreviewPill(manifests, overlay, utils) {
  // eslint-disable-next-line no-undef
  const div = document.createElement('div');
  div.classList.add('mep-hidden');
  let manifestList = '';
  const manifestParameter = [];
  manifests.forEach((manifest) => {
    const { variantNames } = manifest;
    let radio = '';
    variantNames.forEach((variant) => {
      const checked = {
        attribute: '',
        class: '',
      };
      if (variant === manifest.selVarName) {
        checked.attribute = 'checked="checked"';
        checked.class = 'class="mep-manifest-selected-variant"';
        manifestParameter.push(`${manifest.manifest}--${variant}`);
      }
      radio += `<div>
        <input type="radio" name="${manifest.manifest}" value="${variant}" id="${manifest.manifest}--${variant}" ${checked.attribute}>
        <label for="${manifest.manifest}--${variant}" ${checked.class}>${variant}</label>
      </div>`;
    });
    const checked = {
      attribute: '',
      class: '',
    };
    if (!manifest.variantNames.includes(manifest.selVarName)) {
      checked.attribute = 'checked="checked"';
      checked.class = 'class="mep-manifest-selected-variant"';
      manifestParameter.push(`${manifest.manifest}--NoChanges`);
    }
    radio += `<div>
      <input type="radio" name="${manifest.manifest}" value="no changes" id="${manifest.manifest}--no changes" ${checked.attribute}>
      <label for="${manifest.manifest}--no changes" ${checked.class}>No changes (control)</label>
    </div>`;
    const targetTitle = manifest.name ? `${manifest.name}<br><i>${manifest.manifest}</i>` : manifest.manifest;
    manifestList += `<div class="mep-manifest-info">
      <div class="mep-manifest-title">
        ${targetTitle}
        <a class="mep-edit-manifest" href="${manifest.manifest}" target="_blank" title="Open manifest">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="16px" height="16px" fill-rule="nonzero"><g transform=""><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M22.82813,3c-0.51175,0 -1.02356,0.19544 -1.41406,0.58594l-2.41406,2.41406l5,5l2.41406,-2.41406c0.781,-0.781 0.781,-2.04713 0,-2.82812l-2.17187,-2.17187c-0.3905,-0.3905 -0.90231,-0.58594 -1.41406,-0.58594zM17,8l-11.74023,11.74023c0,0 0.91777,-0.08223 1.25977,0.25977c0.342,0.342 0.06047,2.58 0.48047,3c0.42,0.42 2.64389,0.12436 2.96289,0.44336c0.319,0.319 0.29688,1.29688 0.29688,1.29688l11.74023,-11.74023zM4,23l-0.94336,2.67188c-0.03709,0.10544 -0.05623,0.21635 -0.05664,0.32813c0,0.55228 0.44772,1 1,1c0.11177,-0.00041 0.22268,-0.01956 0.32813,-0.05664c0.00326,-0.00128 0.00652,-0.00259 0.00977,-0.00391l0.02539,-0.00781c0.00196,-0.0013 0.00391,-0.0026 0.00586,-0.00391l2.63086,-0.92773l-1.5,-1.5z"></path></g></g></g></svg>
        </a>
      </div>
      <div class="mep-manifest-variants">${radio}</div>
    </div>`;
  });
  const targetOnText = utils.getMetadata('target') === 'on' ? 'on' : 'off';
  const personalizationOn = utils.getMetadata('personalization');
  const personalizationOnText = personalizationOn && personalizationOn !== '' ? 'on' : 'off';
  const simulateHref = new URL(window.location.href);
  simulateHref.searchParams.set('manifest', manifestParameter.join(','));

  const config = utils.getConfig();
  let mepMarkerChecked = '';
  if (config.mep.marker) {
    mepMarkerChecked = 'checked="checked"';
    document.body.dataset.mepMarker = true;
  }

  div.innerHTML = `
    <div class="mep-manifest mep-badge">
      <div class="mep-manifest-count">${manifests.length} Manifest(s) served</div>
      <span class="mep-open"></span>
    </div>
    <div class="mep-popup">
    <div class="mep-popup-header">
      <div>
        <h4>${manifests.length} Manifest(s) served</h4>
        <span class="mep-close"></span>
        <div>Target integration feature is ${targetOnText}</div>
        <div>Personalization feature is ${personalizationOnText}</div>
      </div>
    </div>
    <div class="mep-manifest-list">
      <div class="mep-manifest-info">
        <div class="mep-manifest-variants">
          <input type="checkbox" name="mepMarker" id="mepMarkerCheckbox" ${mepMarkerChecked} value="true"> <label for="mepMarkerCheckbox">Highlight changes</label>
        </div>
      </div>
      ${manifestList}
      <div class="mep-manifest-info">
        <div>
          Optional: new manifest location or path
        </div>
        <div class="mep-manifest-variants">
          <div>
            <input type="text" name="new-manifest" id="new-manifest">
          </div>
        </div>
      </div>
    </div>
    <div class="mep-manifest-info">
      <div class="mep-manifest-variants">
        <input type="checkbox" name="mepPreviewButtonCheckbox" id="mepPreviewButtonCheckbox" value="off"> <label for="mepPreviewButtonCheckbox">No preview button</label>
      </div>
    </div>
    <div class="dark">
      <a class="con-button outline button-l" href="${simulateHref.href}" title="Preview above choices">Preview</a>
    </div>
`;

  const radioInputs = div.querySelectorAll('.mep-popup input[type="radio"]');
  radioInputs.forEach((input) => {
    input.addEventListener('change', () => {
      updatePreviewButton();
    });
  });

  const checkbox = div.querySelectorAll('.mep-popup input[type="checkbox"]');
  checkbox.forEach((input) => {
    input.addEventListener('change', () => {
      updatePreviewButton();
    });
  });

  const textInput = div.querySelectorAll('.mep-popup input[type="text"]');
  textInput.forEach((input) => {
    input.addEventListener('keyup', () => {
      updatePreviewButton();
    });
  });

  const toggle = div.querySelector('.mep-manifest.mep-badge');
  toggle.addEventListener('click', () => {
    div.classList.toggle('mep-hidden');
  });

  const close = div.querySelector('.mep-close');
  close.addEventListener('click', () => {
    document.body.removeChild(document.querySelector('.mep-preview-overlay'));
  });
  overlay.append(div);
}

function addMarkerData(manifests) {
  manifests.forEach((manifest) => {
    manifest.selectedVariant.useblockcode?.forEach((item) => {
      document.querySelectorAll(`.${item.selector}`).forEach((el) => {
        el.dataset.codeManifestId = manifest.manifest;
      });
    });
    manifest.selectedVariant.updatemetadata?.forEach((item) => {
      if (item.selector === 'gnav-source') {
        document.querySelectorAll('header, footer').forEach((el) => {
          el.dataset.manifestId = manifest.manifest;
        });
      }
    });
  });
}

export default async function decoratePreviewMode(manifests, utils) {
  document.addEventListener('milo:deferred', () => {
    utils.loadStyle('/libs/features/personalization/preview.css');
    const overlay = utils.createTag('div', { class: 'mep-preview-overlay', style: 'display: none;' });
    document.body.append(overlay);
    createPreviewPill(manifests, overlay, utils);
    addMarkerData(manifests);
  }, { once: true });
}
