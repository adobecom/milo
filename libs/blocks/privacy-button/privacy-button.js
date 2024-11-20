import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

export const getCookie = (name) =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

function injectTrackingImage(url) {
  const img = createTag('img', {
    src: url,
    class: 'privacy-tracking-image',
    'aria-hidden': 'true',
  });
  document.body.appendChild(img);
}

function handleModalVariant(button, url) {
  button.addEventListener('click', () => {
    if (url) {
      window.open(url, '_blank');
    }
  });
}

function handleCookieVariant(button, cookieName, optInLabel, optOutLabel) {
  const updateButtonState = () => {
    const isOptedIn = getCookie(cookieName) === '1';
    button.textContent = isOptedIn ? optOutLabel : optInLabel;
  };

  button.addEventListener('click', () => {
    const isOptedIn = getCookie(cookieName) === '1';
    createCookie(cookieName, isOptedIn ? '0' : '1', 365);
    updateButtonState();
  });

  updateButtonState();
}

function handleUrlVariant(button, urls, message) {
  button.addEventListener('click', () => {
    urls.split(',').forEach((url) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl.includes('.jpg') || trimmedUrl.includes('.gif')) {
        injectTrackingImage(trimmedUrl);
      } else {
        window.open(trimmedUrl, '_blank');
      }
    });

    if (getCookie('demdex') !== undefined) {
      setCookieValue('demdex', 'NOTARGET');
    }

    // Create a new element for the success message
    button.parentNode.replaceChild(
      createTag('span', { class: 'privacy-button-success' }, message),
      button
    );
  });
}

function getConfig(el) {
  const rows = el.querySelectorAll(':scope > div');
  const config = {};

  rows.forEach((row) => {
    const [key, value] = row.children;
    if (key && value) {
      const keyText = key.textContent.trim().toLowerCase();
      config[keyText] = value.textContent.trim();
    }
  });

  return config;
}

export default function init(el) {
  const config = getConfig(el);

  const container = createTag('div', { class: 'privacy-button-container' });
  const text = createTag('p', { class: 'privacy-button-text' }, config.text);
  const button = createTag(
    'button',
    {
      class: 'privacy-button-xyz',
      type: 'button',
    },
    config['button-label']
  );

  if (config['cookie-name'] && config['button-label-opt-in']) {
    handleCookieVariant(
      button,
      config['cookie-name'],
      config['button-label-opt-in'],
      config['button-label']
    );
  } else if (config['confirmation-message'] && config.url) {
    handleUrlVariant(
      button,
      config.url,
      config['confirmation-message'],
      container
    );
  } else if (config.url) {
    handleModalVariant(button, config.url);
  }

  // container.append(text, button);
  el.innerHTML = '';

  // Add spacing class if specified in block name
  if (el.classList.contains('m-spacing')) {
    container.classList.add('privacy-button-container-m-spacing');
  }

  el.append(button);
  decorateButtons(el);
}

//   export default function init(el) {
//     const config = {
//       text: el.querySelector('div:nth-child(1)')?.textContent?.trim(),
//       buttonLabel: el.querySelector('div:nth-child(2)')?.textContent?.trim(),
//       buttonLabelOptIn: el.querySelector('div:nth-child(3)')?.textContent?.trim(),
//       cookieName: el.querySelector('div:nth-child(4)')?.textContent?.trim(),
//       confirmationMessage: el.querySelector('div:nth-child(5)')?.textContent?.trim(),
//       url: el.querySelector('div:nth-child(6)')?.textContent?.trim(),
//     };

//   const container = createTag('div', { class: 'privacy-button-container' });
//   const text = createTag('p', { class: 'privacy-button-text' }, config.text);
//   const button = createTag('button', {
//     class: 'privacy-button-xyz',
//     type: 'button',
//   }, config.buttonLabel);

//   if (config.cookieName && config.buttonLabelOptIn) {
//     handleCookieVariant(button, config.cookieName, config.buttonLabelOptIn, config.buttonLabel);
//   } else if (config.confirmationMessage && config.url) {
//     handleUrlVariant(button, config.url, config.confirmationMessage);
//   } else if (config.url) {
//     handleModalVariant(button, config.url);
//   }

//   // container.append(text, button);
//   // container.append(button);
//   el.innerHTML = '';
//   el.append(button);

//   decorateButtons(el);
// }
