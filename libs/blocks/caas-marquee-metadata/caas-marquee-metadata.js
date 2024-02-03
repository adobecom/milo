import { createTag } from '../../utils/utils.js';

export function getMetadata(el) {
  const metadata = {};
  for (const child of el.children) {
    const key = child.children[0]?.textContent?.trim()?.toLowerCase();
    const value = child.children[1]?.innerHTML?.trim();
    if (key.match(/^image/)) {
      metadata[key] = child.querySelector('img').src.replace(/\?.*/, '');
    } else if (key.match(/^cta/)) {
      const ctaLink = child.querySelectorAll('a');
      ctaLink?.forEach((link, index) => {
        const count = index + 1;
        metadata[`cta${count}url`] = link.href;
        metadata[`cta${count}text`] = link.textContent.trim();
        /* eslint-disable no-nested-ternary */
        metadata[`cta${count}style`] = link.parentNode.tagName === 'STRONG' ? 'blue'
          : link.parentNode.tagName === 'EM' ? 'outline' : '';
        /* eslint-enable no-nested-ternary */
      });
    } else {
      metadata[key] = value;
    }
  }
  return metadata;
}

export default function init(el) {
  const metadata = getMetadata(el);

  // Update caas-metadata arbitrary field
  const arbitrary = createTag('div');
  const arbitraryKey = createTag('div', null, 'arbitrary');
  const arbitraryValue = createTag('div', null, (`promoId: ${metadata.promoid},
    imageTablet: ${metadata.imagetablet || ''},
    imageDesktop: ${metadata.imagedesktop || ''},
    variant: ${metadata.variant || ''},
    context: ${metadata.context || ''},
  `).replace(/\s+/g, ' '));
  arbitrary.append(arbitraryKey, arbitraryValue);
  el.append(arbitrary);

  el.innerHTML += `<div><div>tags</div><div>caas:content-type/promotion</div></div>
    <div><div>cta1url</div><div>${metadata.cta1url}</div></div>
    <div><div>cta1text</div><div>${metadata.cta1text}</div></div>
    <div><div>cta1style</div><div>${metadata.cta1style}</div></div>
    <div><div>cta2url</div><div>${metadata.cta2url}</div></div>
    <div><div>cta2text</div><div>${metadata.cta2text}</div></div>
    <div><div>cta2style</div><div>${metadata.cta2style}</div></div>`;
}
