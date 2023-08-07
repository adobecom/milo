/* eslint-disable prefer-destructuring */
import { decorateButtons } from '../../utils/decorate.js';
import { loadStyle, getConfig, createTag } from '../../utils/utils.js';
import { addBackgroundImg, addWrapper, addFooter } from '../card/cardUtils.js';
import { decorateLinkAnalytics } from '../../martech/attributes.js';

const {
  miloLibs,
  codeRoot,
} = getConfig();
const base = miloLibs || codeRoot;
const PADLOCK_IMG = `<img class="Padlock-img" loading="lazy" alt="Padlock icon" src="${base}/blocks/merch-pod/img/padlock.svg" height="13" width="15">`;

const SEGMENT_BLADE = 'SegmentBlade';
const SPECIAL_OFFERS = 'SpecialOffers';
const PLANS_CARD = 'PlansCard';

const getPodType = (styles) => {
  const podTypes = {
    'segment-blade': SEGMENT_BLADE,
    'special-offers': SPECIAL_OFFERS,
    'plans-card': PLANS_CARD,
  };
  const authoredType = styles?.find((style) => style in podTypes);
  return podTypes[authoredType] || SEGMENT_BLADE;
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
  const cardFooter = el.querySelector('.consonant-CardFooter');

  const decorateWithSecureTransactionSign = () => {
    const secureTransactionWrapper = createTag('span', { class: 'secure-transaction-wrapper' });
    const text = createTag('span', { class: 'footer-text' }, '{{secure-transaction}}');
    const secureElement = createTag('span', { class: 'padlock' }, PADLOCK_IMG);
    secureTransactionWrapper.append(secureElement, text);
    return secureTransactionWrapper;
  };

  const createCheckbox = (checkBoxText) => {
    cardFooter.querySelector('hr')?.remove();
    const checkboxText = createTag('span', { class: 'checkbox-text' }, checkBoxText.innerHTML);
    const checkBox = createTag('label', { class: 'checkbox-container' }, '<input type="checkbox" id="alt-cta"><span class="checkmark"></span>');
    const checkboxWrapper = createTag('div', { class: 'checkbox-wrapper' });
    checkboxWrapper.append(checkBox, checkboxText);
    return checkboxWrapper;
  };

  const decorateAlternativeCta = () => {
    const altCta = Array.from(el.querySelectorAll('div > div[data-align="center"][data-valign="middle"]')).filter((data) => data.textContent?.trim() === 'alt-cta');
    const altCtaMetaData = altCta[0]?.parentElement?.nextElementSibling?.querySelectorAll('div > div');
    const altCtaRegex = /href="([^"]*)"/g;
    if (altCtaMetaData?.length === 2 && altCtaMetaData[1]?.innerHTML?.match(altCtaRegex)) {
      const standardWrapper = createTag('div', { class: 'standard-wrapper' });
      const secureTransactionWrapper = decorateWithSecureTransactionSign();
      const cardFooterRow = el.querySelector('.consonant-CardFooter-row');
      const originalCtaButton = cardFooterRow.querySelector('.consonant-CardFooter-cell--right');
      const altCtaButton = originalCtaButton.cloneNode(true);
      const checkboxWrapper = createCheckbox(altCtaMetaData[0]);

      altCtaButton.innerHTML = altCtaMetaData[1].innerHTML;
      altCtaButton.classList.add('alt-cta-button--inactive');
      checkboxWrapper.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
        if (event.target.checked) {
          originalCtaButton.classList.add('alt-cta-button--inactive');
          altCtaButton.classList.remove('alt-cta-button--inactive');
        } else {
          altCtaButton.classList.add('alt-cta-button--inactive');
          originalCtaButton.classList.remove('alt-cta-button--inactive');
        }
      });
      cardFooterRow.append(altCtaButton);
      cardFooter.prepend(checkboxWrapper);
      standardWrapper.append(secureTransactionWrapper, cardFooterRow);
      cardFooter?.append(standardWrapper);
      altCta[0].parentNode.remove();
      altCtaMetaData[0].parentNode.remove();
    }
  };

  decorateAlternativeCta();
  cardFooter.querySelectorAll('.consonant-CardFooter-cell')
    .forEach((cell) => {
      cell.classList.add(`consonant-${podType}-cell`);
    });
};

const addInner = (el, podType, merchPod) => {
  const titles = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const rows = Array.from(el.querySelectorAll('p'));
  const styles = Array.from(el.classList);
  const merch = styles.includes('merch-pod');
  const links = merch ? el.querySelector(':scope > div > div > p:last-of-type')
    .querySelectorAll('a') : el.querySelectorAll('a');

  const inner = el.querySelector(':scope > div:not([class])');
  inner.classList.add(`consonant-${podType}-inner`);
  const title = createTitle(titles, podType);
  const description = createDescription(rows, podType, inner);

  inner.prepend(title);
  inner.append(description);
  addFooter(links, inner, merchPod);
  decorateFooter(el, podType);
  merchPod.append(inner);
};

const decorateRibbon = (el, podType) => {
  const ribbonMetadata = el.querySelectorAll('div > div[data-align="center"][data-valign="middle"]');

  if (ribbonMetadata.length >= 2) {
    const ribbonStyle = ribbonMetadata[0].outerText;
    const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
    if (!ribbonStyleRegex.test(ribbonStyle)) return;
    const [ribbonBgColor, ribbonTextColor] = ribbonStyle.split(', ');
    const ribbonWrapper = ribbonMetadata[0].parentNode;
    const ribbon = ribbonMetadata[1];
    ribbon.classList.add(`consonant-${podType}-ribbon`);
    ribbon.style.backgroundColor = ribbonBgColor;
    ribbon.style.color = ribbonTextColor;
    const picture = el.querySelector(`.consonant-${podType}-img`);
    if (picture) {
      picture.insertAdjacentElement('afterend', ribbon);
    } else {
      el.insertAdjacentElement('beforeend', ribbon);
    }
    ribbonWrapper.remove();
  }
};

const decorateIcon = (el, icons, podType) => {
  const inner = el.querySelector(`.consonant-${podType}-inner`);
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add(`consonant-${podType}-iconWrapper`);
  icons.forEach((icon) => {
    const url = icon.querySelector('img').src;
    const iconDiv = document.createElement('div');
    iconDiv.style.backgroundImage = `url(${url})`;
    iconDiv.classList.add('consonant-MerchCard-ProductIcon');
    iconWrapper.appendChild(iconDiv);
    icon.parentNode?.remove();
  });
  inner.prepend(iconWrapper);
};

const init = (el) => {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  decorateLinkAnalytics(el, headings);
  loadStyle(`${base}/deps/caas.css`);
  const section = el.closest('.section');
  section.classList.add('milo-card-section');
  const images = el.querySelectorAll('picture');
  let image;
  const icons = [];
  let row = el.querySelector(':scope > div');
  if (row.children.length >= 2) {
    row = el.querySelectorAll(':scope > *')[1];
  }
  const allPElems = row.querySelectorAll('p');
  const ctas = allPElems[allPElems.length - 1];
  const styles = Array.from(el.classList);
  const podType = getPodType(styles);
  const merchPod = el;
  images.forEach((img) => {
    const imgNode = img.querySelector('img');
    const width = imgNode.width;
    const height = imgNode.height;
    const isSquare = Math.abs(width - height) <= 10;
    if (img) {
      if (isSquare) {
        icons.push(img);
      } else {
        image = img;
      }
    }
  });
  addWrapper(el, section, podType);
  merchPod.classList.add('consonant-Card', 'consonant-ProductCard');
  if (image) {
    addBackgroundImg(image, podType, merchPod);
  }
  decorateRibbon(el, podType);
  image?.parentElement.remove();
  addInner(el, podType, merchPod);
  decorateIcon(el, icons, podType);
  decorateButtons(ctas);

  const inner = el.querySelector(`.consonant-${podType}-inner`);
  const innerCleanup = inner.querySelectorAll(':scope > div')[1];
  if (innerCleanup.classList.length === 0) {
    innerCleanup.remove();
  }
};

export default init;
