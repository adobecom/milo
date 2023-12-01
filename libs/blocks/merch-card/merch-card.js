import { decorateButtons, decorateBlockHrs } from '../../utils/decorate.js';
import { getConfig, createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import { processTrackingLabels } from '../../martech/analytics.js';
import { replaceKey } from '../../features/placeholders.js';
import '../../deps/merch-card.js';

const PRODUCT_NAMES = [
  'acrobat-pdf-pack',
  'acrobat-pro-2020',
  'acrobat-reader-dc-mobile',
  'acrobat-reader-dc',
  'acrobat-sign-solutions-mobile',
  'acrobat-sign-solutions',
  'acrobat-standard-2020',
  'acrobat-standard-dc',
  'acrobat',
  'adobe-connect',
  'adobe-export-pdf',
  'adobe-firefly',
  'adobe-scan',
  'advertising-cloud',
  'aero',
  'aftereffects',
  'analytics',
  'animate',
  'audience-manager',
  'audition',
  'behance',
  'bridge',
  'campaign',
  'captivate-prime',
  'captivate',
  'capture',
  'all-apps',
  'express',
  'character-animator',
  'cloud-service',
  'coldfusion-aws',
  'coldfusion-builder',
  'coldfusion-enterprise',
  'coldfusion',
  'color',
  'commerce-cloud',
  'content-server',
  'customer-journey-analytics',
  'design-to-print',
  'digital-editions',
  'dreamweaver',
  'embedded-print-engine',
  'experience-manager-assets',
  'experience-manager-forms',
  'experience-manager-sites',
  'experience-manager',
  'experience-platform',
  'fill-sign',
  'fonts',
  'frame',
  'framemaker-publishing-server',
  'framemaker',
  'fresco',
  'http-dynamic-streaming',
  'illustrator',
  'incopy',
  'indesign-server',
  'indesign',
  'intelligent-services',
  'journey-orchestration',
  'lightroom-classic',
  'lightroom',
  'magento',
  'marketo',
  'media-encoder',
  'media-server-aws',
  'media-server-extended',
  'media-server-professional',
  'media-server-standard',
  'mixamo',
  'pdf-print-engine',
  'pepe',
  'photoshop-elements',
  'photoshop-express',
  'photoshop',
  'portfolio',
  'postscript',
  'premiere-elements',
  'premierepro',
  'presenter-video-express',
  'real-time-customer-data-platform',
  'robohelp-server',
  'robohelp',
  'stock',
  'substance-3d-designer',
  'substance-3d-modeler',
  'substance-3d-painter',
  'substance-3d-sampler',
  'substance-3d-stager',
  'target',
  'technical-communication-suite',
  'type',
  'xml-documentation',
];

const TAG_PATTERN = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-].*$/;

const CARD_TYPES = ['segment', 'special-offers', 'plans', 'catalog', 'product', 'inline-heading'];
const MERCH_CARD_GRIDS = ['one-merch-card', 'two-merch-cards', 'three-merch-cards', 'four-merch-cards'];

const textStyles = {
  H5: 'detail-m',
  H4: 'body-xxs',
  H3: 'heading-xs',
  H2: 'heading-m',
};

const getPodType = (styles) => styles?.find((style) => CARD_TYPES.includes(style));

const isHeadingTag = (tagName) => /^H[2-5]$/.test(tagName);
const isParagraphTag = (tagName) => tagName === 'P';

const parseContent = (el, merchCard) => {
  const innerElements = [
    ...el.querySelectorAll('h2, h3, h4, h5, p, ul'),
  ];
  const bodySlot = createTag('div', { slot: 'body-xs' });

  innerElements.forEach((element) => {
    const { tagName } = element;
    if (isHeadingTag(tagName)) {
      const slotName = textStyles[tagName];
      if (slotName) {
        element.setAttribute('slot', slotName);
        merchCard.append(element);
      }
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

function addMerchCardGridIfMissing(section) {
  if (section?.matches('[class*="-merch-card"]')) return true;
  if (!section?.matches('[class*="-up"]') && section?.parentElement.tagName !== 'MAIN') return false;
  // this is a milo grid with -up stles.
  let styleClasses = [];
  const el = section.querySelector('.section-metadata');
  if (el) {
    const metadata = getMetadata(el);
    styleClasses = metadata?.style?.text?.split(',').map((token) => token.split(' ').join('-')) ?? [];
  }
  if (!MERCH_CARD_GRIDS.some((styleClass) => styleClasses.includes(styleClass))) {
    // no merch card grid found, add the default one.
    section.classList.add('three-merch-cards');
    return true;
  }
  return false;
}

const decorateMerchCardLinkAnalytics = (el) => {
  [...el.querySelectorAll('a')].forEach((link, index) => {
    const heading = el.querySelector('h3');
    const analyticsString = `${processTrackingLabels(link.textContent)}-${index + 1}|${heading.textContent}`;
    link.setAttribute('daa-ll', analyticsString);
  });
};

const init = async (el) => {
  const styles = [...el.classList];
  const lastClass = styles[styles.length - 1];
  const name = PRODUCT_NAMES.includes(lastClass) ? lastClass : undefined;

  let section = el.closest('.section');
  const merchCards = addMerchCardGridIfMissing(section);
  const cardType = getPodType(styles);
  if (!merchCards && section?.parentElement.classList.contains('fragment')) {
    const fragment = section.parentElement;
    const fragmentParent = fragment.parentElement;
    section.style.display = 'contents';
    fragment.style.display = 'contents';
    fragmentParent.style.display = fragmentParent.classList.contains('nested')
      ? fragmentParent.style.display
      : 'contents';
    section = fragmentParent.parentElement;
  }

  if (section && cardType) {
    section.classList.add(cardType);
  }

  const images = el.querySelectorAll('picture');
  let image;
  const icons = [];

  const merchCard = createTag('merch-card', { class: styles.join(' '), 'data-block': '' });

  if (cardType) {
    merchCard.setAttribute('variant', cardType);
  }

  if (name) {
    merchCard.setAttribute('name', name);
  }

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

  let tags = {};
  if (el.lastElementChild) {
    tags = extractTags(el.lastElementChild);
    if (tags.categories?.length > 1 || tags.types?.length > 0) {
    // this div contains tags, remove it from further processing.
      el.lastElementChild.remove();
    }
  }
  const { categories = ['all'], types = [] } = tags;

  if (el.firstElementChild) {
    const ribbonMetadata = el.firstElementChild.querySelector('ul,h2') === null
  && el.firstElementChild.innerText.includes('#') ? el.firstElementChild : null;

    if (ribbonMetadata !== null) {
      const badge = returnRibbonStyle(ribbonMetadata.children);
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
  const ctas = el.querySelector('p > strong a, p > em a')?.closest('p');
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
  if (styles.includes('secure')) {
    await replaceKey('secure-transaction', getConfig()).then((key) => merchCard.setAttribute('secure-label', key));
  }
  merchCard.setAttribute('filters', categories.join(','));
  merchCard.setAttribute('types', types.join(','));
  parseContent(el, merchCard);
  const footer = createTag('div', { slot: 'footer' });
  if (ctas) {
    decorateButtons(ctas);
    footer.append(ctas);
  }
  merchCard.appendChild(footer);
  const offerSelection = cardType === 'plans' ? el.querySelector('ul') : null;
  if (offerSelection) {
    const { initOfferSelection } = await import('./offer-selection.js');
    initOfferSelection(merchCard, offerSelection);
  }
  decorateBlockHrs(merchCard);
  if (merchCard.classList.contains('has-divider')) {
    merchCard.setAttribute('custom-hr', true);
  }
  el.replaceWith(merchCard);
  decorateMerchCardLinkAnalytics(merchCard);
  return merchCard;
};

export default init;
