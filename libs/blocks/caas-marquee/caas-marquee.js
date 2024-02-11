import { getMetadata } from '../caas-marquee-metadata/caas-marquee-metadata.js';
import { createTag } from '../../utils/utils.js';

// 3 seconds max wait time for marquee to load
const MAX_WAIT_TIME = 3000;

const typeSize = {
  small: ['xl', 'm', 'm'],
  medium: ['xl', 'm', 'm'],
  large: ['xxl', 'xl', 'l'],
  xlarge: ['xxl', 'xl', 'l'],
};

async function getAllMarquees(promoId) {
  const endPoint = 'https://14257-chimera-feature.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
  const payload = `originSelection=milo&collectionTags=caas%3Acontent-type%2Fpromotion&marqueeId=${promoId || 'homepage'}`;
  return fetch(`${endPoint}?${payload}`).then((res) => res.json());
}

/**
 * function getMarqueeId() : Eventually from Spectra API
 * @returns {string} id - currently marquee index (eventually will be marquee ID from Spectra)
 */
async function getMarqueeId() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('marqueeId')) return urlParams.get('marqueeId');

  let segments = ['indesign', 'photoshop']; // will come from API but hard coded for now
  let visitedLinks = [document.referrer];
  let response = await fetch('https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'ChimeraAcom'
    },
    body: `{"endpoint":"community-recom-v1","contentType":"application/json","payload":{"data":{"visitedLinks": ${visitedLinks}, "segments": ${segments}}}}`
  });
  let json = await response.json();
  return json.data[0].content_id;
}

/**
 * function normalizeData()
 * @param {*} data - marquee JSON data
 * @returns {Object} metadata - marquee data
 */
function normalizeData(data) {
  const images = {
    tablet: data.arbitrary?.find((item) => item.key === 'imageTablet')?.value,
    desktop: data.arbitrary?.find((item) => item.key === 'imageDesktop')?.value,
  };

  const metadata = {
    id: data.id,
    title: data.contentArea?.title,
    description: data.contentArea?.description,
    detail: data.contentArea?.detailText,
    image: data.styles?.backgroundImage,
    imagetablet: images.tablet,
    imagedesktop: images.desktop,
    cta1url: data.footer[0].right[0]?.href,
    cta1text: data.footer[0]?.right[0]?.text,
    cta1style: data.footer[0]?.right[0]?.style,
    cta2url: data.footer[0]?.center[0]?.href,
    cta2text: data.footer[0]?.center[0]?.text,
    cta2style: data.footer[0]?.center[0]?.style,
  };

  const arbitrary = {};
  data.arbitrary?.forEach((item) => { arbitrary[item.key] = item.value; });
  metadata.variant = arbitrary.variant || 'dark, static-links';

  return metadata;
}

/**
 * function renderMarquee()
 * @param {HTMLElement} marquee - marquee container
 * @param {Object} data - marquee data
 * @param {string} id - marquee id
 * @returns {void}
 */
export function renderMarquee(marquee, data, id) {
  if (marquee.classList.contains('fallback')) return;
  let chosen = data.cards.filter(obj => obj.id === id)[0];
  const metadata = data.cards ? normalizeData(chosen) : data;

  // remove loader
  marquee.innerHTML = '';

  // configure block font sizes
  const classList = metadata.variant.split(',').map((c) => c.trim());
  /* eslint-disable no-nested-ternary */
  const size = classList.includes('small') ? 'small'
    : classList.includes('medium') ? 'medium'
      : classList.includes('large') ? 'large'
        : 'xlarge';
  /* eslint-enable no-nested-ternary */

  // background content
  const bgContent = `<div class="mobile-only">
    <picture>
      <source type="image/webp" srcset="${metadata.image}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="${metadata.image}?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="${metadata.image}?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="eager" alt="" src="${metadata.image}?width=750&amp;format=jpeg&amp;optimize=medium" width="1440" height="992" fetchpriority="high">
    </picture>
  </div>
  <div class="tablet-only">
    <picture>
      <source type="image/webp" srcset="${metadata.imagetablet}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="${metadata.imagetablet}?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/jpeg" srcset="${metadata.imagetablet}?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="${metadata.imagetablet}?width=750&amp;format=jpeg&amp;optimize=medium" width="2048" height="520">
  </picture>
  </div>
  <div class="desktop-only">
    <picture>
      <source type="image/webp" srcset="${metadata.imagedesktop}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="${metadata.imagedesktop}?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/png" srcset="${metadata.imagedesktop}?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="${metadata.imagedesktop}?width=750&amp;format=png&amp;optimize=medium" width="2400" height="813" style="object-position: 32% center;">
    </picture>
  </div>`;

  const background = createTag('div', { class: 'background' });
  background.innerHTML = bgContent;

  let cta1Style = (metadata.cta1style === "blue" || metadata.cta1style === "outline") ?
    `con-button ${metadata.cta1style} button-${typeSize[size][1]} button-justified-mobile` : "";

  let cta2Style = (metadata.cta2style === "blue" || metadata.cta2style === "outline") ?
    `con-button ${metadata.cta2style} button-${typeSize[size][1]} button-justified-mobile` : "";

  // foreground content
  let cta = metadata.cta1url
    ? `<a 
      class="${cta1Style}" 
      href="${metadata.cta1url}">${metadata.cta1text}</a>`
    : '';

  if(metadata.cta1url.includes('fragment')){
    let fragment = metadata.cta1url.split("#")[0];
    let hash = metadata.cta1url.split("#")[1];
    cta = `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="Launch modal-1--Modal examples" class="modal link-block ${cta1Style}">${metadata.cta1text}</a>`
  }

  let cta2 = metadata.cta2url
    ? `<a 
      class="${cta2Style}"
      href="${metadata.cta2url}">${metadata.cta2text}</a>`
    : '';

  if(metadata.cta2url?.includes('fragment')){
    let fragment = metadata.cta2url.split("#")[0];
    let hash = metadata.cta2url.split("#")[1];
    cta2 = `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="Launch modal-1--Modal examples" class="modal link-block ${cta2Style}">${metadata.cta2text}</a>`
  }

  const fgContent = `<div class="text">
    <p class="detail-l">${metadata.detail}</p>
    <h1 class="heading-${typeSize[size][0]}">${metadata.title}</h1>
    <p class="body-${typeSize[size][1]}">${metadata.description}</p>
    <p class="action-area">
      ${cta} 
      ${cta2}
      </p>  
  </div>`;

  const foreground = createTag('div', { class: 'foreground container' });
  foreground.innerHTML = fgContent;

  // apply marquee variant to viewer
  if (metadata.variant) {
    const classes = metadata.variant.split(' ').map((c) => c.trim());
    marquee.classList.add(...classes);
  }

  marquee.append(background, foreground);
}

/**
 * function init()
 * @param {*} el - element with metadata for marquee
 */
export default async function init(el) {
  const metadata = getMetadata(el);

  const marquee = createTag('div', { class: `marquee split ${metadata.variant.replaceAll(',', ' ')}` });
  marquee.innerHTML = '<div class="lds-ring LOADING"><div></div><div></div><div></div><div></div></div>';
  el.parentNode.prepend(marquee);

  // Commented out this code for now.
  // We will need to handle failures by getting the promise states of all the various API calls
  // (and putting timeouts per call) versus doing one global set timeout.
  //
  // setTimeout(() => {
  //   // In case of failure
  //   if (marquee.children.length !== 2) {
  //     // If there is a fallback marquee provided, we use it.
  //     // Otherwise, we use this strings as the last resort fallback
  //     metadata.title = metadata.title || 'Welcome to Adobe';
  //     metadata.description = metadata.description || 'Do it all with Adobe Creative Cloud.';
  //     renderMarquee(marquee, metadata, null);
  //     marquee.classList.add('fallback');
  //   }
  // }, MAX_WAIT_TIME);

  const selectedId = await getMarqueeId();
  const allMarqueesJson = await getAllMarquees(metadata.promoId || 'homepage');
  await renderMarquee(marquee, allMarqueesJson, selectedId);
}
