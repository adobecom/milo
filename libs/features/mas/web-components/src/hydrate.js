import { createTag } from './utils.js';

const DEFAULT_BADGE_COLOR = '#000000';
const DEFAULT_BADGE_BACKGROUND_COLOR = '#F8D904';
const CHECKOUT_LINK_STYLE_PATTERN =
    /(accent|primary|secondary)(-(outline|link))?/;

function processFragment(fragmentData) {
    return fragmentData.fields.reduce(
        (acc, { name, multiple, values }) => {
            acc[name] = multiple ? values : values[0];
            return acc;
        },
        { id: fragmentData.id },
    );
}

function processMnemonics(fragment, merchCard, aemFragmentMapping) {
    const mnemonics = fragment.mnemonicIcon?.map((icon, index) => ({
        icon,
        alt: fragment.mnemonicAlt[index] ?? '',
        link: fragment.mnemonicLink[index] ?? '',
    }));

    mnemonics?.forEach(({ icon: src, alt, link: href }) => {
        if (!/^https?:/.test(href)) {
            try {
                href = new URL(`https://${href}`).href.toString();
            } catch (e) {
                href = '#';
            }
        }
        const merchIcon = createTag('merch-icon', {
            slot: 'icons',
            src,
            alt,
            href,
            size: aemFragmentMapping.mnemonics?.size ?? 'l',
        });
        merchCard.append(merchIcon);
    });

    return mnemonics;
}

function processBadge(fragment, merchCard) {
    if (fragment.badge) {
        merchCard.setAttribute('badge-text', fragment.badge);
        merchCard.setAttribute(
            'badge-color',
            fragment.badgeColor || DEFAULT_BADGE_COLOR,
        );
        merchCard.setAttribute(
            'badge-background-color',
            fragment.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR,
        );
    }
}

function processSize(fragment, merchCard, allowedSizes) {
    if (allowedSizes?.includes(fragment.size)) {
        merchCard.setAttribute('size', fragment.size);
    }
}

function processTitle(fragment, merchCard, titleConfig) {
    if (fragment.cardTitle && titleConfig) {
        merchCard.append(
            createTag(
                titleConfig.tag,
                { slot: titleConfig.slot },
                fragment.cardTitle,
            ),
        );
    }
}

export function processSubtitle(fragment, merchCard, subtitleConfig) {
    if (fragment.subtitle && subtitleConfig) {
        merchCard.append(
            createTag(
                subtitleConfig.tag,
                { slot: subtitleConfig.slot },
                fragment.subtitle,
            ),
        );
    }
}

export function processBackgroundImage(
    fragment,
    merchCard,
    backgroundImageConfig,
    variant,
) {
    if (fragment.backgroundImage) {
        switch (variant) {
            case 'ccd-slice':
                if (backgroundImageConfig) {
                    merchCard.append(
                        createTag(
                            backgroundImageConfig.tag,
                            { slot: backgroundImageConfig.slot },
                            `<img loading="lazy" src="${fragment.backgroundImage}" />`,
                        ),
                    );
                }
                break;
            case 'ccd-suggested':
                merchCard.setAttribute(
                    'background-image',
                    fragment.backgroundImage,
                );
                break;
        }
    }
}

function processPrices(fragment, merchCard, pricesConfig) {
    if (fragment.prices && pricesConfig) {
        const headingM = createTag(
            pricesConfig.tag,
            { slot: pricesConfig.slot },
            fragment.prices,
        );
        merchCard.append(headingM);
    }
}

function processDescription(fragment, merchCard, descriptionConfig) {
    if (fragment.description && descriptionConfig) {
        const body = createTag(
            descriptionConfig.tag,
            { slot: descriptionConfig.slot },
            fragment.description,
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

    const spectrumCta = createTag(
        'sp-button',
        {
            treatment,
            variant,
            tabIndex: -1,
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

export function processCTAs(fragment, merchCard, aemFragmentMapping, variant) {
    if (fragment.ctas) {
        const { slot } = aemFragmentMapping.ctas;
        const footer = createTag('div', { slot }, fragment.ctas);

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

export async function hydrate(fragmentData, merchCard) {
    const fragment = processFragment(fragmentData);
    const { variant } = fragment;
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

    const mnemonics = processMnemonics(fragment, merchCard, aemFragmentMapping);
    fragmentData.computed = { mnemonics };

    processBadge(fragment, merchCard);
    processSize(fragment, merchCard, aemFragmentMapping.allowedSizes);
    processTitle(fragment, merchCard, aemFragmentMapping.title);
    processSubtitle(fragment, merchCard, aemFragmentMapping.subtitle);
    processBackgroundImage(
        fragment,
        merchCard,
        aemFragmentMapping.backgroundImage,
        variant,
    );
    processPrices(fragment, merchCard, aemFragmentMapping.prices);
    processDescription(fragment, merchCard, aemFragmentMapping.description);
    processCTAs(fragment, merchCard, aemFragmentMapping, variant);
}
