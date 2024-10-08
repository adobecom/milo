import { getConfig } from '../../utils/utils.js';

function setInternational(prefix) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
  const maxAge = 365 * 24 * 60 * 60; // max-age in seconds for 365 days
  document.cookie = `international=${prefix};max-age=${maxAge};path=/;${domain}`;
  sessionStorage.setItem('international', prefix);
}

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;

  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    const prefixUrl = prefix ? `/${prefix}` : '';
    callback(`${prefixUrl}/`);
  });
}

function decorateLink(link, path) {
  let hrefAdapted;
  let pathname = link.getAttribute('href');
  if (pathname.startsWith('http')) {
    try { pathname = new URL(pathname).pathname; } catch (e) { /* href does not contain domain */ }
  }
  const linkParts = pathname.split('/');
  const prefix = linkParts[1] || 'us';
  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);
  link.href = `${href}${path}`;

  link.addEventListener('mouseover', () => {
    setTimeout(() => {
      if (link.matches(':hover') && !hrefAdapted) {
        handleEvent({
          prefix,
          link,
          callback: (newHref) => {
            link.href = newHref;
            hrefAdapted = true;
          },
        });
      }
    }, 100);
  });

  link.addEventListener('click', (e) => {
    setInternational(prefix);
    if (hrefAdapted) return;
    e.preventDefault();
    handleEvent({
      prefix,
      link,
      callback: (newHref) => {
        window.open(newHref, e.ctrlKey || e.metaKey ? '_blank' : '_self');
      },
    });
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
  links.forEach((link) => decorateLink(link, path));
}
