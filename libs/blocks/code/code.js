import * as utils from '../../utils/utils.js';

export const HIGHLIGHT_JS = '/libs/deps/highlight.min.js';
export const FONT_CSS = 'https://use.typekit.net/vih2anh.css';
export const SIZE_VARIANTS = ['small', 'medium', 'large'];
export const MISC_VARIANTS = ['light', 'dark', 'wrap'];
export const ALL_VARIANTS = [...SIZE_VARIANTS, ...MISC_VARIANTS, 'code'];

function logError(msg) {
  window.lana?.log(`Code: ${msg}`, { tags: 'errorType=code' });
}

function getSizeVariant(el) {
  return [...el.classList].find((v) => SIZE_VARIANTS.includes(v));
}

function getLanguageVariant(el) {
  return [...el.classList].find((v) => !ALL_VARIANTS.includes(v));
}

export default async function init(el, { loadScript, loadStyle } = utils) {
  const codeEl = el.querySelector('pre code');
  if (!codeEl) {
    logError('monospaced text block not found');
    return;
  }
  const size = getSizeVariant(el) || 'medium';
  const lang = getLanguageVariant(el);
  codeEl.classList.add(`code-${size[0]}`);
  codeEl.classList.add(lang);
  el.classList.add('con-block');

  await Promise.all([
    loadScript(HIGHLIGHT_JS),
    loadStyle(FONT_CSS),
  ]);

  /* global hljs */
  hljs.highlightElement(codeEl);
}
