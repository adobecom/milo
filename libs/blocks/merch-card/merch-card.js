import { decorateButtons, decorateBlockHrs } from '../../utils/decorate.js';
import { getConfig, createTag, loadStyle, getMetadata as getGlobalMetadata } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import { processTrackingLabels } from '../../martech/attributes.js';
import {
  initService,
  loadLitDependency,
  loadMasComponent,
  MAS_MERCH_CARD,
  MAS_MERCH_QUANTITY_SELECT,
  MAS_MERCH_OFFER_SELECT,
} from '../merch/merch.js';

const TAG_PATTERN = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-].*$/;

const SEGMENT = 'segment';
const SPECIAL_OFFERS = 'special-offers';
const PLANS = 'plans';
const CATALOG = 'catalog';
const PRODUCT = 'product';
const MINI_COMPARE_CHART = 'mini-compare-chart';
const TWP = 'twp';
const CARD_TYPES = [
  SEGMENT,
  SPECIAL_OFFERS,
  PLANS,
  CATALOG,
  PRODUCT,
  'inline-heading',
  'image',
  MINI_COMPARE_CHART,
  TWP,
];

const CARD_SIZES = ['wide', 'super-wide'];

const SLOT_MAP_DEFAULT = {
  H5: 'promo-text',
  H4: 'body-xxs',
  H3: 'heading-xs',
  H2: 'heading-m',
};

const SLOT_MAP = { 'special-offers': { H5: 'detail-m' } };

const HEADING_MAP = {
  'special-offers': {
    H5: 'H4',
    H3: 'H3',
  },
};

const INNER_ELEMENTS_SELECTOR = 'h2, h3, h4, h5, h6, p, ul, em';

const MULTI_OFFER_CARDS = [PLANS, PRODUCT, MINI_COMPARE_CHART, TWP];
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

const appendSlot = (slotEls, slotName, merchCard, nodeName = 'p') => {
  if (slotEls.length === 0 || merchCard.variant !== MINI_COMPARE_CHART) return;
  const newEl = createTag(
    nodeName,
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
      /* c8 ignore next */
      loadStyle(`${base}/blocks/mnemonic-list/mnemonic-list.css`, resolve);
    });
    const loadModule = import(`${base}/blocks/mnemonic-list/mnemonic-list.js`)
      .then(({ decorateMnemonicList }) => decorateMnemonicList(foreground));
    await Promise.all([stylePromise, loadModule]);
  } catch (err) {
    window.lana?.log(`Failed to load mnemonic list module: ${err}`);
  }
}

function extractQuantitySelect(el, merchCard) {
  const attributes = {};
  const quantitySelectLink = merchCard?.querySelector('a[href*="#qs"]');
  if (quantitySelectLink) {
    const str = quantitySelectLink.getAttribute('href');
    attributes.title = quantitySelectLink.textContent.trim();
    const regex = /min=(\d+)&max=(\d+)&step=(\d+)&default=(\d+)&max-input=(\d+)/;
    [, attributes.min, attributes.max, attributes.step, attributes['default-value'], attributes['max-input']] = str.match(regex);
    quantitySelectLink.parentElement.remove();
  } else { // todo: old approach, remove once backwards compatibility is no longer required
    const quantitySelectConfig = [...el.querySelectorAll('ul')]
      .find((ul) => ul.querySelector('li')?.innerText?.includes('Quantity'));
    const configMarkup = quantitySelectConfig?.querySelector('ul');
    if (configMarkup?.children?.length !== 2) return null;
    const config = configMarkup.children;
    attributes.title = config[0].textContent.trim();
    const values = config[1].textContent.split(',')
      .map((value) => value.trim())
      .filter((value) => /^\d*$/.test(value))
      .map((value) => (value === '' ? undefined : Number(value)));
    quantitySelectConfig.remove();
    [attributes.min, attributes.max, attributes.step, attributes['default-value'], attributes['max-input']] = values;
  }
  if (!attributes.min || !attributes.max || !attributes.step) {
    return null;
  }
  loadMasComponent(MAS_MERCH_QUANTITY_SELECT);
  return createTag('merch-quantity-select', attributes);
}

const parseTwpContent = async (el, merchCard) => {
  const quantitySelect = extractQuantitySelect(el);
  if (quantitySelect) {
    merchCard.append(quantitySelect);
  }
  let allElements = el?.children[0]?.children[0]?.children;
  if (!allElements?.length) return;
  allElements = [...allElements];
  const contentGroups = allElements.reduce((acc, curr) => {
    if (curr.tagName.toLowerCase() === 'p' && curr.textContent.trim() === '--') {
      acc.push([]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, [[]]);

  contentGroups.forEach((group, index) => {
    if (index === 0) { // Top section
      const headings = group.filter((e) => e.tagName.toLowerCase() === 'h3');
      const topBody = group.filter((e) => e.tagName.toLowerCase() === 'p');
      appendSlot(headings, 'heading-xs', merchCard);
      appendSlot(topBody, 'body-xs-top', merchCard);
    } else if (index === 1) { // Body section
      const content = group.filter((e) => e.tagName.toLowerCase() === 'p' || e.tagName.toLowerCase() === 'ul');
      const bodySlot = createTag('div', { slot: 'body-xs' }, content);
      merchCard.append(bodySlot);

      const whatsIncludedLink = bodySlot.querySelector('a[href*="merch-whats-included"]');
      if (whatsIncludedLink) {
        whatsIncludedLink.classList.add('merch-whats-included');
      }
    } else if (index === 2) { // Footer section
      const footerContent = group.filter((e) => ['h5', 'p'].includes(e.tagName.toLowerCase()));
      const footer = createTag('div', { slot: 'footer' }, footerContent);
      merchCard.append(footer);
    }
  });

  const offerSelection = el.querySelector('ul');
  if (offerSelection) {
    const { initOfferSelection } = await import('./merch-offer-select.js');
    await initOfferSelection(merchCard, offerSelection);
  }
};

const appendPaymentDetails = (element, merchCard) => {
  if (element.firstChild?.nodeType !== Node.TEXT_NODE) return;
  const paymentDetails = createTag('div', { class: 'payment-details' }, element.innerHTML);
  const headingM = merchCard.querySelector('h4[slot="heading-m"]');
  headingM?.append(paymentDetails);
};

const appendCalloutContent = (element, merchCard) => {
  if (element.firstElementChild?.tagName !== 'EM') return;
  let calloutSlot = merchCard.querySelector('div[slot="callout-content"]');
  let calloutContainer = calloutSlot?.querySelector('div');
  if (!calloutContainer) {
    calloutSlot = createTag('div', { slot: 'callout-content' });
    calloutContainer = createTag('div');
    calloutSlot.appendChild(calloutContainer);
    merchCard.appendChild(calloutSlot);
  }

  const calloutContentWrapper = createTag('div');
  const calloutContent = createTag('div');
  const emElement = element.firstElementChild;
  const fragment = document.createDocumentFragment();
  let imgElement = null;

  emElement.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'A' && child.innerText.trim().toLowerCase() === '#icon') {
      const [imgSrc, tooltipText] = child.getAttribute('href')?.split('#') || [];
      imgElement = createTag('img', {
        src: imgSrc,
        title: decodeURIComponent(tooltipText),
        class: 'callout-icon',
      });
    } else {
      const clone = child.cloneNode(true);
      fragment.appendChild(clone);
    }
  });

  calloutContent.appendChild(fragment);
  calloutContentWrapper.appendChild(calloutContent);

  if (imgElement) {
    calloutContentWrapper.appendChild(imgElement);
  }
  calloutContainer.appendChild(calloutContentWrapper);
};

const parseContent = async (el, merchCard) => {
  let headingMCount = 0;
  let headingXsCount = 0;

  if (merchCard.variant === MINI_COMPARE_CHART) {
    const priceSmallType = el.querySelectorAll('h6');
    // Filter out any h6 elements that contain an <em> tag
    const filteredPriceSmallType = Array.from(priceSmallType).filter((h6) => !h6.querySelector('em'));
    if (filteredPriceSmallType.length > 0) appendSlot(filteredPriceSmallType, 'price-commitment', merchCard);
  }

  let headingSize = 3;
  const bodySlot = createTag('div', { slot: `body-${merchCard.variant !== MINI_COMPARE_CHART ? 'xs' : 'm'}` });
  const mnemonicList = el.querySelector('.mnemonic-list');
  if (mnemonicList) {
    await loadMnemonicList(mnemonicList);
  }
  const innerElements = [
    ...el.querySelectorAll(INNER_ELEMENTS_SELECTOR),
  ];

  innerElements.forEach((element) => {
    if (!element.innerHTML.trim()) return;
    let { tagName } = element;
    if (isHeadingTag(tagName)) {
      let slotName = SLOT_MAP[merchCard.variant]?.[tagName] || SLOT_MAP_DEFAULT[tagName];
      if (!slotName) return;
      if (tagName === 'H3') headingXsCount += 1;
      element.classList.add('card-heading');
      if (merchCard.badgeText) {
        element.closest('div[role="tabpanel"')?.classList.add('badge-merch-cards');
      }
      if (HEADING_MAP[merchCard.variant]?.[tagName]) {
        tagName = HEADING_MAP[merchCard.variant][tagName];
      } else {
        if (tagName === 'H2') {
          headingMCount += 1;
        }
        if (headingMCount === 2 && merchCard.variant === MINI_COMPARE_CHART && element.tagName === 'H2') {
          slotName = 'heading-m-price';
          if (getGlobalMetadata('mas-ff-annual-price')) {
            element.classList.add('annual-price-new-line');
          }
        }
        tagName = `H${headingSize}`;
        headingSize += 1;
      }
      element.setAttribute('slot', slotName);
      tagName = (headingXsCount === 1 && tagName === 'H3')
        || (merchCard.variant === MINI_COMPARE_CHART && slotName === 'heading-m') ? 'h3' : 'p';
      const newElement = createTag(tagName);
      Array.from(element.attributes).forEach((attr) => {
        newElement.setAttribute(attr.name, attr.value);
      });
      newElement.innerHTML = element.innerHTML;
      merchCard.append(newElement);
    }
    if (tagName === 'H6') {
      appendPaymentDetails(element, merchCard);
      appendCalloutContent(element, merchCard);
    }
    if (isParagraphTag(tagName)) {
      bodySlot.append(element);
    }
    if (mnemonicList) bodySlot.append(mnemonicList);
  });
  merchCard.append(bodySlot);

  if (merchCard.variant === MINI_COMPARE_CHART && merchCard.childNodes[1]) {
    merchCard.insertBefore(bodySlot, merchCard.childNodes[1]);
  }
};

const getBadgeStyle = (badgeMetadata) => {
  const badgeStyleRegex = /^#[0-9a-fA-F]+, #[0-9a-fA-F]+(, #[0-9a-fA-F]+)?$/;
  if (!badgeStyleRegex.test(badgeMetadata[0]?.innerText)) return null;
  const style = badgeMetadata[0].innerText.split(',').map((s) => s.trim());
  if (style.length < 2) return null;
  const badgeBackgroundColor = style[0];
  const badgeColor = style[1];
  const borderColor = style[2] !== 'none' ? style[2] : null;
  const badgeWrapper = badgeMetadata[0].parentNode;
  const badgeText = badgeMetadata[1].innerText;
  badgeWrapper.remove();
  return { badgeBackgroundColor, badgeColor, badgeText, borderColor };
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
  if (styles.includes('add-stock') && merchCard.variant !== TWP) {
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

const addAddon = (merchCard, styles) => {
  const genai = /add-addon-genai/.test(merchCard.className) ? 'genai' : null;
  const stock = /add-addon-stock/.test(merchCard.className) ? 'stock' : null;
  const addonType = genai || stock;
  if (addonType) {
    let selector = `template.addon.${addonType}.individual`;
    if (styles.includes('edu')) {
      selector = `template.addon.${addonType}.edu`;
    } else if (styles.includes('team')) {
      selector = `template.addon.${addonType}.team`;
    }
    let planType = '';
    if (styles.includes('m2m')) {
      planType = 'M2M';
    } else if (styles.includes('abm')) {
      planType = 'ABM';
    } else if (styles.includes('puf')) {
      planType = 'PUF';
    }

    if (planType) {
      merchCard.setAttribute('plan-type', planType);
    }
    const template = document.querySelector(selector);
    if (!template) return;
    const addon = template.content.cloneNode(true).firstElementChild;
    addon.setAttribute('slot', 'addon');
    const gradient = createTag('merch-gradient', {
      colors: '#F5F6FD, #F8F1F8, #F9E9ED',
      positions: '33.52%, 67.33%, 110.37%',
      angle: '211deg',
      'border-radius': '10px',
    });
    addon.appendChild(gradient);
    merchCard.appendChild(addon);
  }
};

const simplifyHrs = (el) => {
  const hrs = el.querySelectorAll('hr');
  hrs.forEach((hr) => {
    if (hr.parentElement.tagName === 'P') {
      hr.parentElement.replaceWith(hr);
    }
  });
  if (el.variant === PRODUCT) {
    const calloutContent = el.querySelector('div[slot="callout-content"]');
    const bodySlot = el.querySelector('div[slot="body-xs"]');
    if (calloutContent && bodySlot) {
      const bodyLowerContent = createTag('div', { slot: 'body-lower' });
      const elements = [...bodySlot.children];
      elements.forEach((element) => {
        if (element.tagName !== 'P') {
          bodyLowerContent.append(element);
        }
      });
      if (bodyLowerContent.childNodes.length > 0) {
        calloutContent.parentElement.appendChild(bodyLowerContent);
      }
    }
  }
};

const getMiniCompareChartFooterRows = (el) => {
  let footerRows = Array.from(el.children).slice(1);
  footerRows = footerRows.filter((row) => !row.querySelector('.footer-row-cell'));
  if (footerRows[0].firstElementChild.innerText === 'Alt-cta') {
    footerRows.splice(0, 2);
  }
  footerRows.forEach((row) => row.remove());
  return footerRows;
};

const createFirstRow = async (firstRow, isMobile, checkmarkCopyContainer, defaultChevronState) => {
  const firstRowText = firstRow.querySelector('div > div:last-child').innerHTML;
  let firstRowTextParagraph;

  if (isMobile) {
    const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill="#F8F8F8"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="#292929"/>
    <path d="M18.55 12.95H15.05V9.45002C15.05 8.87034 14.5797 8.40002 14 8.40002C13.4203 8.40002 12.95 8.87034 12.95 9.45002V12.95H9.44999C8.87031 12.95 8.39999 13.4203 8.39999 14C8.39999 14.5797 8.87031 15.05 9.44999 15.05H12.95V18.55C12.95 19.1297 13.4203 19.6 14 19.6C14.5797 19.6 15.05 19.1297 15.05 18.55V15.05H18.55C19.1297 15.05 19.6 14.5797 19.6 14C19.6 13.4203 19.1297 12.95 18.55 12.95Z" fill="#292929"/></svg>`;
    const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill="#292929"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="#292929"/>
    <path d="M9 14L19 14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
    const toggleIcon = createTag('button', {
      class: 'toggle-icon',
      'aria-label': firstRowText,
      'aria-expanded': defaultChevronState === 'open',
      'aria-controls': checkmarkCopyContainer.id,
      'daa-lh': `${checkmarkCopyContainer.id}-toggle-button`,
    }, defaultChevronState === 'open' ? removeIcon : addIcon);
    firstRowTextParagraph = createTag('div', { class: 'footer-rows-title' }, firstRowText);
    firstRowTextParagraph.appendChild(toggleIcon);

    if (defaultChevronState === 'open') {
      checkmarkCopyContainer.classList.add('open');
    }

    firstRowTextParagraph.addEventListener('click', () => {
      const isOpen = checkmarkCopyContainer.classList.toggle('open');
      toggleIcon.setAttribute('aria-expanded', isOpen);
      toggleIcon.innerHTML = isOpen ? removeIcon : addIcon;
    });
  } else {
    firstRowTextParagraph = createTag('div', { class: 'footer-rows-title' }, firstRowText);
    checkmarkCopyContainer.classList.add('open');
  }

  return firstRowTextParagraph;
};

const createFooterRowCell = (row, isCheckmark) => {
  const rowIcon = row.firstElementChild.querySelector('picture');
  const rowText = row.querySelector('div > div:nth-child(2)').innerHTML;
  const rowTextParagraph = createTag('div', { class: 'footer-row-cell-description' }, rowText);
  const footerRowCellClass = isCheckmark ? 'footer-row-cell-checkmark' : 'footer-row-cell';
  const footerRowIconClass = isCheckmark ? 'footer-row-icon-checkmark' : 'footer-row-icon';
  const footerRowCell = createTag('li', { class: footerRowCellClass });

  if (rowIcon) {
    rowIcon.querySelector('img')?.removeAttribute('loading');
    rowIcon.classList.add(footerRowIconClass);
    footerRowCell.appendChild(rowIcon);
  }
  footerRowCell.appendChild(rowTextParagraph);

  return footerRowCell;
};

const decorateFooterRows = async (merchCard, footerRows) => {
  if (!footerRows) return;

  const footerRowsSlot = createTag('div', { slot: 'footer-rows' });
  const isCheckmark = merchCard.classList.contains('bullet-list');
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const ulContainer = createTag('ul');
  if (isCheckmark) {
    const firstRow = footerRows[0];
    const firstRowContent = firstRow.querySelector('div > div:first-child').innerHTML.split(',');
    let defaultChevronState = 'close';

    firstRowContent.forEach((item) => {
      const trimmedItem = item.trim();
      if (trimmedItem === 'open' || trimmedItem === 'close') {
        defaultChevronState = trimmedItem;
      }
    });

    const merchCardHeading = merchCard.querySelector('h3')?.id;
    if (merchCardHeading) {
      ulContainer.setAttribute('id', `${merchCardHeading}-list`);
    }

    ulContainer.classList.add('checkmark-copy-container');
    const firstRowTextParagraph = await createFirstRow(
      firstRow,
      isMobile,
      ulContainer,
      defaultChevronState,
    );

    footerRowsSlot.appendChild(firstRowTextParagraph);

    footerRows.splice(0, 1);
    if (isMobile) {
      footerRowsSlot.style.padding = 'var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs) var(--consonant-merch-spacing-xs)';
    }
  }
  footerRowsSlot.appendChild(ulContainer);

  footerRows.forEach((row) => {
    const footerRowCell = createFooterRowCell(row, isCheckmark);
    ulContainer.appendChild(footerRowCell);
  });

  merchCard.appendChild(footerRowsSlot);
};

const setMiniCompareOfferSlot = (merchCard, offers) => {
  if (merchCard.variant !== MINI_COMPARE_CHART) return;
  const miniCompareOffers = merchCard.querySelector('div[slot="offers"]')
    || merchCard.appendChild(createTag('div', { slot: 'offers' }));
  if (offers) {
    miniCompareOffers.append(offers);
  } else {
    miniCompareOffers.appendChild(createTag('p'));
  }
  merchCard.appendChild(miniCompareOffers);
};

const updateBigPrices = (merchCard) => {
  const prices = merchCard.querySelectorAll('strong > em > span[is="inline-price"]');
  const isMobile = window.matchMedia('(max-width: 1199px)').matches;
  prices.forEach((span) => {
    const strongTag = span.parentNode.parentNode;
    const emTag = span.parentNode;
    strongTag.replaceChild(span, emTag);
    if (!isMobile) {
      span.style.cssText = 'font-size: 24px; line-height: 22.5px;';
    } else {
      span.style.cssText = 'font-size: 16px; line-height: 24px;';
    }
  });
};

const addStartingAt = async (styles, merchCard) => {
  if (styles.includes('starting-at')) {
    const { replaceKey } = await import('../../features/placeholders.js');
    await replaceKey('starting-at', getConfig()).then((key) => {
      const startingAt = createTag('div', { class: 'starting-at' }, key);
      const headingMPrice = merchCard.querySelector('[slot="heading-m-price"]');
      const price = headingMPrice?.querySelector('span[is="inline-price"]:not([data-template="strikethrough"])');
      if (price) {
        price.parentNode.prepend(startingAt);
      }
    });
  }
};

const getUrlPath = (link) => {
  if (!link || link.startsWith('/')) return link;

  try {
    return (new URL(link)).pathname;
  } catch {
    return link;
  }
};

const updateIconAlt = (merchCard) => {
  const icons = merchCard.querySelectorAll('merch-icon');
  if (icons.length !== 1) return;

  const heading = merchCard.querySelector('.card-heading');
  const headingLink = heading?.querySelector('a')?.getAttribute('href');
  if (!headingLink) return;

  const icon = icons[0];
  const iconLink = icon.getAttribute('href');
  if (getUrlPath(iconLink) === getUrlPath(headingLink) && icon.alt) {
    icon.setAttribute('alt', heading.textContent);
  }
};

export default async function init(el) {
  if (!el.querySelector(INNER_ELEMENTS_SELECTOR)) return el;

  const styles = [...el.classList];
  const cardType = getPodType(styles) || PRODUCT;
  const isMultiOfferCard = MULTI_OFFER_CARDS.includes(cardType);
  const hasOfferSelection = el.querySelector('ul');
  const hasQuantitySelect = el.querySelector('.merch-offers');

  // Load lit first as it's needed by MAS components
  await loadLitDependency();

  const componentPromises = [loadMasComponent(MAS_MERCH_CARD)];

  if (isMultiOfferCard && (hasOfferSelection || hasQuantitySelect)) {
    componentPromises.push(loadMasComponent(MAS_MERCH_QUANTITY_SELECT));
    if (hasOfferSelection) {
      componentPromises.push(loadMasComponent(MAS_MERCH_OFFER_SELECT));
    }
  }

  await Promise.all([...componentPromises, initService()]);
  const liELs = el.querySelectorAll('ul li');
  if (liELs) {
    [...liELs].forEach((liEl) => {
      liEl.querySelectorAll('p').forEach((pElement) => {
        while (pElement?.firstChild) {
          pElement.parentNode.insertBefore(pElement.firstChild, pElement);
        }
        pElement.remove();
      });
    });
  }
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
        if (badge.borderColor) merchCard.setAttribute('border-color', badge.borderColor);
        merchCard.classList.add('badge-card');
      } else if (badgeMetadata.children.length === 1) {
        const borderColor = badgeMetadata.children[0].innerText.trim();
        if (borderColor.startsWith('#')) merchCard.setAttribute('border-color', borderColor);
      }
    }
  }
  let footerRows;
  if ([MINI_COMPARE_CHART, PLANS, SEGMENT, PRODUCT].includes(cardType)) {
    intersectionObserver.observe(merchCard);
  }
  if (cardType === MINI_COMPARE_CHART) {
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
  const actionMenuContent = cardType === CATALOG
    ? getActionMenuContent(el)
    : null;
  if (actionMenuContent) {
    const { replaceKey } = await import('../../features/placeholders.js');
    await replaceKey('action-menu', getConfig()).then((key) => merchCard.setAttribute('action-menu-label', key));
    merchCard.setAttribute('action-menu', true);
    merchCard.append(
      createTag(
        'div',
        { slot: 'action-menu-content', tabindex: '0' },
        actionMenuContent.innerHTML,
      ),
    );
    merchCard.addEventListener('focusin', () => {
      const actionMenu = merchCard.shadowRoot.querySelector('.action-menu');
      actionMenu.classList.add('always-visible');
    });
    merchCard.addEventListener('focusout', (e) => {
      if (!e.target.href || e.target.src || e.target.parentElement.classList.contains('card-heading')) {
        return;
      }
      const actionMenu = merchCard.shadowRoot.querySelector('.action-menu');
      actionMenu.classList.remove('always-visible');
    });
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
        href: icon.closest('a')?.href ?? '',
      };
      return img;
    });
    iconImgs.forEach((icon) => {
      const merchIcon = createTag('merch-icon', { slot: 'icons', src: icon.src, alt: icon.alt, href: icon.href, size: 'l' });
      merchCard.appendChild(merchIcon);
    });
    icons.forEach((icon) => {
      if (icon.parentElement.nodeName === 'A') icon.parentElement.remove();
      else icon.remove();
    });
  }

  addStock(merchCard, styles);
  addAddon(merchCard, styles);
  if (styles.includes('secure')) {
    const { replaceKey } = await import('../../features/placeholders.js');
    await replaceKey('secure-transaction', getConfig()).then((key) => merchCard.setAttribute('secure-label', key));
  }
  merchCard.setAttribute('filters', categories.join(','));
  merchCard.setAttribute('types', types.join(','));

  if (merchCard.variant !== TWP) {
    parseContent(el, merchCard);
    updateIconAlt(merchCard);

    const footer = createTag('div', { slot: 'footer' });
    if (ctas) {
      let buttonSize;
      if (merchCard.variant === MINI_COMPARE_CHART
        && merchCard.classList.contains('bullet-list')
        && window.matchMedia('(max-width: 767px)').matches) {
        buttonSize = 'button-xl';
      } else if (merchCard.variant === MINI_COMPARE_CHART) {
        buttonSize = 'button-l';
      }
      decorateButtons(ctas, buttonSize);
      footer.append(ctas);
    }
    merchCard.appendChild(footer);

    if (MULTI_OFFER_CARDS.includes(cardType)) {
      const quantitySelect = extractQuantitySelect(el, merchCard);
      const offerSelection = el.querySelector('ul');
      if (offerSelection) {
        const { initOfferSelection } = await import('./merch-offer-select.js');
        setMiniCompareOfferSlot(merchCard, undefined);
        await initOfferSelection(merchCard, offerSelection, quantitySelect);
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

    updateBigPrices(merchCard);
    await addStartingAt(styles, merchCard);
    decorateBlockHrs(merchCard);
    simplifyHrs(merchCard);
    if (merchCard.classList.contains('has-divider')) merchCard.setAttribute('custom-hr', true);
    await decorateFooterRows(merchCard, footerRows);
  } else {
    parseTwpContent(el, merchCard);
  }
  el.replaceWith(merchCard);
  decorateMerchCardLinkAnalytics(merchCard);
  return merchCard;
}
