import { createTag } from '../../utils/utils.js';

const ALLOWED_MESSAGE_ORIGINS = [
  'https://stage.plan.adobe.com',
  'https://plan.adobe.com',
];

function handleManagePlanEvents(message) {
  const { subType, data } = message;
  switch (subType) {
    case 'EXTERNAL':
      if (!data?.externalUrl || !data?.target) return;
      window.open(data.externalUrl, data.target);
      break;
    case 'SWITCH':
      if (!data?.externalUrl || !data?.target) return;
      window.open(data.externalUrl, data.target);
      break;
    case 'Close':
      document.querySelector('.dialog-modal')?.dispatchEvent(new Event('iframe:modal:closed'));
      break;
    default:
      break;
  }
}

export function handleIFrameEvents(message) {
  const { data, origin } = message;
  if (!ALLOWED_MESSAGE_ORIGINS.includes(origin)) return;
  try {
    const parsedMsg = JSON.parse(data);
    if (parsedMsg.app === 'ManagePlan') handleManagePlanEvents(parsedMsg);
  } catch (error) {
    window.lana?.log(`Error while attempting to parse JSON from an iframe message: ${error}`);
  }
}

export default function init(el) {
  const anchor = el.querySelector('a');
  const ariaLabel = anchor?.getAttribute('aria-label');
  const linkHref = el.href ?? anchor?.href;
  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  if (!linkHref) return;
  const url = new URL(linkHref);

  if (ALLOWED_MESSAGE_ORIGINS.includes(url.origin)) {
    window.addEventListener('message', handleIFrameEvents);
  }

  const iframe = createTag('iframe', { src: linkHref, allowfullscreen: true });
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  iframe.onload = () => {
    try {
      const dialogModal = iframe.closest('.dialog-modal');
      if (new URL(iframe.src).origin !== window.location.origin) {
        if (ariaLabel) iframe.title = ariaLabel;
        dialogModal?.setAttribute('aria-label', iframe.title);
        return;
      }

      const sameOriginText = ariaLabel || iframe.contentWindow.document.querySelector('h1, h2, h3, h4, h5, h6')?.textContent;
      if (sameOriginText) iframe.title = sameOriginText;
      if (dialogModal && sameOriginText) dialogModal.setAttribute('aria-label', sameOriginText);
    } catch (error) {
      // Cross-origin iframe, can't access content
    }
  };

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
