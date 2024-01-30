import { getMetadata } from '../caas-marquee-metadata/caas-marquee-metadata.js';
import { createTag } from '../../utils/utils.js';

const typeSize = {
  small: ['xl', 'm', 'm'],
  medium: ['xl', 'm', 'm'],
  large: ['xxl', 'xl', 'l'],
  xlarge: ['xxl', 'xl', 'l'],
};

function getMarqueeData(marqueeId) {
  const endPoint = 'https://14257-chimera-feature.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
  const payload = `originSelection=milo&collectionTags=caas%3Acontent-type%2Fpromotion&marqueeId=${marqueeId || 'homepage'}`;
  return fetch(`${endPoint}?${payload}`).then((res) => res.json());
}

// function renderMarquee(marquee, data) {
//   console.log('renderMarquee()', marquee, data);
//   // background images for mobilr, tablet, and desktop
//   const imgDesktop = createTag('img', { class: 'background', src: data.styles.backgroundImage });
//   const picture = createTag('picture', null, imgDesktop);
//   const desktopOnly = createTag('div', { class: 'desktop-only' }, picture);
//   marquee.append(desktopOnly);
// }

// Get marquee id (eventually from Spectra)
function getMarqueeId() {
  // return Math.floor(Math.random() * Math.floor(6));
  return 6;
}

// Parse card data
function parseMarqueeData(marquee) {
  console.log('parseMarqueeData()', marquee);
  const data = {
    id: marquee.id,
    title: marquee.contentArea.title,
    description: marquee.contentArea.description,
    detail: marquee.contentArea.detailText,
    image: marquee.styles.backgroundImage,
    imagetablet: marquee.imagetablet,
    imagedesktop: marquee.imagedesktop,
    cta1url: marquee.footer[0].right[0].href,
    cta1text: marquee.footer[0].right[0].text,
    cta1style: marquee.footer[0].right[0].style,
    cta2url: marquee.footer[0].center[0]?.href,
    cta2text: marquee.footer[0].center[0]?.text,
    cta2style: marquee.footer[0].center[0]?.style,
  };

  const arbitrary = {};
  marquee.arbitrary.forEach((item) => { arbitrary[item.key] = item.value; });
  data.arbitrary = arbitrary;

  return data;
}

export function renderMarquee(marquee, data) {
  console.log('renderMarquee()', marquee, data);
  const metadata = parseMarqueeData(data);
  console.log('METADATA', metadata);

  // configure block font sizes
  const classList = metadata.variant.split(',').map((c) => c.trim());
  /* eslint-disable no-nested-ternary */
  const size = classList.includes('small') ? 'small'
    : classList.includes('medium') ? 'medium'
      : classList.includes('large') ? 'large'
        : 'xlarge';
  /* eslint-enable no-nested-ternary */

  // background images for mobile, tablet, and desktop
  const imgDesktop = createTag('img', { class: 'background', src: metadata.imagedesktop || metadata.image });
  const picture = createTag('picture', null, imgDesktop);
  const desktopOnly = createTag('div', { class: 'desktop-only' }, picture);

  const imgTablet = createTag('img', { class: 'background', src: metadata.imagetablet || metadata.image });
  const pictureTablet = createTag('picture', null, imgTablet);
  const tabletOnly = createTag('div', { class: 'tablet-only' }, pictureTablet);

  const imgMobile = createTag('img', { class: 'background', src: metadata.imagemobile || metadata.image });
  const pictureMobile = createTag('picture', null, imgMobile);
  const mobileOnly = createTag('div', { class: 'mobile-only' }, pictureMobile);

  const background = createTag('div', { class: 'background' });
  background.append(mobileOnly, tabletOnly, desktopOnly);

  // foreground copy
  const title = createTag('h1', { class: `heading-${typeSize[size][0]}` }, metadata.title);
  const body = createTag('p', { class: `body-${typeSize[size][1]}` }, metadata.description);

  // ctas (buttons)
  const cta = metadata.cta1url ? createTag('a', {
    class: `con-button ${metadata.cta1style} button-${typeSize[size][1]} button-justified-mobile`,
    href: metadata.cta1url,
  }, metadata.cta1text) : null;

  const cta2 = metadata.cta2url ? createTag('a', {
    class: `con-button ${metadata.cta2style} button-${typeSize[size][1]} button-justified-mobile`,
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
  const classListString = classList.join(' ');
  const section = createTag('div', { class: `marquee large ${classListString}` });
  section.append(background, foreground);

  // return section;
  marquee.append(section);
}

export default async function init(el) {
  const metadata = getMetadata(el);

  const marquee = createTag('div', { class: `marquee ${metadata.variant}` });
  el.parentNode.prepend(marquee);

  getMarqueeData(metadata.marqueeId)
    .then((data) => renderMarquee(marquee, data.cards[getMarqueeId()]));
}
