import { decorateButtons, decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';

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
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

function goToDataHref() {
  window.location.href = this.dataset.href;
}

export default function init(el) {
  decorateButtons(el, 'button-l');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  if (rows.length > 2 && (el.classList.contains('highlight') || el.classList.contains('highlight-dark'))) {
    const [highlightStyle, highlight, ...tail] = rows;
    highlight.classList.add('highlight-row');
    const highlightImage = highlightStyle.querySelector('picture img');
    if (highlightImage) {
      highlight.style.backgroundImage = `url(${highlightImage.getAttribute('src')})`;
    } else if (highlightStyle.textContent !== '') {
      highlight.style.background = highlightStyle.textContent;
    }
    if (highlight.innerText.trim() === '') highlight.classList.add('highlight-empty');
    highlightStyle.remove();
    rows = tail;
  }
  const helperClasses = [];
  let blockType = 'text';
  const size = getBlockSize(el);
  const longFormVariants = ['inset', 'long-form', 'bio'];
  longFormVariants.forEach((variant, index) => {
    if (el.classList.contains(variant)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (index > 0) ? 'standard' : variant;
    }
  });
  const config = blockTypeSizes[blockType][size];
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((override, index) => {
    const hasClass = [...el.classList].filter((listItem) => listItem.includes(override));
    if (hasClass.length) config[index] = hasClass[0].split('-').shift().toLowerCase();
  });
  decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'xxl-spacing');
  if (el.classList.contains('full-width') && !el.classList.contains('left') && !el.classList.contains('right')) helperClasses.push('center');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  el.classList.add(...helperClasses);
  if (el.classList.contains('link-pod') || el.classList.contains('click-pod')) {
    const links = el.querySelectorAll('a');
    links.forEach((link) => {
      link.classList.add('pod-link');
    });
    if (el.classList.contains('click-pod') && links.length) {
      const link = links[0];
      el.dataset.href = link.href;
      el.addEventListener('click', goToDataHref);
    }
  }
}
