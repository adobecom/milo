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

function decorateNotificationControls(element) {
  const notificationControlsContainer = document.createElement('div');
  const toggle = document.createElement('a');
  toggle.classList.add('toggle-notifications');
  toggle.textContent = 'Hide notifications';
  let isVisible = true;
  notificationControlsContainer.appendChild(toggle);
  notificationControlsContainer.classList.add('notification-controls-container');
  element.appendChild(notificationControlsContainer);

  toggle.addEventListener('click', () => {
    if (isVisible === false) {
      isVisible = true;
      toggle.textContent = 'Hide notifications';
    } else {
      isVisible = false;
      toggle.textContent = 'Show notifications';
    }
    element.classList.toggle('block-notifications');
    element.classList.toggle('hide-labels');
  });
}

export default async function blockNotifications(base) {
  const { blocknotifications } = await getServiceConfig(window.location.origin);
  const conSheet = blocknotifications?.url || CONSONANT_SHEET_FALLBACK;
  const json = await getJson(`${base}/${conSheet}`);
  if (!json) return;

  const { blocks: rawBlocks } = json;
  const blocksKeyToLowercase = transformKeysToLowercase(rawBlocks);

  const blockQueries = blocksKeyToLowercase.data.reduce((acc, row) => {
    const notConsonant = row.consonant === 'false';
    const decision = row.decision !== '' ? row.decision?.toLowerCase() : undefined;
    if (row.block && (notConsonant || decision)) {
      const variation = row.variant && row.variant.replaceAll(',', '.').replaceAll(' ', '-').toLowerCase();
      const blockName = row.block.toLowerCase();
      const name = variation ? `${blockName} ${variation}` : `${blockName}`;
      const queryProps = { selector: variation ? `.${blockName}.${variation}` : `.${blockName}` };
      if (decision) queryProps.decision = decision;
      if (notConsonant) queryProps.notConsonant = 'Not Consonant';
      if (row.documentation) queryProps.documentation = row.documentation;
      if (name) queryProps.name = name;
      acc.push(queryProps);
    }
    return acc;
  }, []);

  blockQueries.forEach((query) => {
    const blocks = document.querySelectorAll(query.selector);
    if (blocks.length === 0) return;

    const { body } = document;
    body.classList.add('block-notifications');

    decorateNotificationControls(body);

    blocks.forEach((foundBlock) => {
      const labelContainer = foundBlock.querySelector('.block-label-container');
      const delistNotificationLabel = foundBlock.querySelector('.notification-label');
      const conNotificationLabel = foundBlock.querySelector('.con-label');
      let blockLabelContainer;

      // Stop duplicate labels
      // Add a label container to the block
      if (!labelContainer) {
        blockLabelContainer = document.createElement('div');
        blockLabelContainer.classList.add('block-label-container');
        foundBlock.appendChild(blockLabelContainer);
      }
      if (query.decision && !delistNotificationLabel) {
        const notificationLabel = document.createElement('div');

        foundBlock.dataset.decision = query.decision.toLowerCase();
        foundBlock.dataset.blockNotification = 'true';
        notificationLabel.classList.add('notification-label');
        notificationLabel.textContent = query.decision;
        notificationLabel.title = `${query.name} has been marked ${query.decision}`;
        if (query.documentation) {
          const notificationLink = document.createElement('a');

          notificationLink.href = query.documentation;
          notificationLink.target = '_blank';
          notificationLink.title = `view ${query.name} ${notificationLabel.textContent} documentation`;
          notificationLink.innerHTML = INFO_ICON;
          notificationLabel.appendChild(notificationLink);
        }
        blockLabelContainer.appendChild(notificationLabel);
      }
      if (query.notConsonant && !conNotificationLabel) {
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
