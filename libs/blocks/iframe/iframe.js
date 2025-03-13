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

export function handleIFrameEvents({ data }) {
  let parsedMsg = null;
  try {
    parsedMsg = JSON.parse(data);
  } catch (error) {
    return;
  }
  const { app } = parsedMsg;
  if (app === 'ManagePlan') handleManagePlanEvents(parsedMsg);
}

export default function init(el) {
  const linkHref = el.href ?? el.querySelector('a')?.href;
  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  let url = null;
  try {
    url = new URL(linkHref);
  } catch (e) {
    return;
  }

  if (ALLOWED_MESSAGE_ORIGINS.includes(url.origin) || window.location.origin === url.origin) {
    window.addEventListener('message', handleIFrameEvents);
  }

  const iframe = createTag('iframe', { src: linkHref, allowfullscreen: true });
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
