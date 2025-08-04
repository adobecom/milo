import getServiceConfig from './service-config.js';

const INFO_ICON = `<svg id="info" viewBox="0 0 18 18" class="icon-milo icon-milo-info">
    <path fill="currentcolor" d="M10.075,6A1.075,1.075,0,1,1,9,4.925H9A1.075,1.075,0,0,1,10.075,6Zm.09173,6H10V8.2A.20005.20005,0,0,0,9.8,8H7.83324S7.25,8.01612,7.25,8.5c0,.48365.58325.5.58325.5H8v3H7.83325s-.58325.01612-.58325.5c0,.48365.58325.5.58325.5h2.3335s.58325-.01635.58325-.5C10.75,12.01612,10.16673,12,10.16673,12ZM9,.5A8.5,8.5,0,1,0,17.5,9,8.5,8.5,0,0,0,9,.5ZM9,15.6748A6.67481,6.67481,0,1,1,15.67484,9,6.67481,6.67481,0,0,1,9,15.6748Z"></path>
  </svg>`;
const CONSONANT_SHEET_FALLBACK = 'consonant.json';

async function getJson(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Response status: ${resp.status}`);
    }
    return await resp.json();
  } catch (error) {
    window.lana?.log(error.message);
    return null;
  }
}

function transformKeysToLowercase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToLowercase(item));
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      acc[key.toLowerCase()] = transformKeysToLowercase(value);
      return acc;
    }, {});
  }
  return obj;
}

function decorateAlertControls(element) {
  const alertControlsContainer = document.createElement('div');
  const toggle = document.createElement('a');
  toggle.classList.add('toggle-alerts');
  toggle.textContent = 'Hide alerts';
  let isVisible = true;
  alertControlsContainer.appendChild(toggle);
  alertControlsContainer.classList.add('alert-controls-container');
  element.appendChild(alertControlsContainer);

  toggle.addEventListener('click', () => {
    if (isVisible === false) {
      isVisible = true;
      toggle.textContent = 'Hide alerts';
    } else {
      isVisible = false;
      toggle.textContent = 'Show alerts';
    }
    element.classList.toggle('block-alerts');
    element.classList.toggle('hide-labels');
  });
}

export default async function blockNotifications(base) {
  const { blocknotifications } = await getServiceConfig(window.location.origin);
  const url = blocknotifications.url || CONSONANT_SHEET_FALLBACK;
  const json = await getJson(`${base}/${url}`);
  if (!json) return;

  const { blocks: rawBlocks } = json;
  const blocksKeyToLowercase = transformKeysToLowercase(rawBlocks);
  const { body } = document;
  body.classList.add('block-alerts');

  decorateAlertControls(body);

  const blockQueries = blocksKeyToLowercase.data.reduce((acc, row) => {
    const notConsonant = row.consonant === 'false';
    const decision = row.decision !== '' ? row.decision?.toLowerCase() === 'obsolete' || 'delist' || 'delisted' : undefined;
    if (row.block && (notConsonant || decision)) {
      const variation = row.variant && row.variant.replaceAll(',', '.').replaceAll(' ', '-').toLowerCase();
      const blockName = row.block.toLowerCase();
      const documentation = row.documentation !== '' ? row.documentation : undefined;
      const name = variation ? `${blockName} ${variation}` : `${blockName}`;
      const queryProps = { selector: variation ? `.${blockName}.${variation}` : `.${blockName}` };
      if (decision) queryProps.decision = row.decision?.toLowerCase();
      if (notConsonant) queryProps.notConsonant = 'Not Consonant';
      if (documentation) queryProps.documentation = row.documentation;
      if (name) queryProps.name = name;
      acc.push(queryProps);
    }
    return acc;
  }, []);

  blockQueries.forEach((query) => {
    const blocks = document.querySelectorAll(query.selector);

    blocks.forEach((foundBlock) => {
      const labelContainer = foundBlock.querySelector('.block-label-container');
      const delistAlertLabel = foundBlock.querySelector('.alert-label');
      const conAlertLabel = foundBlock.querySelector('.con-label');
      let blockLabelContainer;

      // Stop duplicate labels
      // Add a label container to the block
      if (!labelContainer) {
        blockLabelContainer = document.createElement('div');
        blockLabelContainer.classList.add('block-label-container');
        foundBlock.appendChild(blockLabelContainer);
      }
      if (query.decision && !delistAlertLabel) {
        const alertLabel = document.createElement('div');

        foundBlock.dataset.decision = query.decision.toLowerCase();
        foundBlock.dataset.blockAlert = 'true';
        alertLabel.classList.add('alert-label');
        alertLabel.textContent = query.decision;
        if (query.documentation) {
          const alertLink = document.createElement('a');

          alertLink.href = query.documentation;
          alertLink.target = '_blank';
          alertLink.title = `view ${query.name} ${alertLabel.textContent} documentation`;
          alertLink.innerHTML = INFO_ICON;
          alertLabel.appendChild(alertLink);
        }
        blockLabelContainer.appendChild(alertLabel);
      }
      if (query.notConsonant && !conAlertLabel) {
        const conLabel = document.createElement('div');

        foundBlock.dataset.conStatus = query.notConsonant;
        conLabel.classList.add('con-label');
        conLabel.textContent = 'Not consonant';
        conLabel.title = `${query.name} is not a consonant block`;
        blockLabelContainer?.appendChild(conLabel);
      }
    });
  });
}
