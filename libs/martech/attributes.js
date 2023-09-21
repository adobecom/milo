const RE_ALPHANUM = /[^0-9a-z]/gi;
const RE_TRIM_UNDERSCORE = /^_+|_+$/g;

// decorateBlockAnalytics & decorateLinkAnalytics are being sunset
export function decorateBlockAnalytics() { return false; }
export function decorateLinkAnalytics() { return false; }

export function processTrackingLabels(text, charLimit = 20) {
  return text?.trim().replace(/\s+/g, ' ').split('|').join(' ')
    .slice(0, charLimit);
}

export function decorateDefaultLinkAnalytics(block) {
  if (block.classList.length
    && !block.className.includes('metadata')
    && !block.classList.contains('link-block')
    && !block.classList.contains('section')
    && block.nodeName === 'DIV') {
    let header = '';
    let linkCount = 1;
    block.querySelectorAll('h1, h2, h3, h4, h5, h6, a:not(.video.link-block), button, .heading-title').forEach((item) => {
      if (item.nodeName === 'A' || item.nodeName === 'BUTTON') {
        if (!item.hasAttribute('daa-ll')) {
          let label = item.textContent;
          if (label.trim() === '') {
            label = item.getAttribute('title') || item.getAttribute('aria-label') || item.querySelector('img')?.getAttribute('alt') || 'no label';
          }
          label = processTrackingLabels(label);
          item.setAttribute('daa-ll', `${label}-${linkCount}|${header}`);
        }
        linkCount += 1;
      } else {
        header = processTrackingLabels(item.textContent);
      }
    });
  }
}

export async function decorateSectionAnalytics(section, idx) {
  section.setAttribute('daa-lh', `s${idx + 1}`);
  section.querySelectorAll('[data-block="true"] [data-block="true"]').forEach((block) => {
    block.removeAttribute('data-block');
  });
  section.querySelectorAll('[data-block="true"]').forEach((block, blockIdx) => {
    const blockName = block.classList[0] || '';
    block.setAttribute('daa-lh', `b${blockIdx + 1}|${blockName}|${document.body.dataset.mep}`);
    decorateDefaultLinkAnalytics(block);
    block.removeAttribute('data-block');
  });
}

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
