import { getConfig } from '../../utils/utils.js';

const queriedPages = [];

function setInternational(prefix) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
  const maxAge = 365 * 24 * 60 * 60; // max-age in seconds for 365 days
  document.cookie = `international=${prefix};max-age=${maxAge};path=/;${domain}`;
  sessionStorage.setItem('international', prefix);
}

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;

  const existingPage = queriedPages.find((page) => page.href === link.href);
  if (existingPage) {
    callback(existingPage.resp.ok
      ? link.href
      : `${prefix ? `/${prefix}` : ''}/`);
    return;
  }
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: link.href, resp });
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    callback(`${prefix ? `/${prefix}` : ''}/`);
  });
}

export function decorateLink(link, path) {
  let hrefAdapted;
  let pathname = link.getAttribute('href');
  if (pathname.startsWith('http')) {
    try { pathname = new URL(pathname).pathname; } catch (e) { /* href does not contain domain */ }
  }
  const linkParts = pathname.split('/');
  const prefix = linkParts[1] || '';
  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);

  const { languageMap } = getConfig();
  if (languageMap && !getConfig().locales[prefix]) {
    const valueInMap = languageMap[prefix];
    href = href.replace(`/${prefix}`, valueInMap ? `/${valueInMap}` : '');
  }
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
    setInternational(prefix === '' ? 'us' : prefix);
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
  block.innerHTML = `<div><li id="jp">Japanese</li><li id="kr">Korean</li></div>`;
  block.querySelector("#jp").addEventListener('click', () => {
    setInternational('jp');
  })
  block.querySelector("#kr").addEventListener('click', () => {
    setInternational('kr');
  })
}
