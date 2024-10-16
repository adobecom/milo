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

    // remove all previous slotted content except the default slot
    merchCard.querySelectorAll('[slot]').forEach((el) => {
        el.remove();
    });
    merchCard.variant = variant;
    await merchCard.updateComplete;

    const { aemFragmentMapping } = merchCard.variantLayout;

    if (!aemFragmentMapping) return;

    const appendFn = (el) => {
        merchCard.append(el);
    };

    const mnemonics = fragment.mnemonicIcon?.map((icon, index) => ({
        icon,
        alt: fragment.mnemonicAlt[index] ?? '',
        link: fragment.mnemonicLink[index] ?? '',
    }));

    fragmentData.computed = { mnemonics };

    mnemonics.forEach(({ icon: src, alt, link: href }) => {
        const merchIcon = createTag('merch-icon', {
            slot: 'icons',
            src,
            alt,
            href,
            size: 'l',
        });
        appendFn(merchIcon);
    });

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
