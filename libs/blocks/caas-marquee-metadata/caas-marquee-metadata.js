import { createTag } from '../../utils/utils.js';

const typeSize = {
  small: ['xl', 'm', 'm'],
  medium: ['xl', 'm', 'm'],
  large: ['xxl', 'xl', 'l'],
  xlarge: ['xxl', 'xl', 'l'],
};

function getMetadata(el) {
  const metadata = {};
  for (const child of el.children) {
    const key = child.children[0]?.textContent?.trim()?.toLowerCase();
    const value = child.children[1]?.innerHTML?.trim();
    if (key.match(/^image/)) {
      metadata[key] = child.querySelector('img').src.replace(/\?.*/, '');
    } else if (key.match(/^cta/)) {
      const ctaLink = child.querySelector('a');
      metadata[`${key}url`] = ctaLink.href;
      metadata[`${key}text`] = ctaLink.textContent.trim();
      /* eslint-disable no-nested-ternary */
      metadata[`${key}style`] = ctaLink.parentNode.tagName === 'STRONG' ? 'blue'
        : ctaLink.parentNode.tagName === 'EM' ? 'outline' : '';
      /* eslint-enable no-nested-ternary */
    } else {
      metadata[key] = value;
    }
  }
  return metadata;
}

export default function init(el) {
  const metadata = getMetadata(el);

  // configure block font sizes
  const classList = el.classList.toString().split(' ');
  /* eslint-disable no-nested-ternary */
  const size = classList.includes('small') ? 'small'
    : classList.includes('medium') ? 'medium'
      : classList.includes('large') ? 'large'
        : 'xlarge';
  /* eslint-enable no-nested-ternary */

  // background images for mobilr, tablet, and desktop
  const img = createTag('img', { class: 'background', src: metadata.image });
  const picture = createTag('picture', null, img);
  const desktopOnly = createTag('div', { class: 'desktop-only' }, picture);

  const imgTablet = createTag('img', { class: 'background', src: metadata.imagetablet });
  const pictureTablet = createTag('picture', null, imgTablet);
  const tabletOnly = createTag('div', { class: 'tablet-only' }, pictureTablet);

  const imgSm = createTag('img', { class: 'background', src: metadata.imagemobile });
  const pictureSm = createTag('picture', null, imgSm);
  const mobileOnly = createTag('div', { class: 'mobile-only' }, pictureSm);

  const background = createTag('div', { class: 'background' });
  background.append(desktopOnly, tabletOnly, mobileOnly);

  // foreground copy
  const title = createTag('h1', { class: `heading-${typeSize[size][0]}` }, metadata.title);
  const body = createTag('p', { class: `body-${typeSize[size][1]}` }, metadata.description);

  // ctas (buttons)
  const cta = metadata.ctaurl ? createTag('a', {
    class: `con-button blue button-${typeSize[size][1]} button-justified-mobile`,
    href: metadata.ctaurl,
  }, metadata.ctatext) : null;

  const cta2 = metadata.cta2url ? createTag('a', {
    class: `con-button outline button-${typeSize[size][1]} button-justified-mobile`,
    href: metadata.cta2url,
  }, metadata.cta2text) : null;

  // action-area footer
  const footer = createTag('p', { class: 'action-area' });
  if (cta) footer.append(cta);
  if (cta2) footer.append(cta2);

  // text copy area
  const text = createTag('div', { class: 'text' });
  text.append(title, body, footer);
  const foreground = createTag('div', { class: 'foreground container' }, text);

  // marquee container
  const classListString = classList.join(' ').replace('caas-marquee', 'marquee');
  const section = createTag('div', { class: `${classListString}` });
  section.append(background, foreground);

  // page section container
  const pageSection = document.querySelector('.section');
  pageSection.prepend(section);

  // arbitrary fields caas-metadata
  const arbitrary = createTag('div');
  const arbitraryKey = createTag('div', null, 'arbitrary');
  const arbitraryValue = createTag('div', null, `promoId: ${metadata.promoid},
    classList: ${classListString},
    imageSm: ${metadata.imagemobile || ''},
    imageMd: ${metadata.imagetablet || ''},
    ctaStyle: ${metadata.ctastyle || ''},
    cta2Style: ${metadata.cta2style || ''},
  `);
  arbitrary.append(arbitraryKey, arbitraryValue);
  el.append(arbitrary);

  el.innerHTML += '<div><div>Tags</div><div>caas:content-type/promotion</div></div>';

  // Degugging ((( Remove before release )))
  console.log('metadata:', metadata); // eslint-disable-line no-console
}
