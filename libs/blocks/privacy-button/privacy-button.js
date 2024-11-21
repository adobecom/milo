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
    if (url && url.includes('#openPrivacy')) {
      window.location.hash = 'openPrivacy';
    }
  });
}

function handleCookieVariant(button, cookieName, optInLabel, optOutLabel) {
  const setCookieSubscription = () => {
    const cookies = cookieName.split(',');
    cookies.forEach((cookie) => {
      if (getCookie(cookie) === '1') {
        // Delete cookie if it was already set
        document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      } else {
        // Set cookie if it was not previously set
        document.cookie = `${cookie}=1;path=/;max-age=${60 * 60 * 24 * 365}`;
      }
    });
  };

  const setLabelBasedOnSubscription = () => {
    const cookies = cookieName.split(',');
    const isUnsubscribed = cookies.every((cookie) => getCookie(cookie) === '1');
    button.textContent = isUnsubscribed ? optInLabel : optOutLabel;
  };

  button.addEventListener('click', () => {
    setCookieSubscription();
    setLabelBasedOnSubscription();
  });

  setLabelBasedOnSubscription();
}

function handleUrlVariant(button, urls, message) {
  button.addEventListener('click', () => {
    urls.split(',').forEach((url) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl.match(/([^\s]+(?=\.(jpg|jpeg|gif|png))\.\2)/gm) !== null) {
        injectTrackingImage(trimmedUrl);
      } else {
        window.open(trimmedUrl, '_blank');
        injectTrackingImage('https://rtd-tm.everesttech.net/user/privacy?dnt=t');
      }
    });

    // Create a new element for the success message
    button.parentNode.replaceChild(
      createTag('span', { class: 'privacy-button-success' }, message),
      button
    );
  });
}

export default function init(el) {
  const config = {};
  el.querySelectorAll(':scope > div').forEach((row) => {
    const [key, value] = [...row.children];
    if (key && value) {
      config[key.textContent.trim().toLowerCase()] = value.textContent.trim();
    }
  });

  const button = createTag('button', {
    // class: 'spectrum-Button spectrum-Button--primary spectrum-Button--sizeM',
    type: 'button',
  }, config['button-label']);

  if (config['cookie-name'] && config['button-label-opt-in']) {
    handleCookieVariant(
      button,
      config['cookie-name'],
      config['button-label-opt-in'],
      config['button-label']
    );
  } else if (config['confirmation-message'] && config.url) {
    handleUrlVariant(button, config.url, config['confirmation-message']);
  } else if (config.url) {
    handleModalVariant(button, config.url);
  }

  el.innerHTML = '';
  el.append(button);
  decorateButtons(el);
}



