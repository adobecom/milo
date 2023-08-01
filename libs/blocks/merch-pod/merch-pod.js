/* eslint-disable prefer-destructuring */
import { decorateButtons } from '../../utils/decorate.js';
import { loadStyle, getConfig, createTag } from '../../utils/utils.js';
import { addBackgroundImg, addWrapper, addFooter } from '../card/cardUtils.js';
import { decorateLinkAnalytics } from '../../martech/attributes.js';

const SEGMENT = 'SegmentCard';
const SPECIAL_OFFER = 'SpecialOffer';

const getPodType = (styles) => {
  const podTypes = {
    'segment-card': SEGMENT,
    'special-offer': SPECIAL_OFFER,
  };
  const authoredType = styles?.find((style) => style in podTypes);
  return podTypes[authoredType] || SEGMENT;
};

const createDescription = (rows, podType) => {
  const descriptions = rows.slice(0, rows.length - 1);
  const descriptionWrapper = createTag('div');
  descriptionWrapper.classList.add(`consonant-${podType}-description`);
  descriptions?.forEach((description) => {
    descriptionWrapper.appendChild(description);
  });
  return descriptionWrapper;
};

const createTitle = (titles, podType) => {
  const titleWrapper = createTag('div');
  titleWrapper.classList.add(`consonant-${podType}-title`);
  titles?.forEach((title) => {
    titleWrapper.appendChild(title);
  });
  return titleWrapper;
};

const decorateFooter = (el, podType) => {
  el.querySelectorAll('.consonant-CardFooter-cell')
    .forEach((cell) => {
      cell.classList.add(`consonant-${podType}-cell`);
    });
};

const addInner = (el, podType, merchPod) => {
  const titles = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const rows = Array.from(el.querySelectorAll('p'));

  const inner = el.querySelector(':scope > div:not([class])');
  inner.classList.add(`consonant-${podType}-inner`);
  const title = createTitle(titles, podType);
  const description = createDescription(rows, podType, inner);

  inner.prepend(title);
  inner.append(description);
  merchPod.append(inner);
};

const decorateRibbon = (el) => {
  const ribbonMetadata = el.querySelectorAll('div > div[data-align="center"][data-valign="middle"]');

  if (ribbonMetadata.length === 2) {
    const ribbonStyle = ribbonMetadata[0].outerText;
    const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
    if (!ribbonStyleRegex.test(ribbonStyle)) return;
    const [ribbonBgColor, ribbonTextColor] = ribbonStyle.split(', ');
    const ribbonWrapper = ribbonMetadata[0].parentNode;
    const ribbon = ribbonMetadata[1];
    ribbon.classList.add('consonant-SpecialOffer-ribbon');
    ribbon.style.backgroundColor = ribbonBgColor;
    ribbon.style.color = ribbonTextColor;
    const picture = el.querySelector('.consonant-SpecialOffer-img');
    if (picture) {
      picture.insertAdjacentElement('afterend', ribbon);
    } else {
      el.insertAdjacentElement('beforeend', ribbon);
    }
    ribbonWrapper.remove();
  }
};

const init = (el) => {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  decorateLinkAnalytics(el, headings);
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/deps/caas.css`);
  const section = el.closest('.section');
  section.classList.add('milo-card-section');
  const picture = el.querySelector('picture');
  let row = el.querySelector(':scope > div');
  if (row.children.length === 2) {
    row = el.querySelectorAll(':scope > *')[1];
  }
  const allPElems = row.querySelectorAll('p');
  const ctas = allPElems[allPElems.length - 1];
  const styles = Array.from(el.classList);
  const podType = getPodType(styles);
  const merch = styles.includes('merch-pod');
  const links = merch ? el.querySelector(':scope > div > div > p:last-of-type')
    .querySelectorAll('a') : el.querySelectorAll('a');
  const merchPod = el;
  addWrapper(el, section, podType);
  merchPod.classList.add('consonant-Card', 'consonant-ProductCard');
  if (picture) {
    addBackgroundImg(picture, podType, merchPod);
  }
  decorateRibbon(el);
  picture?.parentElement.remove();
  addInner(el, podType, merchPod);
  decorateButtons(ctas);
  addFooter(links, row, merchPod);
  decorateFooter(el, podType);
  const inner = el.querySelector(`.consonant-${podType}-inner`);
  const innerCleanup = inner.querySelectorAll(':scope > div')[1];
  if (innerCleanup.classList.length === 0) {
    innerCleanup.remove();
  }
};

export default init;
