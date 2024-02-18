// TODO: Fix tablet responsive class issue
// TODO: Check line about logging 'default' segments and see if it's still relevant
// TODO: Check LH scores after performance improvements.
// TODO: Figure out workaround if segments API takes too long to load
// TODO: Test network latency and if code handles that correctly
// TODO: Go through all code paths to make sure no exceptions occur
// TODO: Fix variants inconsistently supporting both ',' and '' (lines 95, 115, 198, 213)
// TODO: Update SEGMENT_MAP with final from Martech team
// TODO: Update Spectra AI endpoint to final one (instead of pointing to local Chimera IO instance)

import { getMetadata } from '../caas-marquee-metadata/caas-marquee-metadata.js';
import { createTag, getConfig } from '../../utils/utils.js';

// TODO: Final list needs to come from Target List before release
const SEGMENT_MAP = {
  '5a5fd14e-f4ca-49d2-9f87-835df5477e3c': 'PHSP',
  '09bc4ba3-ebed-4d05-812d-a1fb1a7e82ae': 'IDSN',
  '25ede755-7181-4be2-801e-19f157c005ae': 'ILST',
  '07609803-48a0-4762-be51-94051ccffb45': 'PPRO',
  '73c3406b-32a2-4465-abf3-2d415b9b1f4f': 'AEFT',
  'bf632803-4412-463d-83c5-757dda3224ee': 'CCSN',
};

const WIDTHS = {
  split: 1199,
  mobile: 1440,
  tablet: 2048,
  desktop: 2400
}

const HEIGHTS = {
  split: 828,
  mobile: 992,
  tablet: 520,
  desktop: 813
}

const LANA_OPTIONS = {
  tags: 'caasMarquee',
};

const BUTTON_STYLES = ['blue', 'outline'];
const prod = isProd();
const urlParams = new URLSearchParams(window.location.search);
const debug = urlParams.get('debug');

function isProd() {
  const { host } = window.location;
  return !(host.includes('hlx.page')
    || host.includes('localhost')
    || host.includes('hlx.live')
    || host.includes('stage.adobe')
    || host.includes('corp.adobe'));
}

function log(...args){
  if(!prod|| debug) {
    console.log(...args)
  } else {
    window.lana?.log(...args);
  }
}

// Our Chimera-SM BE has no caching on lower tiered environments (as of now) and requests will time out for authors
// showing them fallback content.
const REQUEST_TIMEOUT = isProd() ? 1500 : 10000;
const SEGMENT_API_TIMEOUT = 2500;

const TEXT_SIZE = {
  small: 'm',
  medium: 'm',
  large: 'xl',
  xlarge: 'xl'
}

const HEADING_SIZE = {
  small: 'xl',
  medium: 'xl',
  large: 'xxl',
  xlarge: 'xxl'
}

const IMAGE_EXTENSIONS = /^.*\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico|avif|jfif)$/;
const VIDEO_EXTENSIONS = /^.*\.(mp4|mpeg|mpg|mov|wmv|avi|webm|ogg)$/;
const VALID_MODAL_RE = /fragments(.*)#[a-zA-Z0-9_-]+$/;

let segments = [];
let marquee;
let cards = [];
let selectedId = '';
let metadata;
let loaded = false;
let timeout;

timeout = setTimeout(async function(){
  clearTimeout(timeout);
  await loadFallback(marquee, metadata);
}, SEGMENT_API_TIMEOUT);

async function handler(e){
    if (e.detail.type === 'pageView') {
      let mappedUserSegments = [];
      let userSegments = e.detail?.result?.destinations?.[0]?.segments || [];
      for(let userSegment of userSegments){
        if(SEGMENT_MAP[userSegment.id]){
          mappedUserSegments.push(SEGMENT_MAP[userSegment.id]);
        }
      }
      if(mappedUserSegments.length){
        segments = mappedUserSegments;
        selectedId = await getMarqueeId();
        renderMarquee(marquee, cards, selectedId, metadata);
      }
    }
}

// See https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/personalization/custom-personalization.html?lang=en
// for more information on how to integrate with this API.
window.addEventListener('alloy_sendEvent', (e) => handler(e));

async function getAllMarquees(promoId, origin) {
  // TODO: Update this to https://14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection before release
  const endPoint = 'https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
  const payload = `originSelection=${origin}&promoId=${promoId}&language=en&country=US`;

  // { signal: AbortSignal.timeout(TIMEOUT_TIME) } is way to cancel a request after T seconds using fetch
  // See https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
  let response = await fetch(`${endPoint}?${payload}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT)
  }).catch(error => {
    log(`getAllMarquees failed: ${error}`, LANA_OPTIONS);
    return null;
  });

  try {
    if(!response || response?.status !== 200){
      log(`getAllMarquees: Invalid response or status: response: ${response}, status: ${response?.status} `, LANA_OPTIONS);
      return [];
    }
    let json = await response?.json();
    let marquees = json?.cards;
    return Array.isArray(marquees) ? marquees  : [];
  } catch(e){
    log(`getAllMarquees exception: ${e} `, LANA_OPTIONS);
    return [];
  }
}

/**
 * function getMarqueeId() : Eventually from Spectra API
 * @returns {string} id - currently marquee index (eventually will be marquee ID from Spectra)
 */
async function getMarqueeId() {
  let visitedLinks = [document.referrer];
  log(`Segments: ${segments} sent to Spectra AI`, LANA_OPTIONS);

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
  }).catch(error => {
    log(`getMarqueeId promise caught: ${error}`, LANA_OPTIONS);
    return null;
  });
  try {
    if(!response || response?.status !== 200){
      log(`getMarqueeId: Invalid response or status: response: ${response}, status: ${response?.status} `, LANA_OPTIONS);
      return '';
    }
    let json = await response?.json();
    return json?.data?.[0]?.content_id || '';
  } catch(e){
    log(`getMarqueeId exception: ${e} `, LANA_OPTIONS);
    return '';
  }
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
  metadata.backgroundcolor = arbitrary.backgroundColor;

  return metadata;
}

function getVideoHtml(src){
  return `<video autoplay muted playsinline> <source src="${src}" type="video/mp4"></video>`
}

function getImageHtml(src, screen){
  let format = (screen === 'desktop' || screen === 'split') ? 'png' : 'jpeg';
  let style = (screen === 'desktop') ? 'style="object-position: 32% center;"' : '';
  let fetchPriority = (screen === 'mobile') ? 'fetchpriority="high"' : '';
  let loadingType = (screen === 'mobile' || screen === 'split') ? 'eager' : 'lazy';
  let width = WIDTHS[screen];
  let height = HEIGHTS[screen];
  return `<picture>
        <source type="image/webp" srcset="${src}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
        <source type="image/webp" srcset="${src}?width=750&amp;format=webply&amp;optimize=medium">
        <source type="image/${format}" srcset="${src}?width=2000&amp;format=${format}&amp;optimize=medium" media="(min-width: 600px)">
        <img loading="${loadingType}" alt src="${src}?width=750&amp;format=${format}&amp;optimize=medium" width="${width}" height="${height}" ${fetchPriority} ${style}>
  </picture>`
}

function getContent(src, screen){
  const isImage = IMAGE_EXTENSIONS.test(src);
  const isVideo = VIDEO_EXTENSIONS.test(src);
  let inner = ''
  if(isImage) {
    inner = getImageHtml(src, screen);
  }
  if(isVideo) {
    inner = getVideoHtml(src);
  }
  if(screen === 'split'){
    return `<div data-valign="middle" class="asset image bleed">${inner}</div>`
  }
  return `<div class=${screen}-only>${inner}</div>`
}

function getLoadingSpinnerHtml(){
  const spinner = `<div class="lds-ring LOADING">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>`;
  return spinner;
}

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
function getModalHtml(ctaUrl, classes, ctaText){
  let [fragment, hash] = ctaUrl.split("#");
  return `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="${ctaText}" class="modal link-block ${classes}">${ctaText}</a>`
}

function getCtaHtml(url, text, classes){
  if(isValidModal(url)){
    return getModalHtml(url, classes, text);
  }
  return url ? `<a class="${classes}" href="${url}"> ${text} </a>` : '';
}

const isValidModal = (u) => VALID_MODAL_RE.test(u);

function getCtaClasses(ctaStyle, size){
  return BUTTON_STYLES.includes(ctaStyle) ? `con-button ${ctaStyle} button-${TEXT_SIZE[size]} button-justified-mobile` : '';
}

/**
 * function renderMarquee()
 * @param {HTMLElement} marquee - marquee container
 * @param {Array} cards - marquee data
 * @param {string} id - marquee id
 * @returns {void}
 */
export function renderMarquee(marquee, cards, id, fallback) {
  if(loaded){
    return;
  }
  loaded = true;
  let chosen = cards?.find(obj => obj.id === id);
  let shouldRenderMarquee = cards?.length && chosen;
  const metadata = shouldRenderMarquee ? normalizeData(chosen) : fallback;

  // remove loader
  marquee.innerHTML = '';
  if(metadata.backgroundcolor){
    marquee.style.backgroundColor = metadata.backgroundcolor;
  }

  // configure block font sizes
  const classList = metadata.variant.split(',').map((c) => c.trim());
  const isSplit = metadata.variant.includes('split');
  const isReversed = metadata.variant.includes('row-reversed');
  // TODO: Update this to using a map to prevent nested ternaries
  /* eslint-disable no-nested-ternary */
  const size = classList.includes('small') ? 'small'
    : classList.includes('medium') ? 'medium'
      : classList.includes('large') ? 'large'
        : 'xlarge';
  /* eslint-enable no-nested-ternary */

  // background content
  const mobileBgContent = getContent(metadata.image, 'mobile');
  const tabletBgContent = getContent(metadata.imagetablet, 'tablet');
  const desktopBgContent = getContent(metadata.imagedesktop, 'desktop');
  const splitContent = getContent(metadata.imagedesktop, 'split');

  const bgContent = `${mobileBgContent}${tabletBgContent}${desktopBgContent}`;
  let background = createTag('div', { class: 'background' });
  if(isSplit) {
    let parser = new DOMParser();
    background = parser.parseFromString(splitContent, 'text/html').body.childNodes[0];
  } else {
    background.innerHTML = bgContent;
  }

  let cta1Classes = getCtaClasses(metadata.cta1style, size);
  let cta2Classes = getCtaClasses(metadata.cta2style, size);
  const reversedFiller = isReversed && !isSplit
    ? '<div data-valign="middle" class="media image"></div>'
    : '';

  // foreground content
  let cta = getCtaHtml(metadata.cta1url, metadata.cta1text, cta1Classes);
  let cta2 = getCtaHtml(metadata.cta2url, metadata.cta2text, cta2Classes);

  const fgContent = `${reversedFiller}<div class="text">
    <p class="detail-l">${metadata.details}</p>
    <h1 class="heading-${HEADING_SIZE[size]}">${metadata.title}</h1>
    <p class="body-${TEXT_SIZE[size]}">${metadata.description}</p>
    <p class="action-area">
      ${cta} 
      ${cta2}
      </p>  
  </div>`;

  const foreground = createTag('div', { class: 'foreground container' });
  foreground.innerHTML = fgContent;

  // apply marquee variant to viewer
  if (metadata.variant) {
    const classes = getClasses(metadata.variant);
    marquee.classList.add(...classes);
  }

  // Note: Added data-block so marquee can be picked up by milo analytics decorators
  addAnalytics(marquee);
  marquee.append(background, foreground);
}

function addAnalytics(marquee){
  marquee.setAttribute('data-block', '');
}

function getClasses(variant){
  return variant.split(' ').map((c) => c.trim()).filter(i => i !== '');
}

function loadFallback(marquee, metadata){
  renderMarquee(marquee, [], '', metadata);
}

/**
 * function init()
 * @param {*} el - element with metadata for marquee
 */
export default async function init(el) {
  metadata = getMetadata(el);
  const promoId = metadata.promoid;
  const origin = getConfig().chimeraOrigin || metadata.origin;

  // We shouldn't be adding variant properties from the viewer table as the requirements are each marquee has
  // all their viewing properties completely self-contained.
  // const marquee = createTag('div', { class: `marquee split ${metadata.variant.replaceAll(',', ' ')}` });
  marquee = createTag('div', { class: `marquee` });

  // Only in the case of a fallback should we use the variant fields from the viewer table.
  marquee.innerHTML = getLoadingSpinnerHtml();
  el.parentNode.prepend(marquee);

  if (urlParams.get('previewFallback') || urlParams.get('martech')) {
    // This query param ensures authors can verify the fallback looks good before publishing live.
    // Requirement:
    // As long as we add easy way for authors to preview their fallback content (via query param)
    // Then we don't have to hardcode any fallbacks in the code.
    loadFallback(marquee, metadata);
    return;
  }

  /*
    Note: We cannot do the following code to get the Marquees
    due to performance issues.

    const cards = await getAllMarquees();
    This causes the code to run synchronously and block (has been empirically verified).
  */
  getAllMarquees(promoId, origin).then(resp => {
    cards = resp;
    if (urlParams.get('marqueeId')) {
      renderMarquee(marquee, cards, urlParams.get('marqueeId'), metadata);
    }
  });
}
