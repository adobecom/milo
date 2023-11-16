export function processTrackingLabels(text, config, charLimit = 20) {
  if (!config) {
    import('../utils/utils.js').then((utils) => {
      // eslint-disable-next-line no-param-reassign
      config = utils.getConfig();
    });
  }
  const analyticsValue = text?.replace(/[^\w\s]+/g, ' ').replace(/\s+/g, ' ').replace(/^_+|_+$/g, '').trim()
    .slice(0, charLimit);
  return analyticsValue;
}

export function decorateDefaultLinkAnalytics(block, config) {
  if (block.classList.length
    && !block.className.includes('metadata')
    && !block.classList.contains('link-block')
    && !block.classList.contains('section')
    && block.nodeName === 'DIV') {
    let header = '';
    let linkCount = 1;
    block.querySelectorAll('h1, h2, h3, h4, h5, h6, a:not(.video.link-block), button, .tracking-header')
      .forEach((item) => {
        if (item.nodeName === 'A' || item.nodeName === 'BUTTON') {
          if (!item.hasAttribute('daa-ll')) {
            let label = item.textContent?.trim();
            if (label === '') {
              label = item.getAttribute('title')
                || item.getAttribute('aria-label')
                || item.querySelector('img')?.getAttribute('alt')
                || 'no label';
            }
            label = processTrackingLabels(label, config);
            item.setAttribute('daa-ll', `${label}-${linkCount}--${header}`);
          }
          linkCount += 1;
        } else {
          header = processTrackingLabels(item.textContent, config);
        }
      });
  }
}

export async function decorateSectionAnalytics(section, idx, config) {
  document.querySelector('main')?.setAttribute('daa-im', 'true');
  section.setAttribute('daa-lh', `s${idx + 1}`);
  section.querySelectorAll('[data-block] [data-block]').forEach((block) => {
    block.removeAttribute('data-block');
  });
  section.querySelectorAll('[data-block]').forEach((block, blockIdx) => {
    const blockName = block.classList[0] || '';
    block.setAttribute('daa-lh', `b${blockIdx + 1}|${blockName.slice(0, 15)}|${document.body.dataset.mep}`);
    decorateDefaultLinkAnalytics(block, config);
    block.removeAttribute('data-block');
  });
}

// below functions are being sunset
export function decorateBlockAnalytics() { return false; }
export function decorateLinkAnalytics() { return false; }

export const analyticsGetLabel = (txt) => txt.replaceAll('&', 'and')
  .replace(/[^0-9a-z]/gi, '_')
  .replace(/^_+|_+$/g, '');

export const analyticsDecorateList = (li, idx) => {
  const link = li.firstChild?.nodeName === 'A' && li.firstChild;
  if (!link) return;

  const label = link.textContent || link.getAttribute('aria-label');
  if (!label) return;

  link.setAttribute('daa-ll', `${analyticsGetLabel(label)}-${idx + 1}`);
};
