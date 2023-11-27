import { decorateButtons, decorateBlockHrs } from '../../utils/decorate.js';
import { createTag, getConfig } from '../../utils/utils.js';
import { getUpFromSectionMetadata } from '../card/cardUtils.js';
import { decorateLinkAnalytics } from '../../martech/attributes.js';
import { replaceKey } from '../../features/placeholders.js';
import '../../deps/commerce.js';
import '../../deps/merch-card.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const CARD_TYPES = ['segment', 'special-offers', 'plans', 'catalog', 'product', 'inline-heading'];
const MERCH_CARD_GRIDS = ['one-merch-card', 'two-merch-cards', 'three-merch-cards', 'four-merch-cards'];

const textStyles = {
  H5: 'detail-m',
  H4: 'body-xxs',
  H3: 'heading-xs',
  H2: 'heading-m',
};

const getPodType = (styles) => styles?.find((style) => CARD_TYPES.includes(style));

const checkBoxLabel = (ctas, altCtaMetaData) => {
  const altCtaRegex = /href=".*"/;
  if (!altCtaRegex.test(altCtaMetaData[1]?.innerHTML)) return null;
  const allButtons = ctas.querySelectorAll('a');
  const originalCtaButton = allButtons[allButtons.length - 1];
  const altCtaButtonData = altCtaMetaData[1];
  const altCtaButton = createTag('a', { class: [...originalCtaButton.classList, 'alt-cta', 'button--inactive'].join(' ') }, altCtaButtonData.textContent);
  originalCtaButton.classList.add('active');
  decorateButtons(altCtaButton);
  ctas.appendChild(altCtaButton);
  return altCtaMetaData[0].textContent;
};

const isHeadingTag = (tagName) => /^H[1-5]$/.test(tagName);
const isParagraphTag = (tagName) => tagName === 'P';

const createAndAppendTag = (tagName, attributes, content, parent) => {
  const newTag = createTag(tagName, attributes, content);
  parent.append(newTag);
  return newTag;
};

const parseContent = (el, altCta, cardType, merchCard) => {
  const innerElements = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul')];
  const bodySlot = createTag('div', { slot: 'body-xs' });

  innerElements.forEach((element) => {
    const { tagName } = element;
    if (isHeadingTag(tagName)) {
      createAndAppendTag(tagName, { slot: textStyles[tagName] }, element.innerHTML, merchCard);
      return;
    }
    if (isParagraphTag(tagName)) {
      bodySlot.append(element);
    }
  });
  merchCard.append(bodySlot);
};

const returnRibbonStyle = (ribbonMetadata) => {
  const ribbonStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
  if (!ribbonStyleRegex.test(ribbonMetadata[0]?.innerText)) return null;
  const style = ribbonMetadata[0].innerText;
  const badgeBackgroundColor = style.split(',')[0].trim();
  const badgeColor = style.split(',')[1].trim();
  const ribbonWrapper = ribbonMetadata[0].parentNode;
  const badgeText = ribbonMetadata[1].innerText;
  ribbonWrapper.remove();
  return { badgeBackgroundColor, badgeColor, badgeText };
};

const getActionMenuContent = (el, ribbonMetadata) => {
  const index = ribbonMetadata !== null ? 1 : 0;
  const expectedChildren = ribbonMetadata !== null ? 3 : 2;
  if (el.childElementCount !== expectedChildren) {
    return null;
  }
  const actionMenuContentWrapper = el.children[index];
  const actionMenuContent = actionMenuContentWrapper.children[0];
  actionMenuContentWrapper.remove();
  return actionMenuContent;
};

function getMerchCardRows(rows, ribbonMetadata, cardType, actionMenuContent) {
  const index = ribbonMetadata === null ? 0 : 1;
  if (cardType === 'catalog') {
    return actionMenuContent !== null ? rows[index + 1] : rows[index];
  }
  return rows[index];
}

function addMerchCardGridsIfMissing(section) {
  let styleClasses = [];
  const el = section.querySelector('.section-metadata');
  if (el) {
    const metadata = getMetadata(el);
    styleClasses = metadata?.style?.text?.split(',').map((token) => token.split(' ').join('-')) ?? [];
  }
  if (!MERCH_CARD_GRIDS.some((styleClass) => styleClasses.includes(styleClass))) {
    section.classList.add('three-merch-cards');
  }
}

const init = (el) => {
  let section = el.closest('.section');
  const upClass = getUpFromSectionMetadata(section);
  if (upClass) {
    import('./legacy-merch-card.js')
      .then((module) => {
        module.initLegacyMerchCard(el);
      });
  } else {
    if (section.parentElement.classList.contains('fragment')) {
      const fragment = section.parentElement;
      const fragmentParent = fragment.parentElement;
      section.style.display = 'contents';
      fragment.style.display = 'contents';
      fragmentParent.style.display = 'contents';
      section = fragmentParent.parentElement;
    }
    addMerchCardGridsIfMissing(section);
    const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
    decorateLinkAnalytics(el, headings);
    const images = el.querySelectorAll('picture');
    let image;
    const icons = [];
    const rows = el.querySelectorAll(':scope > *');
    const styles = [...el.classList];
    const cardType = getPodType(styles);
    const ribbonMetadata = rows[0].children?.length === 2 ? rows[0].children : null;
    const actionMenuContent = cardType === 'catalog' ? getActionMenuContent(el, ribbonMetadata) : null;
    const row = getMerchCardRows(rows, ribbonMetadata, cardType, actionMenuContent);
    const altCta = rows[rows.length - 1].children?.length === 2
      ? rows[rows.length - 1].children : null;
    const allPElems = row.querySelectorAll('p');
    const ctas = allPElems[allPElems.length - 1];
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

    const merchCard = createTag('merch-card', { class: el.className, variant: cardType });
    if (ribbonMetadata !== null) {
      const badge = returnRibbonStyle(ribbonMetadata);
      if (badge !== null) {
        merchCard.setAttribute('badge-background-color', badge.badgeBackgroundColor);
        merchCard.setAttribute('badge-color', badge.badgeColor);
        merchCard.setAttribute('badge-text', badge.badgeText);
      }
    }
    if (actionMenuContent !== null) {
      merchCard.setAttribute('action-menu', true);
      merchCard.append(createTag('div', { slot: 'action-menu-content' }, actionMenuContent.innerHTML));
    }
    if (ctas) {
      const footer = createTag('div', { slot: 'footer' });
      decorateButtons(ctas);
      footer.append(ctas);
      merchCard.appendChild(footer);
    }
    if (image !== undefined) {
      const imageSlot = createTag('div', { slot: 'bg-image' });
      imageSlot.appendChild(image);
      merchCard.appendChild(imageSlot);
    }
    if (!icons || icons.length > 0) {
      const iconImgs = Array.from(icons).map((icon) => {
        const img = {
          src: icon.querySelector('img').src,
          alt: icon.querySelector('img').alt,
        };
        return img;
      });
      merchCard.setAttribute('icons', JSON.stringify(Array.from(iconImgs)));
      icons.forEach((icon) => icon.remove());
    }
    if (styles.includes('secure')) {
      replaceKey('secure-transaction', getConfig())
        .then((key) => merchCard.setAttribute('secure-label', key));
    }
    if (altCta) {
      const label = checkBoxLabel(ctas, altCta);
      if (label !== null) {
        merchCard.setAttribute('checkbox-label', label);
      }
    }
    parseContent(el, altCta, cardType, merchCard);
    decorateBlockHrs(merchCard);
    if (merchCard.classList.contains('has-divider')) {
      merchCard.setAttribute('custom-hr', true);
    }
    el.replaceWith(merchCard);
  }
};

export default init;
