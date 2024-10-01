import { AemDataSource } from './aem-datasource.js';
import { createTag } from './utils.js';

const VARIANTS = {
    CATALOG: 'catalog',
    AH: 'ah',
    CCD_ACTION: 'ccd-action',
    SPECIAL_OFFERS: 'special-offers',
    CCD_SLICE: 'ccd-slice',
};

const cardContent = {
    [VARIANTS.CATALOG]: {
        title: { tag: 'h3', slot: 'heading-xs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.AH]: {
        title: { tag: 'h3', slot: 'heading-xxs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xxs' },
        ctas: { size: 's' },
    },
    [VARIANTS.CCD_ACTION]: {
        title: { tag: 'h3', slot: 'heading-xs' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.SPECIAL_OFFERS]: {
        name: { tag: 'h4', slot: 'detail-m' },
        title: { tag: 'h4', slot: 'detail-m' },
        backgroundImage: { tag: 'div', slot: 'bg-image' },
        prices: { tag: 'h3', slot: 'heading-xs' },
        description: { tag: 'div', slot: 'body-xs' },
        ctas: { size: 'l' },
    },
    [VARIANTS.CCD_SLICE]: {
      backgroundImage: { tag: 'div', slot: 'image' },
      description: { tag: 'div', slot: 'body-s' },
      ctas: { size: 'l' },
  },
};

async function parseMerchCard(fragmentData, appendFn, merchCard, consonant) {
    const item = fragmentData.fields.reduce(
        (acc, { name, multiple, values }) => {
            acc[name] = multiple ? values : values[0];
            return acc;
        },
        { id: fragmentData.id },
    );
    item.model = item.model;

    const { variant = 'catalog' } = item;
    merchCard.setAttribute('variant', variant);
    const cardMapping = cardContent[variant] ?? 'catalog';
    item.mnemonicIcon?.forEach((icon, idx) => {
      const href = item.mnemonicLink?.length > idx ? item.mnemonicLink[idx] : '';
      const alt = item.mnemonicAlt?.length > idx ? item.mnemonicAlt[idx] : '';
      const merchIcon = createTag('merch-icon', {
          slot: 'icons',
          src: icon,
          alt,
          href,
          size: 'l',
      });
      appendFn(merchIcon);
  });

  if (item.cardTitle && cardMapping.title) {
      appendFn(
          createTag(
              cardMapping.title.tag,
              { slot: cardMapping.title.slot },
              item.cardTitle,
          ),
      );
  }

  if (item.backgroundImage && cardMapping.backgroundImage) {
      // TODO improve image logic
      appendFn(
          createTag(
              cardMapping.backgroundImage.tag,
              { slot: cardMapping.backgroundImage.slot },
              `<img loading="lazy" src="${item.backgroundImage}" width="600" height="362">`,
          ),
      );
  }

    if (item.prices && cardMapping.prices) {
        const prices = item.prices;
        const headingM = createTag(
            cardMapping.prices.tag,
            { slot: cardMapping.prices.slot },
            prices,
        );
        appendFn(headingM);
    }

    if (item.description && cardMapping.description) {
        const body = createTag(
            cardMapping.description.tag,
            { slot: cardMapping.description.slot },
            item.description,
        );
        appendFn(body);
    }

    if (item.ctas) {
        const footer = createTag('div', { slot: 'footer' }, item.ctas);
        const ctas = [];
        [...footer.querySelectorAll('a')].forEach((cta) => {
            const strong = cta.parentElement.tagName === 'STRONG';
            if (consonant) {
                cta.classList.add('con-button');
                if (strong) {
                    cta.classList.add('blue');
                }
                ctas.push(cta);
            } else {
                const treatment = strong ? 'fill' : 'outline';
                const variant = strong ? 'accent' : 'primary';
                const spectrumCta = createTag(
                    'sp-button',
                    { treatment, variant },
                    cta,
                );
                spectrumCta.addEventListener('click', (e) => {
                    /* c8 ignore next 2 */
                    e.stopPropagation();
                    cta.click();
                });
                ctas.push(spectrumCta);
            }
        });
        footer.innerHTML = '';
        footer.append(...ctas);
        appendFn(footer);
    }
}

/**
 * Custom element representing a MerchDataSource.
 *
 * @attr {string} path - fragment path
 */
export class MerchDataSource extends AemDataSource {
    async render() {
        if (this.item) {
            const appendFn = (element) => {
                this.parentElement.appendChild(element);
                this.refs.push(element);
            };
            parseMerchCard(
                this.item,
                appendFn,
                this.parentElement,
                this.consonant,
            );
        }
    }
}

customElements.define('merch-datasource', MerchDataSource);
