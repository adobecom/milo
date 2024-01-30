import { createTag } from '../../utils/utils.js';
import { renderMarquee } from '../caas-marquee/caas-marquee.js';

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
        metadata[`cta${index + 1}url`] = link.href;
        metadata[`cta${index + 1}text`] = link.textContent.trim();
        /* eslint-disable no-nested-ternary */
        metadata[`cta${index + 1}style`] = link.parentNode.tagName === 'STRONG' ? 'blue'
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
    imageSm: ${metadata.imagemobile || ''},
    imageMd: ${metadata.imagetablet || ''},
  `).replace(/\s+/g, ' '));
  arbitrary.append(arbitraryKey, arbitraryValue);
  el.append(arbitrary);

  el.innerHTML += `<div><div>tags</div><div>caas:content-type/promotion</div></div>
    <div><div>cta1url</div><div>${metadata.cta1url}</div></div>
    <div><div>cta1text</div><div>${metadata.cta1text}</div></div>
    <div><div>cta1style</div><div>${metadata.cta1style}</div></div>`;

  // Render marquee
  el.parentNode.append(renderMarquee(metadata));

  // Degugging ((( Remove before release )))
  console.log('metadata:', getMetadata(el)); // eslint-disable-line no-console
}
