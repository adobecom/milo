import { getConfig, getLanguage, getLocale, loadLanguageConfig } from '../../utils/utils.js';

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

export function decorateLink(link, path, localeToLanguageMap = []) {
  let hrefAdapted;
  let pathname = link.getAttribute('href');
  if (pathname.startsWith('http')) {
    try { pathname = new URL(pathname).pathname; } catch (e) { /* href does not contain domain */ }
  }

  const { languageMap, languages, locales } = getConfig();
  const mergedLocales = { ...locales };
  localeToLanguageMap.forEach((lang) => {
    const { locale } = lang;
    if (!mergedLocales[locale]) {
      mergedLocales[locale] = { ietf: 'none', tk: 'none' };
    }
  });

  const currentLocaleObj = languages
    ? getLanguage(languages, mergedLocales, pathname) : getLocale(mergedLocales, pathname);
  const prefix = currentLocaleObj.prefix.replace('/', '');

  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);

  if (languageMap && !locales[prefix] && (languages && !languages[prefix])) {
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

export default async function init(block) {
  const { localeToLanguageMap } = await loadLanguageConfig();
  const config = getConfig();
  const divs = block.querySelectorAll(':scope > div');
  if (divs.length < 2) return;
  const links = divs[1].querySelectorAll('a');
  if (!links.length) return;
  const { prefix } = config.locale;
  const { location } = window;
  const hasPrefix = location.pathname.startsWith(`${prefix}/`);
  const path = location.href.replace(location.origin + (hasPrefix ? prefix : ''), '').replace('#langnav', '');
  links.forEach((link) => decorateLink(link, path, localeToLanguageMap));
}
