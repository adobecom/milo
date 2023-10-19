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
  document.querySelector('main')?.setAttribute('daa-im', 'true');
  section.setAttribute('daa-lh', `s${idx + 1}`);
  section.querySelectorAll('[data-block] [data-block]').forEach((block) => {
    block.removeAttribute('data-block');
  });
  section.querySelectorAll('[data-block]').forEach((block, blockIdx) => {
    const blockName = block.classList[0] || '';
    block.setAttribute('daa-lh', `b${blockIdx + 1}|${blockName}|${document.body.dataset.mep}`);
    decorateDefaultLinkAnalytics(block);
    block.removeAttribute('data-block');
  });
}
