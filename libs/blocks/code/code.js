import * as utils from '../../utils/utils.js';

export const HIGHLIGHT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js';
export const FONT_CSS = 'https://use.typekit.net/vih2anh.css';
export const SIZE_VARIANTS = ['small', 'medium', 'large'];

export function getThemeUrl(theme = 'default') {
  return `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${theme}.min.css`;
}

function logError(msg) {
  window.lana?.log(`Code: ${msg}`, { tags: 'errorType=code' });
}

function getSizeVariant(el) {
  return [...el.classList].find((v) => SIZE_VARIANTS.includes(v));
}

function getLanguageVariant(el) {
  return [...el.classList].find((v) => ![...SIZE_VARIANTS, 'code'].includes(v));
}

export default async function init(el, { getMetadata, loadScript, loadStyle } = utils) {
  const codeEl = el.querySelector('pre code');
  if (!codeEl) {
    logError('monospaced text block not found');
    return;
  }
  const theme = getMetadata('code-theme-name') || 'default';
  const size = getSizeVariant(el) || 'medium';
  const lang = getLanguageVariant(el);
  codeEl.classList.add(`code-${size[0]}`);
  codeEl.classList.add(lang);
  el.classList.add('con-block');

  await Promise.all([
    loadScript(HIGHLIGHT_JS),
    loadStyle(FONT_CSS),
    loadStyle(getThemeUrl(theme)),
  ]);

  /* global hljs */
  hljs.highlightElement(codeEl);
}
