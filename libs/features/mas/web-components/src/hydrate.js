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

    merchCard.variantLayout?.refs?.forEach((ref) => ref.remove());
    merchCard.variant = variant;
    await merchCard.updateComplete;
    merchCard.variantLayout.refs ??= [];
    const { aemFragmentMapping } = merchCard.variantLayout;

    if (!aemFragmentMapping) return;

    const appendFn = (el) => {
        merchCard.variantLayout.refs.push(el);
        merchCard.append(el);
    };

    fragment.mnemonicIcon?.forEach((icon, idx) => {
        const href =
            fragment.mnemonicLink?.length > idx
                ? fragment.mnemonicLink[idx]
                : '';
        const alt =
            fragment.mnemonicAlt?.length > idx ? fragment.mnemonicAlt[idx] : '';
        const merchIcon = createTag('merch-icon', {
            slot: 'icons',
            src: icon,
            alt,
            href,
            size: 'l',
        });
        appendFn(merchIcon);
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
        appendFn(
            createTag(
                aemFragmentMapping.title.tag,
                { slot: aemFragmentMapping.title.slot },
                fragment.cardTitle,
            ),
        );
    }

    if (fragment.subtitle && aemFragmentMapping.subtitle) {
        appendFn(
            createTag(
                aemFragmentMapping.subtitle.tag,
                { slot: aemFragmentMapping.subtitle.slot },
                fragment.subtitle,
            ),
        );
    }

    if (fragment.backgroundImage && aemFragmentMapping.backgroundImage) {
        // TODO improve image logic
        appendFn(
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
        appendFn(headingM);
    }

    if (fragment.description && aemFragmentMapping.description) {
        const body = createTag(
            aemFragmentMapping.description.tag,
            { slot: aemFragmentMapping.description.slot },
            fragment.description,
        );
        appendFn(body);
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
        appendFn(footer);
    }
}
