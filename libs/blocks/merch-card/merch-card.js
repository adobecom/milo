/* eslint-disable prefer-destructuring */
import { decorateButtons } from '../../utils/decorate.js';
import { loadStyle, getConfig, createTag } from '../../utils/utils.js';
import { addBackgroundImg, addWrapper, addFooter } from '../card/cardUtils.js';
import { decorateLinkAnalytics } from '../../martech/attributes.js';
import { replaceKey } from '../../features/placeholders.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const SEGMENT_BLADE = 'SegmentBlade';
const SPECIAL_OFFERS = 'SpecialOffers';
const PLANS_CARD = 'PlansCard';

const getPodType = (styles) => {
  const cardTypes = {
    segment: SEGMENT_BLADE,
    'special-offers': SPECIAL_OFFERS,
    plans: PLANS_CARD,
  };
  const authoredType = styles?.find((style) => style in cardTypes);
  return cardTypes[authoredType] || SEGMENT_BLADE;
};

const createDescription = (rows, cardType) => {
  const descriptions = rows.slice(0, rows.length - 1);
  const descriptionWrapper = createTag('div', { class: `consonant-${cardType}-description` });
  descriptions?.forEach((description) => descriptionWrapper.appendChild(description));
  return descriptionWrapper;
};

const createTitle = (titles, cardType) => {
  const titleWrapper = createTag('div', { class: `consonant-${cardType}-title` });
  titles?.forEach((title) => titleWrapper.appendChild(title));
  return titleWrapper;
};

const decorateFooter = (el, cardType) => {
  const cardFooter = el.querySelector('.consonant-CardFooter');
  const replacePlaceHolder = async (key, defaultValue) => {
    const replacedKey = await replaceKey(key, getConfig(), defaultValue);
    if (typeof replacedKey === 'string') {
      return replacedKey;
    }
    return { replacedKey };
  };
  const decorateWithSecureTransactionSign = () => {
    const secureTransactionWrapper = createTag('div', { class: 'secure-transaction-wrapper' });
    replacePlaceHolder('secure-transaction').then(({ replacedKey }) => {
      const label = createTag('span', { class: 'secure-transaction-label' }, replacedKey);
      const secureElement = createTag('span', { class: 'secure-transaction-icon' });
      secureTransactionWrapper.append(secureElement, label);
    });
    return secureTransactionWrapper;
  };

  const createCheckbox = (checkBoxText) => {
    cardFooter.querySelector('hr')?.remove();
    const container = createTag('label', { class: 'checkbox-container' });
    const input = createTag('input', { id: 'alt-cta', type: 'checkbox' });
    const checkmark = createTag('span', { class: 'checkmark' });
    const label = createTag('span', { class: 'checkbox-label' }, checkBoxText.innerHTML);
    container.append(input, checkmark, label);
    return container;
  };

  const decorateAlternativeCta = () => {
    const toggleButtonActiveState = (buttonToAdd, buttonToRemove) => {
      buttonToAdd.classList.add('button--inactive');
      buttonToRemove.classList.remove('button--inactive');
    };
    const cardFooterRow = el.querySelector('.consonant-CardFooter-row');
    if ([...el.classList].includes('secure')) {
      const standardWrapper = createTag('div', { class: 'standard-wrapper' });
      const secureTransactionWrapper = decorateWithSecureTransactionSign();
      standardWrapper.append(secureTransactionWrapper, cardFooterRow);
      cardFooter?.append(standardWrapper);
    }

    const altCta = [...el.querySelectorAll('.merch-card > div > div')].filter((div) => div.textContent?.trim() === 'alt-cta');
    const altCtaMetaData = altCta[0]?.parentElement?.nextElementSibling?.querySelectorAll('div > div');
    const altCtaRegex = /href="([^"]*)"/g;
    if (altCtaMetaData?.length !== 2 || !altCtaMetaData[1]?.innerHTML?.match(altCtaRegex)) return;
    const originalCtaButton = cardFooterRow.querySelector('.consonant-CardFooter-cell--right');
    const altCtaButton = originalCtaButton.cloneNode(true);
    const checkboxContainer = createCheckbox(altCtaMetaData[0]);

    altCtaButton.innerHTML = altCtaMetaData[1].innerHTML;
    altCtaButton.classList.add('button--inactive');
    checkboxContainer.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
      if (event.target.checked) {
        toggleButtonActiveState(originalCtaButton, altCtaButton);
      } else {
        toggleButtonActiveState(altCtaButton, originalCtaButton);
      }
    });
    cardFooterRow.append(altCtaButton);
    cardFooter.prepend(checkboxContainer);
    altCta[0].parentNode.remove();
    altCtaMetaData[0].parentNode.remove();
  };

  decorateAlternativeCta();
  cardFooter.querySelectorAll('.consonant-CardFooter-cell').forEach((cell) => cell.classList.add(`consonant-${cardType}-cell`));
};

const addInner = (el, cardType, merchCard) => {
  const titles = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const rows = [...el.querySelectorAll('p')];
  const styles = [...el.classList];
  const merch = styles.includes('merch-card');
  const pElement = merch && el.querySelector(':scope > div > div > p:last-of-type');
  const links = pElement ? pElement.querySelectorAll('a') : el.querySelectorAll('a');

  const inner = el.querySelector(':scope > div:not([class])');
  inner.classList.add(`consonant-${cardType}-inner`);
  const title = createTitle(titles, cardType);
  const description = createDescription(rows, cardType, inner);

  inner.prepend(title);
  inner.append(description);
  addFooter(links, inner, merchCard);
  decorateFooter(el, cardType);
  merchCard.append(inner);
};

const decorateRibbon = (el, cardType) => {
  const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
  [...el.querySelectorAll('div')].forEach((div) => {
    const ribbonMetadata = div.querySelectorAll('div');
    if (ribbonMetadata.length !== 2 || !ribbonStyleRegex.test(ribbonMetadata[0]?.innerText)) return;
    const ribbonStyle = ribbonMetadata[0].innerText;
    const [ribbonBgColor, ribbonTextColor] = ribbonStyle.split(', ');
    const ribbonWrapper = ribbonMetadata[0].parentNode;
    const ribbon = ribbonMetadata[1];
    ribbon.classList.add(`consonant-${cardType}-ribbon`);
    ribbon.style.backgroundColor = ribbonBgColor;
    ribbon.style.color = ribbonTextColor;
    el.style.border = `1px solid ${ribbonBgColor}`;
    const picture = el.querySelector(`.consonant-${cardType}-img`);
    if (picture) {
      picture.insertAdjacentElement('afterend', ribbon);
    } else {
      el.insertAdjacentElement('beforeend', ribbon);
    }
    ribbonWrapper.remove();
  });
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
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  decorateLinkAnalytics(el, headings);
  loadStyle(`${base}/deps/caas.css`);
  const section = el.closest('.section');
  section.classList.add('milo-card-section');
  const images = el.querySelectorAll('picture');
  let image;
  const icons = [];
  let row = el.querySelector(':scope > div');
  if (row.children.length >= 2) row = el.querySelectorAll(':scope > *')[1];
  const allPElems = row.querySelectorAll('p');
  const ctas = allPElems[allPElems.length - 1];
  const styles = [...el.classList];
  const cardType = getPodType(styles);
  const merchCard = el;
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
  addWrapper(el, section, cardType);
  merchCard.classList.add('consonant-Card', 'consonant-ProductCard', `consonant-${cardType}`);
  if (image) addBackgroundImg(image, cardType, merchCard);
  decorateRibbon(el, cardType);
  image?.parentElement.remove();
  if (ctas) decorateButtons(ctas);
  addInner(el, cardType, merchCard);
  decorateIcon(el, icons, cardType);
  const inner = el.querySelector(`.consonant-${cardType}-inner`);
  const innerCleanup = inner.querySelectorAll(':scope > div')[1];
  if (innerCleanup.classList.length === 0) innerCleanup.remove();
};

export default init;
