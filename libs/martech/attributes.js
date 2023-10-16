const RE_ALPHANUM = /[^0-9a-z]/gi;
const RE_TRIM_UNDERSCORE = /^_+|_+$/g;

// decorateBlockAnalytics & decorateLinkAnalytics are being sunset
export function decorateBlockAnalytics() { return false; }
export function decorateLinkAnalytics() { return false; }

export const analyticsGetLabel = (txt) => txt.replaceAll('&', 'and')
  .replace(RE_ALPHANUM, '_')
  .replace(RE_TRIM_UNDERSCORE, '');

export const analyticsDecorateList = (li, idx) => {
  const link = li.firstChild?.nodeName === 'A' && li.firstChild;
  if (!link) return;

  const label = link.textContent || link.getAttribute('aria-label');
  if (!label) return;

  link.setAttribute('daa-ll', `${analyticsGetLabel(label)}-${idx + 1}`);
};
