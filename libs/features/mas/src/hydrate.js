import { UptLink } from './upt-link.js';
import { createTag } from './utils.js';

const DEFAULT_BADGE_COLOR = '#000000';
const DEFAULT_PLANS_BADGE_COLOR = 'spectrum-yellow-300-plans';
const DEFAULT_BADGE_BACKGROUND_COLOR = '#F8D904';
const DEFAULT_BORDER_COLOR = '#EAEAEA';
const CHECKOUT_STYLE_PATTERN = /(accent|primary|secondary)(-(outline|link))?/;
export const ANALYTICS_TAG = 'mas:product_code/';
export const ANALYTICS_LINK_ATTR = 'daa-ll';
export const ANALYTICS_SECTION_ATTR = 'daa-lh';
const SPECTRUM_BUTTON_SIZES = ['XL', 'L', 'M', 'S'];
const TEXT_TRUNCATE_SUFFIX = '...';

export function appendSlot(fieldName, fields, el, mapping) {
  const config = mapping[fieldName];
  if (fields[fieldName] && config) {
    const attributes = { slot: config?.slot };
    let content = fields[fieldName];
    
    // Handle maxCount if specified in the config
    if (config.maxCount && typeof content === 'string') {
      const [truncatedContent, cleanContent] = getTruncatedTextData(content, config.maxCount, config.withSuffix);
      if (truncatedContent !== content) {
        attributes.title = cleanContent; // Add full text as title attribute for tooltip
        content = truncatedContent;
      }
    }
    
    const tag = createTag(
      config.tag,
      attributes,
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
            loading: merchCard.loading,
            size: mnemonicsConfig?.size ?? 'l',
        };
        if (alt) attrs.alt = alt;
        if (href) attrs.href = href;
        const merchIcon = createTag('merch-icon', attrs);
        merchCard.append(merchIcon);
    });
}

function processBadge(fields, merchCard, mapping) {
    if (fields.variant === 'plans') {
        // for back-compatibility
        if (fields.badge?.length && !fields.badge?.startsWith('<merch-badge')) {
            fields.badge = `<merch-badge variant="${fields.variant}" background-color="${DEFAULT_PLANS_BADGE_COLOR}">${fields.badge}</merch-badge>`;
            if (!fields.borderColor) fields.borderColor = DEFAULT_PLANS_BADGE_COLOR;
        }
        appendSlot('badge', fields, merchCard, mapping);
        return;
    }

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
        merchCard.setAttribute(
            'border-color',
            fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR,
        );
    } else {
        merchCard.setAttribute(
            'border-color',
            fields.borderColor || DEFAULT_BORDER_COLOR,
        );
    }
}

export function processSize(fields, merchCard, sizeConfig) {
    if (sizeConfig?.includes(fields.size)) {
        merchCard.setAttribute('size', fields.size);
    }
}

export function processTitle(fields, merchCard, titleConfig) {
  // Use the enhanced appendSlot function for consistency
  appendSlot('cardTitle', fields, merchCard, { cardTitle: titleConfig });
}

export function processSubtitle(fields, merchCard, mapping) {
  appendSlot('subtitle', fields, merchCard, mapping); 
}

export function processBackgroundColor(fields, merchCard, allowedColors) {
    if (!fields.backgroundColor || fields.backgroundColor.toLowerCase() === 'default') {
        merchCard.style.removeProperty('--merch-card-custom-background-color');
        merchCard.removeAttribute('background-color');
        return;
    }

    if (allowedColors?.[fields.backgroundColor]) {
        merchCard.style.setProperty('--merch-card-custom-background-color', `var(${allowedColors[fields.backgroundColor]})`);
        merchCard.setAttribute('background-color', fields.backgroundColor);
    }
}

export function processBorderColor(fields, merchCard, borderColorConfig) {
    const customBorderColor = '--merch-card-custom-border-color';
    if (fields.borderColor?.toLowerCase() === 'transparent') {
        merchCard.style.removeProperty(customBorderColor);
        if (fields.variant === 'plans') merchCard.style.setProperty(customBorderColor, 'transparent');
    } else if (fields.borderColor && borderColorConfig) {
        merchCard.style.setProperty(customBorderColor, `var(--${fields.borderColor})`);
    }
}

export function processBackgroundImage(
    fields,
    merchCard,
    backgroundImageConfig,
) {
    if (fields.backgroundImage) {
        const imgAttributes = {
            loading: merchCard.loading ?? 'lazy',
            src: fields.backgroundImage,
        };
        if (fields.backgroundImageAltText) {
            imgAttributes.alt = fields.backgroundImageAltText;
        } else {
            imgAttributes.role = 'none';
        }
        if (!backgroundImageConfig) return;
        if (backgroundImageConfig?.attribute) {
            merchCard.setAttribute(
                backgroundImageConfig.attribute,
                fields.backgroundImage,
            );
            return;
        }
        merchCard.append(
            createTag(
                backgroundImageConfig.tag,
                { slot: backgroundImageConfig.slot },
                createTag('img', imgAttributes),
            ),
        );
    }
}

export function processPrices(fields, merchCard, mapping) {
  appendSlot('prices', fields, merchCard, mapping); 
}

export function processDescription(fields, merchCard, mapping) {
  appendSlot('promoText', fields, merchCard, mapping);
  appendSlot('description', fields, merchCard, mapping);
  appendSlot('callout', fields, merchCard, mapping);
  appendSlot('quantitySelect', fields, merchCard, mapping);
  appendSlot('whatsIncluded', fields, merchCard, mapping);
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

export function getTruncatedTextData(text, limit, withSuffix = true) {
    try {
        const _text = typeof text !== 'string' ? '' : text;
        const cleanText = clearTags(_text);
        if (cleanText.length <= limit) return [_text, cleanText];

        let index = 0;
        let inTag = false;
        let remaining = withSuffix ? (limit - TEXT_TRUNCATE_SUFFIX.length < 1 ? 1 : limit - TEXT_TRUNCATE_SUFFIX.length) : limit;
        let openTags = [];

        for (const char of _text) {
            index++;
            if (char === '<') {
                inTag = true;
                // Check next character
                if (_text[index] === '/') {
                    openTags.pop();
                }
                else {
                    let tagName = '';
                    for (const tagChar of _text.substring(index)) {
                        if (tagChar === ' ' || tagChar === '>') break;
                        tagName += tagChar;
                    }
                    openTags.push(tagName);
                }
            }
            if (char === '/') {
                // Check next character
                if (_text[index] === '>') {
                    openTags.pop();
                }
            }
            if (char === '>') {
                inTag = false;
                continue;
            }
            if (inTag) continue;
            remaining--;
            if (remaining === 0) break;
        }

        let trimmedText = _text.substring(0, index).trim();
        if (openTags.length > 0) {
            if (openTags[0] === 'p') openTags.shift();
            for (const tag of openTags.reverse()) {
                trimmedText += `</${tag}>`
            }
  }
        let truncatedText = `${trimmedText}${withSuffix ? TEXT_TRUNCATE_SUFFIX : ''}`;
        return [truncatedText, cleanText];
    } catch (error) {
        // Fallback to original text without truncation
        const fallbackText = typeof text === 'string' ? text : '';
        const cleanFallback = clearTags(fallbackText);
        return [fallbackText, cleanFallback];
    }
}

function clearTags(text) {
    if (!text) return '';

    let result = '';
    let inTag = false;
    for (const char of text) {
        if (char === '<') inTag = true;
        if (char === '>') {
            inTag = false;
            continue;
        }
        if (inTag) continue;
        result += char;
    }
    return result;
}

export function processUptLinks(fields, merchCard) {
    const placeholders = merchCard.querySelectorAll('a.upt-link');
    placeholders.forEach(placeholder => {
        const uptLink = UptLink.createFrom(placeholder);
        placeholder.replaceWith(uptLink);
        uptLink.initializeWcsData(fields.osi, fields.promoCode);
    });
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
    const CheckoutButton = customElements.get('checkout-button');
    const checkoutButton = CheckoutButton.createCheckoutButton(cta.dataset);
    if (cta.dataset.analyticsId) {
        checkoutButton.setAttribute('data-analytics-id', cta.dataset.analyticsId);
    }
    checkoutButton.connectedCallback();
    checkoutButton.render();

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
            ...(cta.dataset.analyticsId && { 'data-analytics-id': cta.dataset.analyticsId }),
        },
        cta.innerHTML,
    );

    spectrumCta.source = checkoutButton;
    checkoutButton.onceSettled().then((target) => {
        spectrumCta.setAttribute('data-navigation-url', target.href);
    });

    spectrumCta.addEventListener('click', (e) => {
        if (e.defaultPrevented) return;
        checkoutButton.click();
    });

    return spectrumCta;
}

function createConsonantButton(cta, isAccent) {
    cta.classList.add('con-button');
    if (isAccent) {
        cta.classList.add('blue');
    }
    return cta;
}

export function processCTAs(fields, merchCard, aemFragmentMapping, variant) {
    if (fields.ctas) {
        const { slot } = aemFragmentMapping.ctas;
        const footer = createTag('div', { slot }, fields.ctas);

        const ctas = [...footer.querySelectorAll('a')].map((cta) => {
            const checkoutLinkStyle =
                CHECKOUT_STYLE_PATTERN.exec(cta.className)?.[0] ?? 'accent';
            const isAccent = checkoutLinkStyle.includes('accent');
            const isPrimary = checkoutLinkStyle.includes('primary');
            const isSecondary = checkoutLinkStyle.includes('secondary');
            const isOutline = checkoutLinkStyle.includes('-outline');
            const isLink = checkoutLinkStyle.includes('-link');
            if (merchCard.consonant) return createConsonantButton(cta, isAccent);
            if (isLink) {
                return cta;
            }

            let variant;
            if (isAccent) {
                variant = 'accent';
            } else if (isPrimary) {
                variant = 'primary';
            } else if (isSecondary) {
                variant = 'secondary';
            }

            return merchCard.spectrum === 'swc'
                ? createSpectrumSwcButton(cta, aemFragmentMapping, isOutline, variant)
                : createSpectrumCssButton(cta, aemFragmentMapping, isOutline, variant);
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
    const elements = [
      ...merchCard.shadowRoot.querySelectorAll(`a[data-analytics-id],button[data-analytics-id]`),
      ...merchCard.querySelectorAll(`a[data-analytics-id],button[data-analytics-id]`)
    ];
    elements.forEach((el, index) => {
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
  'background-color',
  'border-color',
  'badge-background-color',
  'badge-color',
  'badge-text',
  'size',
  ANALYTICS_SECTION_ATTR,
  ];
  attributesToRemove.forEach(attr => merchCard.removeAttribute(attr));
  const classesToRemove = ['wide-strip', 'thin-strip'];
  merchCard.classList.remove(...classesToRemove);
}

export async function hydrate(fragment, merchCard) {
    const { id, fields } = fragment;
    const { variant } = fields;
    if (!variant) throw new Error (`hydrate: no variant found in payload ${id}`);
    // temporary hardcode for plans. this data will be coming from settings (MWPW-166756)
    const settings = {
      stockCheckboxLabel: 'Add a 30-day free trial of Adobe Stock.*', // to be {{stock-checkbox-label}}
      stockOfferOsis: '',
      secureLabel: 'Secure transaction' // to be {{secure-transaction}}
    };
    cleanup(merchCard);
    merchCard.id ??= fragment.id;


    merchCard.removeAttribute('background-image');
    merchCard.removeAttribute('background-color');
    merchCard.removeAttribute('badge-background-color');
    merchCard.removeAttribute('badge-color');
    merchCard.removeAttribute('badge-text');
    merchCard.removeAttribute('size');
    merchCard.classList.remove('wide-strip');
    merchCard.classList.remove('thin-strip');
    merchCard.removeAttribute(ANALYTICS_SECTION_ATTR);

    merchCard.variant = variant;
    await merchCard.updateComplete;

    const { aemFragmentMapping } = merchCard.variantLayout;
    if (!aemFragmentMapping) throw new Error (`hydrate: aemFragmentMapping found for ${id}`)

    if (aemFragmentMapping.style === 'consonant') {
      merchCard.setAttribute('consonant', true);
    }
    processMnemonics(fields, merchCard, aemFragmentMapping.mnemonics);
    processBadge(fields, merchCard, aemFragmentMapping);
    processSize(fields, merchCard, aemFragmentMapping.size);
    processTitle(fields, merchCard, aemFragmentMapping.title);
    processSubtitle(fields, merchCard, aemFragmentMapping);
    processPrices(fields, merchCard, aemFragmentMapping);
    processBackgroundImage(
        fields,
        merchCard,
        aemFragmentMapping.backgroundImage,
    );
    processBackgroundColor(fields, merchCard, aemFragmentMapping.allowedColors);
    processBorderColor(fields, merchCard, aemFragmentMapping.borderColor);
    processDescription(fields, merchCard, aemFragmentMapping);
    processStockOffersAndSecureLabel(fields, merchCard, aemFragmentMapping, settings);
    processUptLinks(fields, merchCard);
    processCTAs(fields, merchCard, aemFragmentMapping, variant);
    processAnalytics(fields, merchCard);
    updateLinksCSS(merchCard);
}
