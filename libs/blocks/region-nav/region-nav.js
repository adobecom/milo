import { getConfig } from '../../utils/utils.js';

/* c8 ignore next 11 */
function handleEvent(prefix, link, config) {
  document.cookie = `international=${prefix};path=/`;
  sessionStorage.setItem('international', prefix);
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    if (!resp.ok) throw new Error('request failed');
    window.location.assign(link.href);
  }).catch(() => {
    const prefixUrl = prefix ? `/${prefix}` : '';
    window.location.assign(`${prefixUrl}${config.contentRoot || ''}/`);
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
  link.href = `${href}${config.contentRoot || ''}${path}`;
  link.addEventListener('click', (e) => {
    /* c8 ignore next 2 */
    e.preventDefault();
    handleEvent(prefix, link, config);
  });
}

export default function init(block) {
  const config = getConfig();
  const divs = block.querySelectorAll(':scope > div');
  if (divs.length < 2) return;
  const links = divs[1].querySelectorAll('a');
  if (!links.length) return;
  const { contentRoot } = config.locale;
  const path = window.location.href.replace(`${contentRoot}`, '').replace('#langnav', '');
  links.forEach((l) => decorateLink(l, config, path));
}
