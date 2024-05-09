import { decorateButtons, decorateBlockHrs } from '../../utils/decorate.js';
import { getConfig, createTag, loadStyle } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import { processTrackingLabels } from '../../martech/attributes.js';
import { replaceKey } from '../../features/placeholders.js';
import '../../deps/merch-card.js';

const TAG_PATTERN = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-].*$/;

const CARD_TYPES = ['segment', 'special-offers', 'plans', 'catalog', 'product', 'inline-heading', 'image', 'mini-compare-chart'];

const CARD_SIZES = ['wide', 'super-wide'];

const TEXT_STYLES = {
  H5: 'detail-m',
  H4: 'body-xxs',
  H3: 'heading-xs',
  H2: 'heading-m',
};

const HEADING_MAP = {
  'special-offers': {
    H5: 'H4',
    H3: 'H3',
  },
};

const MINI_COMPARE_CHART = 'mini-compare-chart';

const MULTI_OFFER_CARDS = ['plans', 'product', MINI_COMPARE_CHART];
// Force cards to refresh once they become visible so that the footer rows are properly aligned.
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.clientHeight === 0) return;
    intersectionObserver.unobserve(entry.target);
    entry.target.requestUpdate();
  });
});

const getPodType = (styles) => styles?.find((style) => CARD_TYPES.includes(style));

const isHeadingTag = (tagName) => /^H[2-5]$/.test(tagName);
const isParagraphTag = (tagName) => tagName === 'P';

const appendSlot = (slotEls, slotName, merchCard) => {
  if (slotEls.length === 0 && merchCard.variant !== MINI_COMPARE_CHART) return;
  const newEl = createTag(
    'p',
    { slot: slotName, class: slotName },
  );
  slotEls.forEach((e) => {
    newEl.innerHTML += e.innerHTML;
  });
  merchCard.append(newEl);
};

export async function loadMnemonicList(foreground) {
  try {
    const { base } = getConfig();
    const stylePromise = new Promise((resolve) => {
      loadStyle(`${base}/blocks/mnemonic-list/mnemonic-list.css`, resolve);
    });
    const loadModule = import(`${base}/blocks/mnemonic-list/mnemonic-list.js`)
      .then(({ decorateMnemonicList }) => decorateMnemonicList(foreground));
    await Promise.all([stylePromise, loadModule]);
  } catch (err) {
    window.lana?.log(`Failed to load mnemonic list module: ${err}`);
  }
}

const parseContent = async (el, merchCard) => {
  let bodySlotName = `body-${merchCard.variant !== MINI_COMPARE_CHART ? 'xs' : 'm'}`;
  let headingMCount = 0;

  if (merchCard.variant === MINI_COMPARE_CHART) {
    bodySlotName = 'body-m';
    const promoText = el.querySelectorAll('h5');
    const priceSmallType = el.querySelectorAll('h6');
    appendSlot(promoText, 'promo-text', merchCard);
    appendSlot(priceSmallType, 'price-commitment', merchCard);
  }

  let headingSize = 3;
  const bodySlot = createTag('div', { slot: bodySlotName });
  const mnemonicList = el.querySelector('.mnemonic-list');
  if (mnemonicList) {
    await loadMnemonicList(mnemonicList);
  }
  const innerElements = [
    ...el.querySelectorAll('h2, h3, h4, h5, p, ul, em'),
  ];
  innerElements.forEach((element) => {
    let { tagName } = element;
    if (isHeadingTag(tagName)) {
      let slotName = TEXT_STYLES[tagName];
      if (slotName) {
        if (['H2', 'H3', 'H4', 'H5'].includes(tagName)) {
          if (HEADING_MAP[merchCard.variant]?.[tagName]) {
            tagName = HEADING_MAP[merchCard.variant][tagName];
          } else {
            if (tagName === 'H2') {
              headingMCount += 1;
            }
            if (headingMCount === 2 && merchCard.variant === MINI_COMPARE_CHART) {
              slotName = 'heading-m-price';
            }
            tagName = `H${headingSize}`;
            headingSize += 1;
          }
        }
        element.setAttribute('slot', slotName);
        const newElement = createTag(tagName);
        Array.from(element.attributes).forEach((attr) => {
          newElement.setAttribute(attr.name, attr.value);
        });
        newElement.innerHTML = element.innerHTML;
        merchCard.append(newElement);
      }
      return;
    }
    if (isParagraphTag(tagName)) {
      bodySlot.append(element);
      merchCard.append(bodySlot);
    }
    if (mnemonicList) bodySlot.append(mnemonicList);
  });

  if (merchCard.variant === MINI_COMPARE_CHART && merchCard.childNodes[1]) {
    merchCard.insertBefore(bodySlot, merchCard.childNodes[1]);
  }
};

const getBadgeStyle = (badgeMetadata) => {
  const badgeStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+$/;
  if (!badgeStyleRegex.test(badgeMetadata[0]?.innerText)) return null;
  const style = badgeMetadata[0].innerText;
  const badgeBackgroundColor = style.split(',')[0].trim();
  const badgeColor = style.split(',')[1].trim();
  const badgeWrapper = badgeMetadata[0].parentNode;
  const badgeText = badgeMetadata[1].innerText;
  badgeWrapper.remove();
  return { badgeBackgroundColor, badgeColor, badgeText };
};

const getActionMenuContent = (el) => {
  const actionMenuContentWrapper = [...el.children].find((child) => child.querySelector('ul') && child.querySelector('h2') === null);
  if (!actionMenuContentWrapper) return undefined;
  actionMenuContentWrapper.remove();
  return actionMenuContentWrapper?.firstElementChild;
};

const extractTags = (container) => [...container.querySelectorAll('p')]
  .map((tag) => tag.innerText?.trim())
  .filter((item) => TAG_PATTERN.test(item))
  .reduce((acc, item) => {
    const [, tag] = item.split(':');
    if (!tag) return acc;
    const parts = tag.split('/');
    if (!acc[parts[0]]) return acc;
    acc[parts[0]].push(parts.pop());
    return acc;
  }, { categories: ['all'], types: [] });

const addMerchCardGridIfMissing = (section, cardType) => {
  const el = section?.querySelector('.section-metadata');
  const directSection = section?.parentElement?.tagName === 'MAIN';
  if (el) {
    const metadata = getMetadata(el);
    let styleClasses = [];
    styleClasses = metadata?.style?.text?.split(',').map((token) => token.split(' ').join('-')) ?? [];
    if (!styleClasses.some((styleClass) => /-merch-card/.test(styleClass))) {
      if (styleClasses.some((styleClass) => /-up/.test(styleClass) || directSection)) {
        section.classList.add('three-merch-cards', cardType);
      }
    }
    section.classList.add(cardType);
    return true;
  }
  if (directSection) {
    section.classList.add('three-merch-cards', cardType);
  }
  return false;
};

const decorateMerchCardLinkAnalytics = (el) => {
  [...el.querySelectorAll('a')].forEach((link, index) => {
    const heading = el.querySelector('h3');
    const linkText = `${processTrackingLabels(link.textContent)}-${index + 1}`;
    const headingText = heading ? `${processTrackingLabels(heading.textContent)}` : '';
    const analyticsString = heading ? `${linkText}--${headingText}` : linkText;
    link.setAttribute('daa-ll', analyticsString);
  });
};

const addStock = (merchCard, styles) => {
  if (styles.includes('add-stock')) {
    let stock;
    const selector = styles.includes('edu') ? '.merch-offers.stock.edu > *' : '.merch-offers.stock > *';
    const [label, ...rest] = [...document.querySelectorAll(selector)];
    if (label) {
      const offers = rest.filter(({ dataset: { wcsOsi } }) => wcsOsi);
      stock = { label: label?.innerText, offers: offers?.map((offer) => offer.dataset.wcsOsi).join(',') };
    }
    if (stock !== undefined) {
      merchCard.setAttribute('checkbox-label', stock.label);
      merchCard.setAttribute('stock-offer-osis', stock.offers);
    }
  }
};

const simplifyHrs = (el) => {
  const hrs = el.querySelectorAll('hr');
  hrs.forEach((hr) => {
    if (hr.parentElement.tagName === 'P') {
      hr.parentElement.replaceWith(hr);
    }
  });
};

async function extractQuantitySelect(el) {
  const quantitySelectConfig = el.querySelector('ul');
  if (!quantitySelectConfig) return null;
  const configMarkup = quantitySelectConfig.querySelector('li');
  if (!configMarkup || !configMarkup.textContent.includes('Quantity')) return null;
  const config = configMarkup.querySelector('ul').querySelectorAll('li');
  if (config.length !== 2) return null;
  const attributes = {};
  attributes.title = config[0].textContent.trim();
  const values = config[1].textContent.split(',')
    .map((value) => value.trim())
    .filter((value) => /^\d*$/.test(value))
    .map((value) => (value === '' ? undefined : Number(value)));
  if (![3, 4, 5].includes(values.length)) return null;
  await import('../../deps/merch-quantity-select.js');
  [attributes.min, attributes.max, attributes.step, attributes['default-value'], attributes['max-input']] = values;
  const quantitySelect = createTag('merch-quantity-select', attributes);
  quantitySelectConfig.remove();
  return quantitySelect;
}

const getMiniCompareChartFooterRows = (el) => {
  let footerRows = Array.from(el.children).slice(1);
  footerRows = footerRows.filter((row) => !row.querySelector('.footer-row-cell'));
  if (footerRows[0].firstElementChild.innerText === 'Alt-cta') {
    footerRows.splice(0, 2);
  }
  footerRows.forEach((row) => row.remove());
  return footerRows;
};

const decorateFooterRows = (merchCard, footerRows) => {
  if (footerRows) {
    const footerRowsSlot = createTag('div', { slot: 'footer-rows' });
    footerRows.forEach((row) => {
      const rowIcon = row.firstElementChild.querySelector('picture');
      const rowText = row.querySelector('div > div:nth-child(2)').innerHTML;
      const rowTextParagraph = createTag('div', { class: 'footer-row-cell-description' }, rowText);
      const footerRowCell = createTag('div', { class: 'footer-row-cell' });
      if (rowIcon) {
        rowIcon.classList.add('footer-row-icon');
        footerRowCell.appendChild(rowIcon);
      }
      footerRowCell.appendChild(rowTextParagraph);
      footerRowsSlot.appendChild(footerRowCell);
    });
    merchCard.appendChild(footerRowsSlot);
  }
};

const setMiniCompareOfferSlot = (merchCard, offers) => {
  if (merchCard.variant !== MINI_COMPARE_CHART) return;
  const miniCompareOffers = merchCard.querySelector('div[slot="offers"]');
  if (offers) {
    miniCompareOffers.append(offers);
  } else {
    miniCompareOffers.appendChild(createTag('p'));
  }
  merchCard.appendChild(miniCompareOffers);
};

const init = async (el) => {
  const styles = [...el.classList];
  const cardType = getPodType(styles) || 'product';
  if (!styles.includes(cardType)) {
    styles.push(cardType);
  }
  let section = el.closest('.section');
  if (section) {
    const merchCards = addMerchCardGridIfMissing(section, cardType);
    if (!merchCards) {
      if (section?.parentElement.classList.contains('fragment')) {
        const fragment = section.parentElement;
        const fragmentParent = fragment.parentElement;
        section.style.display = 'contents';
        fragment.style.display = 'contents';
        fragmentParent.style.display = fragmentParent.classList.contains('nested')
          ? fragmentParent.style.display
          : 'contents';
        section = fragmentParent.parentElement;
        addMerchCardGridIfMissing(section, cardType);
      }
    }
  }
  const merchCard = createTag('merch-card', { class: styles.join(' '), 'data-block': '' });
  merchCard.setAttribute('variant', cardType);
  merchCard.setAttribute('size', styles.find((style) => CARD_SIZES.includes(style)) || '');
  if (el.dataset.removedManifestId) {
    merchCard.dataset.removedManifestId = el.dataset.removedManifestId;
  }
  let tags = {};
  if (el.lastElementChild?.previousElementSibling?.querySelector('h3,h4,h5,h6')) {
    // tag section is available
    const nameSelector = 'h3,h4,h5,h6';
    const nameEl = el.lastElementChild.querySelector(nameSelector);
    if (nameEl) {
      merchCard.setAttribute('name', nameEl.textContent?.trim());
      nameEl.remove();
    }
    tags = extractTags(el.lastElementChild);
    if (tags.categories?.length > 1 || tags.types?.length > 0) {
    // this div contains tags, remove it from further processing.
      el.lastElementChild.remove();
    }
  }
  const { categories = ['all'], types = [] } = tags;
  if (el.firstElementChild) {
    const badgeMetadata = el.firstElementChild.querySelector('ul,h2') === null
  && el.firstElementChild.innerText.includes('#') ? el.firstElementChild : null;
    if (badgeMetadata !== null) {
      const badge = getBadgeStyle(badgeMetadata.children);
      if (badge !== null) {
        merchCard.setAttribute(
          'badge-background-color',
          badge.badgeBackgroundColor,
        );
        merchCard.setAttribute('badge-color', badge.badgeColor);
        merchCard.setAttribute('badge-text', badge.badgeText);
      }
    }
  }
  let footerRows;
  if (cardType === MINI_COMPARE_CHART) {
    intersectionObserver.observe(merchCard);
    footerRows = getMiniCompareChartFooterRows(el);
  }
  const allPictures = el.querySelectorAll('picture');
  const pictures = Array.from(allPictures).filter((picture) => !picture.closest('.mnemonic-list'));
  let image;
  const icons = [];
  pictures.forEach((img) => {
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
  const actionMenuContent = cardType === 'catalog'
    ? getActionMenuContent(el)
    : null;
  if (actionMenuContent) {
    merchCard.setAttribute('action-menu', true);
    merchCard.append(
      createTag(
        'div',
        { slot: 'action-menu-content' },
        actionMenuContent.innerHTML,
      ),
    );
  }
  let ctas = el.querySelector('p > strong a, p > em a')?.closest('p');
  if (!ctas) {
    const candidate = el.querySelector('p:last-of-type');
    if (candidate?.querySelector('a')) {
      ctas = candidate;
    }
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
    merchCard.setAttribute(
      'icons',
      JSON.stringify(Array.from(iconImgs)),
    );
    icons.forEach((icon) => icon.remove());
  }

  addStock(merchCard, styles);
  if (styles.includes('secure')) {
    await replaceKey('secure-transaction', getConfig()).then((key) => merchCard.setAttribute('secure-label', key));
  }
  merchCard.setAttribute('filters', categories.join(','));
  merchCard.setAttribute('types', types.join(','));
  parseContent(el, merchCard);
  const footer = createTag('div', { slot: 'footer' });
  if (ctas) {
    if (merchCard.variant === 'mini-compare-chart') {
      decorateButtons(ctas, 'button-l');
    } else {
      decorateButtons(ctas);
    }
    footer.append(ctas);
  }
  merchCard.appendChild(footer);

  if (MULTI_OFFER_CARDS.includes(cardType)) {
    if (merchCard.variant === MINI_COMPARE_CHART) {
      const miniCompareOffers = createTag('div', { slot: 'offers' });
      merchCard.append(miniCompareOffers);
    }
    const quantitySelect = await extractQuantitySelect(el, cardType);
    const offerSelection = el.querySelector('ul');
    if (offerSelection) {
      const { initOfferSelection } = await import('./merch-offer-select.js');
      setMiniCompareOfferSlot(merchCard, undefined);
      initOfferSelection(merchCard, offerSelection, quantitySelect);
    }
    if (quantitySelect) {
      if (merchCard.variant === MINI_COMPARE_CHART) {
        setMiniCompareOfferSlot(merchCard, quantitySelect);
      } else {
        const bodySlot = merchCard.querySelector('div[slot="body-xs"]');
        bodySlot.append(quantitySelect);
      }
    }
  }
  decorateBlockHrs(merchCard);
  simplifyHrs(merchCard);
  if (merchCard.classList.contains('has-divider')) {
    merchCard.setAttribute('custom-hr', true);
  }
  decorateFooterRows(merchCard, footerRows);
  el.replaceWith(merchCard);
  decorateMerchCardLinkAnalytics(merchCard);
  return merchCard;
};

export default init;
