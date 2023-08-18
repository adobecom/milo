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
const SECURE_TRANSACTION_IMG = `<img class="secure-transaction-icon-img" loading="lazy" alt="secure-transaction-icon icon" src="${base}/blocks/merch-card/img/secure-transaction-icon.svg" height="12" width="15">`;

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
  const descriptionWrapper = createTag('div');
  descriptionWrapper.classList.add(`consonant-${cardType}-description`);
  descriptions?.forEach((description) => {
    descriptionWrapper.appendChild(description);
  });
  return descriptionWrapper;
};

const createTitle = (titles, cardType) => {
  const titleWrapper = createTag('div');
  titleWrapper.classList.add(`consonant-${cardType}-title`);
  titles?.forEach((title) => titleWrapper.appendChild(title));
  return titleWrapper;
};

const decorateFooter = (el, cardType) => {
  const cardFooter = el.querySelector('.consonant-CardFooter');

  const decorateWithSecureTransactionSign = () => {
    const secureTransactionWrapper = createTag('div', { class: 'secure-transaction-wrapper' });
    const text = createTag('span', { class: 'secure-transaction-label' }, 'Secure transaction');
    const secureElement = createTag('span', { class: 'secure-transaction-icon' }, SECURE_TRANSACTION_IMG);
    secureTransactionWrapper.append(secureElement, text);
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

    const altCta = Array.from(el.querySelectorAll('div > div[data-align="center"][data-valign="middle"]')).filter((data) => data.textContent?.trim() === 'alt-cta');
    const altCtaMetaData = altCta[0]?.parentElement?.nextElementSibling?.querySelectorAll('div > div');
    const altCtaRegex = /href="([^"]*)"/g;
    if (altCtaMetaData?.length === 2 && altCtaMetaData[1]?.innerHTML?.match(altCtaRegex)) {
      const standardWrapper = createTag('div', { class: 'standard-wrapper' });
      const secureTransactionWrapper = decorateWithSecureTransactionSign();
      const cardFooterRow = el.querySelector('.consonant-CardFooter-row');
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
      standardWrapper.append(secureTransactionWrapper, cardFooterRow);
      cardFooter?.append(standardWrapper);
      altCta[0].parentNode.remove();
      altCtaMetaData[0].parentNode.remove();
    }
  };

  decorateAlternativeCta();
  cardFooter.querySelectorAll('.consonant-CardFooter-cell')
    .forEach((cell) => {
      cell.classList.add(`consonant-${cardType}-cell`);
    });
};

const addInner = (el, cardType, merchCard) => {
  const titles = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const rows = Array.from(el.querySelectorAll('p'));
  const styles = Array.from(el.classList);
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
  const ribbonMetadata = el.querySelectorAll('div > div[data-align="center"][data-valign="middle"]');

  if (ribbonMetadata.length >= 2) {
    const ribbonStyle = ribbonMetadata[0].outerText;
    const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
    if (!ribbonStyleRegex.test(ribbonStyle)) return;
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
  }
};

const decorateIcon = (el, icons, cardType) => {
  if (!icons) return;
  const inner = el.querySelector(`.consonant-${cardType}-inner`);
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add(`consonant-${cardType}-iconWrapper`);
  icons?.forEach((icon) => {
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
  if (image) {
    addBackgroundImg(image, cardType, merchCard);
  }
  decorateRibbon(el, cardType);
  image?.parentElement.remove();
  if (ctas) decorateButtons(ctas);
  addInner(el, cardType, merchCard);
  decorateIcon(el, icons, cardType);
  const inner = el.querySelector(`.consonant-${cardType}-inner`);
  const innerCleanup = inner.querySelectorAll(':scope > div')[1];
  if (innerCleanup.classList.length === 0) innerCleanup.remove();
    innerCleanup.remove();
  }
};

export default init;
