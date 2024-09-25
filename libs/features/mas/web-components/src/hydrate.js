import { createTag } from './utils.js';

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
    fragment.model = fragment.model;

    merchCard.variant = variant;
    await merchCard.updateComplete;
    const { aemFragmentMapping } = merchCard.variantLayout;

    if (!aemFragmentMapping) return;

    merchCard.variantLayout.refs ??= [];
    merchCard.variantLayout.refs.forEach((ref) => ref.remove());
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

    /* c8 ignore next 3 */
    if (fragment.size && aemFragmentMapping.allowedSizes?.includes(fragment.size)) {
        merchCard.setAttribute('size', fragment.size);
    }

    if (fragment.cardTitle && aemFragmentMapping.title) {
        appendFn(
            createTag(
                aemFragmentMapping.title.tag,
                { slot: aemFragmentMapping.title.slot },
                fragment.cardTitle,
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
        const footer = createTag('div', { slot: 'footer' }, fragment.ctas);
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
