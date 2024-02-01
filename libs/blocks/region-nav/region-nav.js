import { getConfig } from '../../utils/utils.js';

/* c8 ignore next 12 */
function handleEvent(prefix, link, hover) {
  document.cookie = `international=${prefix};path=/`;
  sessionStorage.setItem('international', prefix);
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    if (!resp.ok) throw new Error('request failed');
    if (!hover) window.location.assign(link.href);
  }).catch(() => {
    const prefixUrl = prefix ? `/${prefix}` : '';
    if (!hover) window.location.assign(`${prefixUrl}/`);
    if (hover) link.href = `${prefixUrl}/`;
  });
}

function decorateLink(link, config, path) {
  let pathname = link.getAttribute('href');
  if (pathname.startsWith('http')) {
    try { pathname = new URL(pathname).pathname; } catch (e) { /* href does not contain domain */ }
  }
  const linkParts = pathname.split('/');
  const prefix = linkParts[1] || 'us';
  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);
  link.href = `${href}${path}`;
  link.addEventListener('click', (e) => {
    /* c8 ignore next 2 */
    e.preventDefault();
    handleEvent(prefix, link);
  });
  let timeOutTimer = null;
  link.addEventListener('mouseover', () => {
    /* c8 ignore next 3 */
    timeOutTimer = window.setTimeout(() => {
      handleEvent(prefix, link, 'hover');
    }, 50);
  });
  link.addEventListener('mouseout', () => {
    /* c8 ignore next 1 */
    window.clearTimeout(timeOutTimer);
  });
}

export default function init(block) {
  const config = getConfig();
  const divs = block.querySelectorAll(':scope > div');
  if (divs.length < 2) return;
  const links = divs[1].querySelectorAll('a');
  if (!links.length) return;
  const { prefix } = config.locale;
  const path = window.location.href.replace(`${window.location.origin}${prefix}`, '').replace('#langnav', '');
  links.forEach((l) => decorateLink(l, config, path));
}
