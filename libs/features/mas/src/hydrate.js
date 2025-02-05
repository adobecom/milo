import { CheckoutButton } from './checkout-button.js';
import { createTag } from './utils.js';

const DEFAULT_BADGE_COLOR = '#000000';
const DEFAULT_BADGE_BACKGROUND_COLOR = '#F8D904';
const CHECKOUT_STYLE_PATTERN = /(accent|primary|secondary)(-(outline|link))?/;
export const ANALYTICS_TAG = 'mas:product_code/';
export const ANALYTICS_LINK_ATTR = 'daa-ll';
export const ANALYTICS_SECTION_ATTR = 'daa-lh';
const SPECTRUM_BUTTON_SIZES = ['XL', 'L', 'M', 'S'];

export function appendSlot(fieldName, fields, el, mapping, settings) {
  const content = fields[fieldName] || settings && settings[fieldName];
  if (content && mapping[fieldName]) {
    const tag = createTag(
      mapping[fieldName].tag,
      { slot: mapping[fieldName]?.slot },
      content,
    );
    el.append(tag);
  }
}
export function processMnemonics(fields, merchCard, mnemonicsConfig) {
    const mnemonics = fields.mnemonicIcon?.map((icon, index) => ({
        icon,
        alt: fields.mnemonicAlt[index] ?? '',
        link: fields.mnemonicLink[index] ?? '',
    }));

    mnemonics?.forEach(({ icon: src, alt, link: href }) => {
        if (href && !/^https?:/.test(href)) {
            try {
                href = new URL(`https://${href}`).href.toString();
            } catch (e) {
                /* c8 ignore next 2 */
                href = '#';
            }
        }

        const attrs = {
            slot: 'icons',
            src,
            size: mnemonicsConfig?.size ?? 'l',
        };
        if (alt) attrs.alt = alt;
        if (href) attrs.href = href;
        const merchIcon = createTag('merch-icon', attrs);
        merchCard.append(merchIcon);
    });
}

function processBadge(fields, merchCard) {
    if (fields.badge) {
        merchCard.setAttribute('badge-text', fields.badge);
        merchCard.setAttribute(
            'badge-color',
            fields.badgeColor || DEFAULT_BADGE_COLOR,
        );
        merchCard.setAttribute(
            'badge-background-color',
            fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR,
        );
    }
}

export function processSize(fields, merchCard, allowedSizes) {
    if (allowedSizes?.includes(fields.size)) {
        merchCard.setAttribute('size', fields.size);
    }
}

export function processTitle(fields, merchCard, titleConfig) {
    if (fields.cardTitle && titleConfig) {
        merchCard.append(
            createTag(
                titleConfig.tag,
                { slot: titleConfig.slot },
                fields.cardTitle,
            ),
        );
    }
}

export function processSubtitle(fields, merchCard, subtitleConfig) {
    if (fields.subtitle && subtitleConfig) {
        merchCard.append(
            createTag(
                subtitleConfig.tag,
                { slot: subtitleConfig.slot },
                fields.subtitle,
            ),
        );
    }
}

export function processBackgroundImage(
    fields,
    merchCard,
    backgroundImageConfig,
) {
    if (backgroundImageConfig?.tag && fields.backgroundImage) { 
        const imgAttributes = {
            loading: 'lazy',
            src: fields.backgroundImage,
        };
        if (fields.backgroundImageAltText) {
            imgAttributes.alt = fields.backgroundImageAltText;
        } else {
            imgAttributes.role = 'none';
        }
        merchCard.append(
            createTag(
                backgroundImageConfig.tag,
                { slot: backgroundImageConfig.slot },
                createTag('img', imgAttributes),
            ),
        );
    }
    if (backgroundImageConfig?.attribute) {
        merchCard.setAttribute(backgroundImageConfig.attribute, fields.backgroundImage);
    }
}

export function processPrices(fields, merchCard, mapping, settings) {
  if (!fields.prices || !mapping.prices) return;
  const headingM = createTag(
      mapping.prices.tag,
      { slot: mapping.prices.slot },
      fields.prices,
  );
  if (settings.priceLabel) {
    headingM.append(settings.priceLabel);
  }
  merchCard.append(headingM);
}

export function processDescriptionAndPromo(fields, merchCard, mapping) {
  appendSlot('promoText', fields, merchCard, mapping);
  appendSlot('description', fields, merchCard, mapping);
}

export function processStockOffersAndSecureLabel(fields, merchCard, aemFragmentMapping, settings) {
  // for Stock Checkbox, presence flag is set on the card, label and osi for an offer are set in settings
  if (fields.showStockCheckbox && aemFragmentMapping.stockOffer) {
    merchCard.setAttribute('checkbox-label', settings.stockCheckboxLabel);
    merchCard.setAttribute('stock-offer-osis', settings.stockOfferOsis);
  }
  if (settings.secureLabel && aemFragmentMapping.secureLabel) {
    merchCard.setAttribute('secure-label', settings.secureLabel);
  }
}

function createSpectrumCssButton(cta, aemFragmentMapping, isOutline, variant) {
    const CheckoutButton = customElements.get('checkout-button');
    const spectrumCta = CheckoutButton.createCheckoutButton({}, cta.innerHTML);
    spectrumCta.setAttribute('tabindex', 0);
    for (const attr of cta.attributes) {
        if (['class', 'is'].includes(attr.name)) continue;
        spectrumCta.setAttribute(attr.name, attr.value);
    }
    spectrumCta.firstElementChild?.classList.add('spectrum-Button-label');
    const size = aemFragmentMapping.ctas.size ?? 'M';
    const variantClass = `spectrum-Button--${variant}`;
    const sizeClass = SPECTRUM_BUTTON_SIZES.includes(size)
        ? `spectrum-Button--size${size}`
        : 'spectrum-Button--sizeM';
    const spectrumClass = ['spectrum-Button', variantClass, sizeClass];
    if (isOutline) {
        spectrumClass.push('spectrum-Button--outline');
    }

    spectrumCta.classList.add(...spectrumClass);
    return spectrumCta;
}

function createSpectrumSwcButton(cta, aemFragmentMapping, isOutline, variant) {
    let treatment = 'fill';

    if (isOutline) {
        treatment = 'outline';
    }
    const spectrumCta = createTag(
        'sp-button',
        {
            treatment,
            variant,
            tabIndex: 0,
            size: aemFragmentMapping.ctas.size ?? 'm',
        },
        cta,
    );

    spectrumCta.addEventListener('click', (e) => {
        if (e.target !== cta) {
            /* c8 ignore next 3 */
            e.stopPropagation();
            cta.click();
        }
    });

    return spectrumCta;
}

function processConsonantButton(cta, strong) {
    cta.classList.add('con-button');
    if (strong) {
        cta.classList.add('blue');
    }
    return cta;
}

export function processCTAs(fields, merchCard, aemFragmentMapping, variant) {
    if (fields.ctas) {
        const { slot } = aemFragmentMapping.ctas;
        const footer = createTag('div', { slot }, fields.ctas);

        const ctas = [...footer.querySelectorAll('a')].map((cta) => {
            const strong = cta.parentElement.tagName === 'STRONG';
            if (merchCard.consonant) return processConsonantButton(cta, strong);
            const checkoutLinkStyle =
                CHECKOUT_STYLE_PATTERN.exec(cta.className)?.[0] ?? 'accent';
            const isAccent = checkoutLinkStyle.includes('accent');
            const isPrimary = checkoutLinkStyle.includes('primary');
            const isSecondary = checkoutLinkStyle.includes('secondary');
            const isOutline = checkoutLinkStyle.includes('-outline');
            const isLink = checkoutLinkStyle.includes('-link');
            if (isLink) {
                return cta;
            }
            let variant;
            if (isAccent || strong) {
                variant = 'accent';
            } else if (isPrimary) {
                variant = 'primary';
            } else if (isSecondary) {
                variant = 'secondary';
            }
            if (merchCard.spectrum === 'swc')
                return createSpectrumSwcButton(
                    cta,
                    aemFragmentMapping,
                    isOutline,
                    variant,
                );
            return createSpectrumCssButton(
                cta,
                aemFragmentMapping,
                isOutline,
                variant,
            );
        });

        footer.innerHTML = '';
        footer.append(...ctas);
        merchCard.append(footer);
    }
}

export function processAnalytics(fields, merchCard) {
    const { tags } = fields;
    const cardAnalyticsId = tags
        ?.find((tag) => tag.startsWith(ANALYTICS_TAG))
        ?.split('/')
        .pop();
    if (!cardAnalyticsId) return;
    merchCard.setAttribute(ANALYTICS_SECTION_ATTR, cardAnalyticsId);
    merchCard
        .querySelectorAll(`a[data-analytics-id],button[data-analytics-id]`)
        .forEach((el, index) => {
            el.setAttribute(
                ANALYTICS_LINK_ATTR,
                `${el.dataset.analyticsId}-${index + 1}`,
            );
        });
}

export function updateLinksCSS(merchCard) {
    if (merchCard.spectrum !== 'css') return;
    [
        ['primary-link', 'primary'],
        ['secondary-link', 'secondary'],
    ].forEach(([className, variant]) => {
        merchCard.querySelectorAll(`a.${className}`).forEach((link) => {
            link.classList.remove(className);
            link.classList.add('spectrum-Link', `spectrum-Link--${variant}`);
        });
    });
}

export function cleanup(merchCard) {
  // remove all previous slotted content except the default slot
  merchCard.querySelectorAll('[slot]').forEach((el) => {
    el.remove();
  });
  const attributesToRemove = [
  'checkbox-label',
  'stock-offer-osis',
  'secure-label',
  'background-image',
  'badge-background-color',
  'badge-color',
  'badge-text',
  'size'
  ];
  attributesToRemove.forEach(attr => merchCard.removeAttribute(attr));
  const classesToRemove = ['wide-strip', 'thin-strip'];
  merchCard.classList.remove(...classesToRemove);
  merchCard.removeAttribute(ANALYTICS_SECTION_ATTR);
}

export async function hydrate(fragment, merchCard) {
    const { fields } = fragment;
    const { variant } = fields;
    if (!variant) return;
    merchCard.id = fragment.id;
    // temporary hardcode for plans. this data will be coming from settings (MWPW-166756)
    const settings = {
      stockCheckboxLabel: '{{stock-checkbox-label}}',
      stockOfferOsis: '',
      secureLabel: '{{secure-transaction}}',
      priceLabel: '{{tax-exclusive}} {{annual-paid-monthly}}'
    };
    cleanup(merchCard);
    merchCard.variant = variant;
    await merchCard.updateComplete;

    const { aemFragmentMapping } = merchCard.variantLayout;
    if (!aemFragmentMapping) return;

    processMnemonics(fields, merchCard, aemFragmentMapping.mnemonics);
    processBadge(fields, merchCard);
    processSize(fields, merchCard, aemFragmentMapping.allowedSizes);
    processTitle(fields, merchCard, aemFragmentMapping.title);
    processSubtitle(fields, merchCard, aemFragmentMapping.subtitle);
    processPrices(fields, merchCard, aemFragmentMapping, settings);
    processBackgroundImage(
        fields,
        merchCard,
        aemFragmentMapping.backgroundImage,
        variant,
    );
    processDescriptionAndPromo(fields, merchCard, aemFragmentMapping);
    processStockOffersAndSecureLabel(fields, merchCard, aemFragmentMapping, settings);
    processCTAs(fields, merchCard, aemFragmentMapping, variant);
    processAnalytics(fields, merchCard);
    updateLinksCSS(merchCard);
}
