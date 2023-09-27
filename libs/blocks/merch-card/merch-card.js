/* eslint-disable prefer-destructuring */
import { decorateButtons, decorateBlockHrs } from '../../utils/decorate.js';
import { loadStyle, getConfig, createTag } from '../../utils/utils.js';
import { addBackgroundImg, addWrapper, addFooter } from '../card/cardUtils.js';
import { replaceKey } from '../../features/placeholders.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const SEGMENT_BLADE = 'SegmentBlade';
const SPECIAL_OFFERS = 'SpecialOffers';
const PLANS_CARD = 'PlansCard';
const cardTypes = {
  segment: SEGMENT_BLADE,
  'special-offers': SPECIAL_OFFERS,
  plans: PLANS_CARD,
};
const getPodType = (styles) => {
  const authoredType = styles?.find((style) => style in cardTypes);
  return cardTypes[authoredType] || SEGMENT_BLADE;
};

const decorateFooter = (el, altCtaMetaData, cardType) => {
  const cardFooter = el.querySelector('.consonant-CardFooter');
  const decorateWithSecureTransactionSign = () => {
    const secureTransactionWrapper = createTag('div', { class: 'secure-transaction-wrapper' });
    const label = createTag('span', { class: 'secure-transaction-label' });
    const secureElement = createTag('span', { class: 'secure-transaction-icon' });
    secureTransactionWrapper.append(secureElement, label);
    replaceKey('secure-transaction', getConfig()).then((replacedKey) => {
      label.textContent = replacedKey;
    });
    return secureTransactionWrapper;
  };

  const createCheckbox = (checkBoxText) => {
    const container = createTag('label', { class: 'checkbox-container' });
    const input = createTag('input', { id: 'alt-cta', type: 'checkbox' });
    const checkmark = createTag('span', { class: 'checkmark' });
    const label = createTag('span', { class: 'checkbox-label' }, checkBoxText.innerHTML);
    container.append(input, checkmark, label);
    return container;
  };

  const createSecureSign = () => {
    const cardFooterRow = el.querySelector('.consonant-CardFooter-row');
    const standardWrapper = createTag('div', { class: 'standard-wrapper' });
    const secureTransactionWrapper = decorateWithSecureTransactionSign();
    standardWrapper.append(secureTransactionWrapper, cardFooterRow);
    cardFooter?.append(standardWrapper);
  };

  const decorateAlternativeCta = () => {
    const altCtaRegex = /href=".*"/;
    if (!altCtaRegex.test(altCtaMetaData[1]?.innerHTML)) return;
    const cardFooterRow = el.querySelector('.consonant-CardFooter-row');
    const originalCtaButton = cardFooterRow.querySelector('.consonant-CardFooter-cell--right');
    const checkboxContainer = createCheckbox(altCtaMetaData[0]);
    const altCtaButtonData = altCtaMetaData[1];
    decorateButtons(altCtaButtonData);
    const altCtaButton = createTag('div', { class: originalCtaButton.classList }, altCtaButtonData.innerHTML);
    altCtaButton.classList.add('button--inactive');
    checkboxContainer.querySelector('input[type="checkbox"]').addEventListener('change', ({ target: { checked } }) => {
      originalCtaButton.classList.toggle('button--inactive', checked);
      altCtaButton.classList.toggle('button--inactive', !checked);
    });
    cardFooterRow.append(altCtaButton);
    cardFooter.prepend(checkboxContainer);
    altCtaMetaData[0].parentNode.remove();
  };
  if (altCtaMetaData !== null) decorateAlternativeCta();
  if (el.classList.contains('secure')) createSecureSign();
  cardFooter.querySelectorAll('.consonant-CardFooter-cell').forEach((cell) => cell.classList.add(`consonant-${cardType}-cell`));
};

const addInner = (el, altCta, cardType, merchCard) => {
  const innerElements = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul')];
  const styles = [...el.classList];
  const merch = styles.includes('merch-card');
  const pElement = merch && el.querySelector(':scope > div > div > p:last-of-type');
  const links = pElement ? pElement.querySelectorAll('a') : el.querySelectorAll('a');
  const list = el.querySelector('ul');

  const inner = el.querySelector(':scope > div:not([class])');
  inner.classList.add(`consonant-${cardType}-inner`);

  innerElements.forEach((element) => {
    if (element.tagName.match(/^H[1-6]$/)) element.classList.add(`consonant-${cardType}-title`);
    if (element.tagName.match(/^P$/)) element.classList.add(`consonant-${cardType}-description`);
    if (element.tagName.match(/^UL$/)) {
      list.classList.add(`consonant-${cardType}-list`);
      list.querySelectorAll('li').forEach((li) => li.classList.add(`consonant-${cardType}-list-item`));
    }
  });

  inner.append(...innerElements);
  addFooter(links, inner, cardType !== PLANS_CARD);
  decorateFooter(el, altCta, cardType);
  merchCard.append(inner);
};

const decorateRibbon = (el, ribbonMetadata, cardType) => {
  const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
  if (!ribbonStyleRegex.test(ribbonMetadata[0]?.innerText)) return;
  const ribbonStyle = ribbonMetadata[0].innerText;
  const [ribbonBgColor, ribbonTextColor] = ribbonStyle.split(', ');
  const ribbonWrapper = ribbonMetadata[0].parentNode;
  const ribbon = ribbonMetadata[1];
  ribbon.classList.add(`consonant-${cardType}-ribbon`);
  const borderStyle = `1px solid ${ribbonBgColor}`;
  if (el.classList.contains('evergreen')) {
    ribbon.style.border = borderStyle;
    ribbon.style.borderRight = 'none';
  } else {
    ribbon.style.backgroundColor = ribbonBgColor;
    el.style.border = borderStyle;
  }
  ribbon.style.color = ribbonTextColor;
  const picture = el.querySelector(`.consonant-${cardType}-img`);
  if (picture) {
    picture.insertAdjacentElement('afterend', ribbon);
  } else {
    el.insertAdjacentElement('beforeend', ribbon);
  }
  ribbonWrapper.remove();
};

const decorateIcon = (el, icons, cardType) => {
  if (!icons) return;
  const inner = el.querySelector(`.consonant-${cardType}-inner`);
  const iconWrapper = createTag('div', { class: `consonant-${cardType}-iconWrapper` });
  icons?.forEach((icon) => {
    const url = icon.querySelector('img').src;
    const iconDiv = createTag('div', { class: 'consonant-MerchCard-ProductIcon', style: `background-image: url(${url})` });
    iconWrapper.appendChild(iconDiv);
    icon.parentNode?.remove();
  });
  inner.prepend(iconWrapper);
};

const init = (el) => {
  loadStyle(`${base}/deps/caas.css`);
  const section = el.closest('.section');
  section.classList.add('milo-card-section');
  const images = el.querySelectorAll('picture');
  let image;
  const icons = [];
  const rows = el.querySelectorAll(':scope > *');
  const ribbonMetadata = rows[0].children?.length === 2 ? rows[0].children : null;
  const row = rows[ribbonMetadata === null ? 0 : 1];
  const altCta = rows[rows.length - 1].children?.length === 2
    ? rows[rows.length - 1].children : null;
  const allPElems = row.querySelectorAll('p');
  const ctas = allPElems[allPElems.length - 1];
  const styles = [...el.classList];
  const cardType = getPodType(styles);
  const merchCard = el;
  decorateBlockHrs(el);
  images.forEach((img) => {
    const imgNode = img.querySelector('img');
    const { width, height } = imgNode;
    const isSquare = Math.abs(width - height) <= 10;
    if (img) {
      if (isSquare) {
        icons.push(img);
      } else {
        image = img;
      }
    }
  });
  addWrapper(el, section, cardType);
  merchCard.classList.add('consonant-Card', 'consonant-ProductCard', `consonant-${cardType}`);
  if (image) addBackgroundImg(image, cardType, merchCard);
  if (ribbonMetadata !== null) decorateRibbon(el, ribbonMetadata, cardType);
  image?.parentElement.remove();
  if (ctas) decorateButtons(ctas);
  addInner(el, altCta, cardType, merchCard);
  decorateIcon(el, icons, cardType);
  const inner = el.querySelector(`.consonant-${cardType}-inner`);
  const innerCleanup = inner.querySelectorAll(':scope > div')[1];
  if (innerCleanup.classList.length === 0) innerCleanup.remove();
};

export default init;
