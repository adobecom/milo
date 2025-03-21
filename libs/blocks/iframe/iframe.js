import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

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

export function handleIFrameEvents({ data }) {
  try {
    const parsedMsg = JSON.parse(data);
    if (parsedMsg.app === 'ManagePlan') handleManagePlanEvents(parsedMsg);
  } catch (error) {
    window.lana?.log(`Error while attempting to parse JSON from an iframe message: ${error}`);
  }
}

export default function init(el) {
  const linkHref = el.href ?? el.querySelector('a')?.href;
  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  if (!linkHref) return;
  const url = new URL(linkHref);

  if (ALLOWED_MESSAGE_ORIGINS.includes(url.origin) || window.location.origin === url.origin) {
    window.addEventListener('message', handleIFrameEvents);
  }

  const iframe = createTag('iframe', { src: linkHref, allowfullscreen: true });
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);
  iframe.onload = () => {
    const iframeOrigin = new URL(iframe.src).origin;

    if (iframeOrigin !== window.location.origin) {
      fetch(linkHref)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const header = doc.querySelector('h1, h2, h3, h4, h5, h6')?.textContent;
          if (header) iframe.title = header;
        });
      return;
    }

    const frameDoc = iframe.contentWindow.document;
    const heading = frameDoc.querySelector('h1, h2, h3, h4, h5, h6');

    if (heading) {
      iframe.title = heading.textContent;
    } else {
      const metaDataElement = el.parentElement.querySelector('.modal-metadata');
      if (metaDataElement) iframe.title = getMetadata(metaDataElement)?.title.text;
    }
  };

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
