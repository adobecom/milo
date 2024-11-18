import { createTag } from './utils.js';

const DEFAULT_BADGE_COLOR = '#000000';
const DEFAULT_BADGE_BACKGROUND_COLOR = '#F8D904';
const CHECKOUT_LINK_STYLE_PATTERN =
    /(accent|primary|secondary)(-(outline|link))?/;

function processMnemonics(fields, merchCard, aemFragmentMapping) {
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
                href = '#';
            }
        }

        const attrs = {
            slot: 'icons',
            src,
            size: aemFragmentMapping.mnemonics?.size ?? 'l',
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

function processSize(fields, merchCard, allowedSizes) {
    if (allowedSizes?.includes(fields.size)) {
        merchCard.setAttribute('size', fields.size);
    }
}

function processTitle(fields, merchCard, titleConfig) {
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
    variant,
) {
    if (fields.backgroundImage) {
        switch (variant) {
            case 'ccd-slice':
                if (backgroundImageConfig) {
                    merchCard.append(
                        createTag(
                            backgroundImageConfig.tag,
                            { slot: backgroundImageConfig.slot },
                            `<img loading="lazy" src="${fields.backgroundImage}" />`,
                        ),
                    );
                }
                break;
            case 'ccd-suggested':
                merchCard.setAttribute(
                    'background-image',
                    fields.backgroundImage,
                );
                break;
        }
    }
}

function processPrices(fields, merchCard, pricesConfig) {
    if (fields.prices && pricesConfig) {
        const headingM = createTag(
            pricesConfig.tag,
            { slot: pricesConfig.slot },
            fields.prices,
        );
        merchCard.append(headingM);
    }
}

function processDescription(fields, merchCard, descriptionConfig) {
    if (fields.description && descriptionConfig) {
        const body = createTag(
            descriptionConfig.tag,
            { slot: descriptionConfig.slot },
            fields.description,
        );
        merchCard.append(body);
    }
}

function createSpectrumButton(cta, strong, aemFragmentMapping, cardVariant) {
    if (cardVariant === 'ccd-suggested' && !cta.className) {
        cta.className = 'primary-link'; //workaround for existing ccd-suggested cards
    }
    const checkoutLinkStyle =
        CHECKOUT_LINK_STYLE_PATTERN.exec(cta.className)?.[0] ?? 'accent';
    const isAccent = checkoutLinkStyle.includes('accent');
    const isPrimary = checkoutLinkStyle.includes('primary');
    const isSecondary = checkoutLinkStyle.includes('secondary');
    const isOutline = checkoutLinkStyle.includes('-outline');
    const isLink = checkoutLinkStyle.includes('-link');

    if (isLink) {
        return cta;
    }

    let treatment = 'fill';
    let variant;

    if (isAccent || strong) {
        variant = 'accent';
    } else if (isPrimary) {
        variant = 'primary';
    } else if (isSecondary) {
        variant = 'secondary';
    }

    if (isOutline) {
        treatment = 'outline';
    }

    cta.tabIndex = -1;
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
            return merchCard.consonant
                ? processConsonantButton(cta, strong)
                : createSpectrumButton(
                      cta,
                      strong,
                      aemFragmentMapping,
                      variant,
                  );
        });

        footer.innerHTML = '';
        footer.append(...ctas);
        merchCard.append(footer);
    }
}

export async function hydrate(fragment, merchCard) {
    const { fields } = fragment;
    const { variant } = fields;
    if (!variant) return;

    // remove all previous slotted content except the default slot
    merchCard.querySelectorAll('[slot]').forEach((el) => {
        el.remove();
    });

    merchCard.removeAttribute('background-image');
    merchCard.removeAttribute('badge-background-color');
    merchCard.removeAttribute('badge-color');
    merchCard.removeAttribute('badge-text');
    merchCard.removeAttribute('size');

    merchCard.variant = variant;
    await merchCard.updateComplete;

    const { aemFragmentMapping } = merchCard.variantLayout;
    if (!aemFragmentMapping) return;

    processMnemonics(fields, merchCard, aemFragmentMapping);

    processBadge(fields, merchCard);
    processSize(fields, merchCard, aemFragmentMapping.allowedSizes);
    processTitle(fields, merchCard, aemFragmentMapping.title);
    processSubtitle(fields, merchCard, aemFragmentMapping.subtitle);
    processBackgroundImage(
        fields,
        merchCard,
        aemFragmentMapping.backgroundImage,
        variant,
    );
    processPrices(fields, merchCard, aemFragmentMapping.prices);
    processDescription(fields, merchCard, aemFragmentMapping.description);
    processCTAs(fields, merchCard, aemFragmentMapping, variant);
}
