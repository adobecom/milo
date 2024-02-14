// TODO: Add lana logging to track API failures for requests
// TODO: Test network latency and if code handles that correctly
// TODO: Go through all code paths to make sure no exceptions occur
// TODO: Fix variants inconsistently supporting both ',' and '' (lines 95, 115, 198, 213)
// TODO: Update SEGMENT_MAP with final from Martech team
// TODO: Update Spectra AI endpoint to final one (instead of pointing to local Chimera IO instance)
// TODO: Fix tablet responsive class issue
// TODO: Update origin to be pulled from consumers

import { getMetadata } from '../caas-marquee-metadata/caas-marquee-metadata.js';
import { createTag } from '../../utils/utils.js';

// TODO: Final list needs to come from Target List before release
const SEGMENT_MAP = {
  '5a5fd14e-f4ca-49d2-9f87-835df5477e3c': 'PHSP',
  '09bc4ba3-ebed-4d05-812d-a1fb1a7e82ae': 'IDSN',
  '25ede755-7181-4be2-801e-19f157c005ae': 'ILST',
  '07609803-48a0-4762-be51-94051ccffb45': 'PPRO',
  '73c3406b-32a2-4465-abf3-2d415b9b1f4f': 'AEFT',
  'bf632803-4412-463d-83c5-757dda3224ee': 'CCSN',
};

const REQUEST_TIMEOUT = 1500;

const typeSize = {
  small: ['xl', 'm', 'm'],
  medium: ['xl', 'm', 'm'],
  large: ['xxl', 'xl', 'l'],
  xlarge: ['xxl', 'xl', 'l'],
};
let segments = ['default'];

// See https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/personalization/custom-personalization.html?lang=en
// for more information on how to integrate with this API.
window.addEventListener('alloy_sendEvent', (e) => {
  if (e.detail.type === 'pageView') {
    let mappedUserSegments = [];
    let userSegmentIds = e.detail?.result?.destinations?.[0]?.segments || [];
    for(let userSegmentId of userSegmentIds){
      if(SEGMENT_MAP[userSegmentId]){
        mappedUserSegments.push(SEGMENT_MAP[userSegmentId]);
      }
    }
    if(mappedUserSegments.length){
      segments = mappedUserSegments;
    }
  }
});

async function getAllMarquees(promoId, origin) {
  // TODO: Update this to https://14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection before release
  const endPoint = 'https://14257-chimera-feature.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
  const payload = `originSelection=${origin}&collectionTags=caas%3Acontent-type%2Fpromotion&marqueeId=${promoId}&language=en&country=US`;

  // { signal: AbortSignal.timeout(TIMEOUT_TIME) } is way to cancel a request after T seconds using fetch
  // See https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
  return fetch(`${endPoint}?${payload}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT) }).then((res) => res.json());
}

/**
 * function getMarqueeId() : Eventually from Spectra API
 * @returns {string} id - currently marquee index (eventually will be marquee ID from Spectra)
 */
async function getMarqueeId() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('marqueeId')) return urlParams.get('marqueeId');
  let visitedLinks = [document.referrer];

  // { signal: AbortSignal.timeout(TIMEOUT_TIME) } is way to cancel a request after T seconds using fetch
  // See https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static

  // TODO: Update this to final Spectra AI model before release
  let response = await fetch('https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'ChimeraAcom'
    },
    body: `{"endpoint":"community-recom-v1","contentType":"application/json","payload":{"data":{"visitedLinks": ${visitedLinks}, "segments": ${segments}}}}`,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  let json = await response.json();
  return json?.data?.[0]?.content_id || '';
}

/**
 * function normalizeData()
 * @param {*} data - marquee JSON data
 * @returns {Object} metadata - marquee data
 */
function normalizeData(data) {
  const images = {
    tablet: data.arbitrary?.find((item) => item.key === 'imageTablet')?.value || '',
    desktop: data.arbitrary?.find((item) => item.key === 'imageDesktop')?.value || '',
  };

  const metadata = {
    id: data.id || '',
    title: data.contentArea?.title || '',
    description: data.contentArea?.description || '',
    details: data.contentArea?.detailText || '',
    image: data.styles?.backgroundImage || '',
    imagetablet: images.tablet || '',
    imagedesktop: images.desktop || '',
    cta1url: data.footer[0].right[0]?.href || '',
    cta1text: data.footer[0]?.right[0]?.text || '',
    cta1style: data.footer[0]?.right[0]?.style || '',
    cta2url: data.footer[0]?.center[0]?.href || '',
    cta2text: data.footer[0]?.center[0]?.text || '',
    cta2style: data.footer[0]?.center[0]?.style || '',
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
export function renderMarquee(marquee, data, id, fallback) {
  let chosen = data?.cards?.find(obj => obj.id === id);
  let shouldRenderMarquee = data?.cards?.length && chosen;
  const metadata = shouldRenderMarquee ? normalizeData(chosen) : fallback;

  // remove loader
  marquee.innerHTML = '';

  // configure block font sizes
  const classList = metadata.variant.split(',').map((c) => c.trim());
  // TODO: Update this to using a map to prevent nested ternaries
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

  /*
    Note: Modal must be written exactly in this format to be picked up by milo decorators.
    Other formats/structures will not work.
    <a
      href="#abc"
      data-modal-path="/fragment/path-to-fragment"
      data-modal-hash="#abc">
        Some Modal Text
    </a>
   */

  if(metadata.cta1url?.includes('fragment')){
    let fragment = metadata.cta1url.split("#")[0];
    let hash = metadata.cta1url.split("#")[1];
    cta = `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="${metadata.cta1text}" class="modal link-block ${cta1Style}">${metadata.cta1text}</a>`
  }

  let cta2 = metadata.cta2url
    ? `<a 
      class="${cta2Style}"
      href="${metadata.cta2url}">${metadata.cta2text}</a>`
    : '';

  if(metadata.cta2url?.includes('fragment')){
    let fragment = metadata.cta2url.split("#")[0];
    let hash = metadata.cta2url.split("#")[1];
    cta2 = `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="${metadata.cta2text}" class="modal link-block ${cta2Style}">${metadata.cta2text}</a>`
  }

  const fgContent = `<div class="text">
    <p class="detail-l">${metadata.details}</p>
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

  // Note: Added data-block so marquee can be picked up by milo analytics decorators
  marquee.setAttribute('data-block', '');
  marquee.append(background, foreground);
}

/**
 * function init()
 * @param {*} el - element with metadata for marquee
 */
export default async function init(el) {
  const metadata = getMetadata(el);
  const promoId = metadata.promoid;
  // TODO: Origin needs be pulled from consumer configs and NOT in CaaS Marquee block.
  const origin = metadata.origin || 'homepage';
  const marquee = createTag('div', { class: `marquee split ${metadata.variant.replaceAll(',', ' ')}` });
  marquee.innerHTML = '<div class="lds-ring LOADING"><div></div><div></div><div></div><div></div></div>';
  el.parentNode.prepend(marquee);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('previewFallback')) {
    // This query param ensures authors can verify the fallback looks good before publishing live.
    // Requirement:
    // As long as we add easy way for authors to preview their fallback content (via query param)
    // Then we don't have to hardcode any fallbacks in the code.
    await renderMarquee(marquee, [], '', metadata);
    return;
  }

  /*
    Note: We cannot do the following code to get the Marquees
    due to performance issues.

    const allMarqueesJson = await getAllMarquees();
    const selectedId = await getMarqueeId();
    await renderMarquee(marquee, allMarqueesJson, selectedId);

    This will cause the code to run synchronously and be blocking.

    See the MDN docs warning not to do this for more context/information:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#using_promise.all_with_async_functions

    We need to use Promise.all to get all the information we need in parallel.

    See LH scores by using Promise.all here:
    https://pagespeed.web.dev/analysis/https-caas-marquee-viewer-lh-test--milo--adobecom-hlx-page-drafts-sanrai-marquee-viewer-cc-lapsed/av1124mjs0?form_factor=mobile

  */
  try {
    const [selectedId, allMarqueesJson] = await Promise.all([
      getMarqueeId(),
      getAllMarquees(promoId, origin)
    ]);
    await renderMarquee(marquee, allMarqueesJson, selectedId, metadata);
  } catch(e){
    await renderMarquee(marquee, [], '', metadata);
  }
}
