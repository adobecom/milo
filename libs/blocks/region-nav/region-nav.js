import { getConfig } from '../../utils/utils.js';

// TODO move this to project specific file
const languageMap = getConfig().languageMap || new Map([
  ['ae_ar', ''],
  ['ae_en', ''],
  ['africa', ''],
  ['ar', 'es'],
  ['at', 'de'],
  ['au', ''],
  ['be_en', ''],
  ['be_fr', 'fr'],
  ['be_nl', 'nl'],
  ['bg', ''],
  ['ca', ''],
  ['ca_fr', 'fr'],
  ['cis_en', ''],
  ['cis_ru', ''],
  ['cr', 'es'],
  ['cy_en', ''],
  ['cz', ''],
  ['ch_de', 'de'],
  ['ch_fr', 'fr'],
  ['ch_it', 'it'],
  ['cl', 'es'],
  ['co', 'es'],
  ['cr', 'es'],
  ['da-DK', 'dk'],
  ['de-DE', 'de'],
  ['ec', 'es'],
  ['ee', ''],
  ['eg_ar', ''],
  ['eg_en', ''],
  ['es-ES', 'es'],
  ['fi-FI', 'fi'],
  ['fr-FR', 'fr'],
  ['gr_en', ''],
  ['gr_el', ''],
  ['gt', 'es'],
  ['hk_en', ''],
  ['hk_zh', 'tw'],
  ['hu', ''],
  ['id_en', ''],
  ['id_id', ''],
  ['ie', ''],
  ['il_en', ''],
  ['il_he', ''],
  ['in', ''],
  ['in_hi', ''],
  ['it-IT', 'it'],
  ['ja-JP', 'jp'],
  ['ko-KR', 'kr'],
  ['kw_ar', ''],
  ['kw_en', ''],
  ['la', 'es'],
  ['lt', ''],
  ['lu_en', ''],
  ['lu_de', 'de'],
  ['lu_fr', 'fr'],
  ['lv', ''],
  ['mena_ar', ''],
  ['mena_en', ''],
  ['mt', ''],
  ['mx', 'es'],
  ['my_en', ''],
  ['my_ms', ''],
  ['nb-NO', 'no'],
  ['ng', ''],
  ['nl-NL', 'nl'],
  ['nz', ''],
  ['pe', 'es'],
  ['ph_en', ''],
  ['ph_fil', ''],
  ['pl', ''],
  ['pr', 'es'],
  ['pt', 'br'],
  ['pt-BR', 'br'],
  ['qa_ar', ''],
  ['qa_en', ''],
  ['ro', ''],
  ['ru', ''],
  ['sa_ar', ''],
  ['sa_en', ''],
  ['sea', ''],
  ['sg', ''],
  ['si', ''],
  ['sk', ''],
  ['sv-SE', 'se'],
  ['th_en', ''],
  ['th_th', ''],
  ['tr', ''],
  ['ua', ''],
  ['uk', ''],
  ['dk', ''],
  ['it', ''],
  ['br', ''],
  ['cn', ''],
  ['de', ''],
  ['es', ''],
  ['fi', ''],
  ['fr', ''],
  ['jp', ''],
  ['kr', ''],
  ['nl', ''],
  ['no', ''],
  ['se', ''],
  ['tw', ''],
  ['vn_en', ''],
  ['vn_vi', ''],
  ['za', ''],
]);
// end TODO
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
  const prefix = linkParts[1] || '';
  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);

  if (languageMap && !getConfig().locales[prefix]) {
    const valueInMap = languageMap.get(prefix);
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
  const config = getConfig();
  const divs = block.querySelectorAll(':scope > div');
  if (divs.length < 2) return;
  const links = divs[1].querySelectorAll('a');
  if (!links.length) return;
  const { prefix } = config.locale;
  const path = window.location.href.replace(`${window.location.origin}${prefix}`, '').replace('#langnav', '');
  links.forEach((link) => decorateLink(link, path));
}
