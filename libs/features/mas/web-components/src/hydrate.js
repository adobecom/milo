import { createTag } from './utils.js';

const DEFAULT_BADGE_COLOR = '#000000';
const DEFAULT_BADGE_BACKGROUND_COLOR = '#F8D904';
export async function hydrate(fragmentData, merchCard) {
    const fragment = fragmentData.fields.reduce(
        (acc, { name, multiple, values }) => {
            acc[name] = multiple ? values : values[0];
            return acc;
        },
        { id: fragmentData.id },
    );
    const { variant } = fragment;
    if (!variant) return;

    // remove all previous slotted content except the default slot
    merchCard.querySelectorAll('[slot]').forEach((el) => {
        el.remove();
    });
    merchCard.variant = variant;
    await merchCard.updateComplete;

    const { aemFragmentMapping } = merchCard.variantLayout;

    if (!aemFragmentMapping) return;

    const mnemonics = fragment.mnemonicIcon?.map((icon, index) => ({
        icon,
        alt: fragment.mnemonicAlt[index] ?? '',
        link: fragment.mnemonicLink[index] ?? '',
    }));

    fragmentData.computed = { mnemonics };

    mnemonics.forEach(({ icon: src, alt, link: href }) => {
        if (!/^https?:/.test(href)) {
          // add https
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
            size: 'l',
        });
        merchCard.append(merchIcon);
    });

    if (fragment.badge) {
      merchCard.setAttribute('badge-text', fragment.badge);
      merchCard.setAttribute('badge-color', fragment.badgeColor || DEFAULT_BADGE_COLOR);
      merchCard.setAttribute('badge-background-color', fragment.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR);
    }

    /* c8 ignore next 2 */
    if (!fragment.size) {
        merchCard.removeAttribute('size');
    } else if (aemFragmentMapping.allowedSizes?.includes(fragment.size))
        merchCard.setAttribute('size', fragment.size);

    if (fragment.cardTitle && aemFragmentMapping.title) {
        merchCard.append(
            createTag(
                aemFragmentMapping.title.tag,
                { slot: aemFragmentMapping.title.slot },
                fragment.cardTitle,
            ),
        );
    }

    /* c8 ignore next 9 */
    if (fragment.subtitle && aemFragmentMapping.subtitle) {
        merchCard.append(
            createTag(
                aemFragmentMapping.subtitle.tag,
                { slot: aemFragmentMapping.subtitle.slot },
                fragment.subtitle,
            ),
        );
    }

    if (fragment.backgroundImage && aemFragmentMapping.backgroundImage) {
        // TODO improve image logic
        merchCard.append(
            createTag(
                aemFragmentMapping.backgroundImage.tag,
                { slot: aemFragmentMapping.backgroundImage.slot },
                `<img loading="lazy" src="${fragment.backgroundImage}" />`,
            ),
        );
    }

    if (fragment.prices && aemFragmentMapping.prices) {
        const prices = fragment.prices;
        const headingM = createTag(
            aemFragmentMapping.prices.tag,
            { slot: aemFragmentMapping.prices.slot },
            prices,
        );
        merchCard.append(headingM);
    }

    if (fragment.description && aemFragmentMapping.description) {
        const body = createTag(
            aemFragmentMapping.description.tag,
            { slot: aemFragmentMapping.description.slot },
            fragment.description,
        );
        merchCard.append(body);
    }

    if (fragment.ctas) {
        const { slot, button = true } = aemFragmentMapping.ctas;
        const footer = createTag(
            'div',
            { slot: slot ?? 'footer' },
            fragment.ctas,
        );
        const ctas = [];
        [...footer.querySelectorAll('a')].forEach((cta) => {
            const strong = cta.parentElement.tagName === 'STRONG';
            if (merchCard.consonant) {
                cta.classList.add('con-button');
                if (strong) {
                    cta.classList.add('blue');
                }
                ctas.push(cta);
            } else {
                /* c8 ignore next 4 */
                if (!button) {
                    ctas.push(cta);
                    return;
                }
                const treatment = strong ? 'fill' : 'outline';
                const variant = strong ? 'accent' : 'primary';
                const spectrumCta = createTag(
                    'sp-button',
                    { treatment, variant },
                    cta,
                );
                spectrumCta.addEventListener('click', (e) => {
                    /* c8 ignore next 4 */
                    if (e.target === spectrumCta) {
                        e.stopPropagation();
                        cta.click();
                    }
                });
                ctas.push(spectrumCta);
            }
        });
        footer.innerHTML = '';
        footer.append(...ctas);
        merchCard.append(footer);
    }
}
