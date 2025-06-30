import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag, loadBlock } from '../../../utils/utils.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  standard: {
    small: ['s', 's', 's'],
    medium: ['m', 'm', 'm'],
    large: ['l', 'l', 'l'],
    xlarge: ['xl', 'xl', 'xl'],
  },
  inset: {
    small: ['s', 'm'],
    medium: ['m', 'l'],
    large: ['l', 'xl'],
    xlarge: ['xl', 'xxl'],
  },
  text: {
    xxsmall: ['xxs', 'xxs'],
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

function decorateMultiViewport(foreground) {
  const viewports = ['mobile-up', 'tablet-up', 'desktop-up'];
  if (foreground.childElementCount === 2 || foreground.childElementCount === 3) {
    [...foreground.children].forEach((child, index) => {
      child.className = viewports[index];
      if (foreground.childElementCount === 2 && index === 1) child.className = 'tablet-up desktop-up';
    });
  }
  return foreground;
}

function getInitialPosition(el) {
  return new Promise((resolve) => {
    const measure = () => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.height > 0 && rect.width > 0;

        if (isVisible) {
          const top = rect.top + el.offsetHeight - window.innerHeight;
          resolve(top);
        } else {
          // Try again on next frame if not yet measurable
          requestAnimationFrame(measure);
        }
      });
    };

    if (el.isConnected) {
      measure();
    } else {
      const observer = new MutationObserver(() => {
        if (el.isConnected) {
          observer.disconnect();
          measure();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}
function addStickyBehavior(el) {
  getInitialPosition(el).then((initialPosition) => {
    function handleScroll() {
      const elRect = el.getBoundingClientRect();
      const elFullyInView = elRect.top >= 0 && elRect.bottom <= window.innerHeight;
      const scrolledAboveInitial = window.scrollY < initialPosition;
      if (scrolledAboveInitial) {
        el.classList.remove('sticky-fixed');
        el.classList.add('sticky-initial');
      } else if (elFullyInView) {
        el.classList.add('sticky-fixed');
        el.classList.remove('sticky-initial');
      } else {
        el.classList.remove('sticky-initial');
        el.classList.add('sticky-fixed');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });
}

export default async function init(el) {
  el.classList.add('text-block', 'con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1 || el.matches('.accent-bar')) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail || rows;
  }
  const helperClasses = [];
  let blockType = 'text';
  const size = el.classList.contains('legal') ? 'xxsmall' : getBlockSize(el);
  ['inset', 'long-form', 'bio'].forEach((variant, index) => {
    if (el.classList.contains(variant)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (index > 0) ? 'standard' : variant;
    }
  });
  rows.forEach((row) => {
    row.classList.add('foreground');
    [...row.children].forEach((c) => decorateBlockText(c, blockTypeSizes[blockType][size]));
    decorateMultiViewport(row);
  });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  el.classList.add(...helperClasses);
  decorateTextOverrides(el);

  const lastActionArea = el.querySelector('.action-area:last-of-type');
  if (lastActionArea) {
    const div = createTag('div', { class: 'cta-container' });
    lastActionArea.insertAdjacentElement('afterend', div);
    div.append(lastActionArea);
  }

  const mnemonicList = el.querySelector('.mnemonic-list');
  const foreground = mnemonicList?.closest('.foreground');
  if (foreground) {
    mnemonicList.querySelectorAll('p').forEach((product) => product.removeAttribute('class'));
    await loadBlock(mnemonicList);
  }
  // Override Detail with Title L style if class exists - Temporary solution until Spectrum 2
  if (el.classList.contains('l-title')) {
    el.querySelectorAll('[class*="detail-"]')?.forEach((detail) => detail.classList.add('title-l'));
  }

  if (el.matches('[class*="sticky-bottom"]')) addStickyBehavior(el);
}
