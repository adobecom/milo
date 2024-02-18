import { getMetadata } from '../caas-marquee-metadata/caas-marquee-metadata.js';
import { createTag, getConfig } from '../../utils/utils.js';

const SEGMENTS_MAP = {
  stage: {
    '5a5fd14e-f4ca-49d2-9f87-835df5477e3c': 'PHSP',
    '09bc4ba3-ebed-4d05-812d-a1fb1a7e82ae': 'IDSN',
    '25ede755-7181-4be2-801e-19f157c005ae': 'ILST',
    '07609803-48a0-4762-be51-94051ccffb45': 'PPRO',
    '73c3406b-32a2-4465-abf3-2d415b9b1f4f': 'AEFT',
    'bf632803-4412-463d-83c5-757dda3224ee': 'CCSN',
  },
  prod: {
    '51b1f617-2e43-4e91-a98a-3b7716ecba8f': 'PHSP',
    '8d3c8ac2-2937-486b-b6ff-37f02271b09b': 'ILST',
    '8ba78b22-90fb-4b97-a1c4-f8c03a45cbc2': 'IDSN',
    'fd30e9c7-9ae9-44db-8e70-5c652a5bb1d2': 'CCSN',
    '4e2f2a6e-48c4-49eb-9dd5-c44070abb3f0': 'AEFT',
    'e7650448-268b-4a0d-9795-05f604d7e42f': 'LPES',
    '619130fc-c7b5-4b39-a687-b32061326869': 'PPRO',
    'cec4d899-4b41-469e-9f2d-4658689abf29': 'PHLT',
    '8da44606-9841-43d0-af72-86d5a9d3bba0': 'Any cc product with stock add-ons active users',
    'ab713720-91a2-4e8e-b6d7-6f613e049566': 'Any CC product without stock add-ons active users',
    '934fdc1d-7ba6-4644-908b-53e01e550086': 'DC Paid Active entitlements',
  }
}

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

const API_CONFIGS = {
  spectra: {
    prod: 'https://cchome.adobe.io/int/v1/models',
    stage: 'https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/models'
  },
  caas: {
    prod: 'https://14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection',
    stage: 'https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection'
  }
}

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

const REQUEST_TIMEOUT = isProd() ? 1500 : 10000;
const SEGMENT_API_TIMEOUT = 2500;

const TEXT = {
  small: 'm',
  medium: 'm',
  large: 'xl',
  xlarge: 'xl'
}

const HEADING = {
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
let marquees = [];
let selectedId = '';
let metadata;
let loaded = false;

let timeout = setTimeout(async function(){
  clearTimeout(timeout);
  await loadFallback(marquee, metadata);
}, SEGMENT_API_TIMEOUT);

// See https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/personalization/custom-personalization.html?lang=en
// for more information on how to integrate with this API.
async function segmentApiEventHandler(e){
    const SEGMENT_MAP = isProd() ? SEGMENTS_MAP.prod : SEGMENTS_MAP.stage;
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
        renderMarquee(marquee, marquees, selectedId, metadata);
      }
    }
}
window.addEventListener('alloy_sendEvent', (e) => segmentApiEventHandler(e));

function fetchExceptionHandler(fnName, error){
  log(`${fnName} fetch caught exception: ${error}`, LANA_OPTIONS);
  return null;
}

async function responseHandler(response, fnName){
  try {
    if(!response || response?.status !== 200){
      log(`${fnName}: Invalid response or status: response: ${response}, status: ${response?.status} `, LANA_OPTIONS);
      return [];
    }
    return await response?.json() || [];
  } catch(e){
    log(`${fnName}: response handler exception: ${e} `, LANA_OPTIONS);
    return [];
  }
}

async function getAllMarquees(promoId, origin) {
  const endPoint = isProd() ? API_CONFIGS.caas.prod : API_CONFIGS.caas.stage;
  const payload = `originSelection=${origin}&promoId=${promoId}&language=en&country=US`;

  let response = await fetch(`${endPoint}?${payload}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT)
  }).catch(error => fetchExceptionHandler('getAllMarquees', error));

  let json = await responseHandler(response, 'getAllMarquees');
  let marquees = await json?.cards;
  return Array.isArray(marquees) ? marquees  : [];
}

/**
 * function getMarqueeId() : Eventually from Spectra API
 * @returns {string} id - currently marquee index (eventually will be marquee ID from Spectra)
 */
async function getMarqueeId() {
  let visitedLinks = [document.referrer];
  log(`Segments: ${segments} sent to Spectra AI`, LANA_OPTIONS);
  const endPoint = isProd() ? API_CONFIGS.spectra.prod : API_CONFIGS.spectra.stage;

  // TODO: Update this to final Spectra AI model before release
  let response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'ChimeraAcom'
    },
    body: `{"endpoint":"community-recom-v1","contentType":"application/json","payload":{"data":{"visitedLinks": ${visitedLinks}, "segments": ${segments}}}}`,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  }).catch(error => fetchExceptionHandler('getMarqueeId', error));

  let json = await responseHandler(response, 'getMarqueeId');
  return json?.data?.[0]?.content_id || '';
}

function getArbitraryByKey(data, key) {
  return data.arbitrary?.find(item => item.key === key)?.value || '';
}

/**
 * function normalizeData()
 * @param {*} data - marquee JSON data
 * @returns {Object} metadata - marquee data
 */
function normalizeData(data) {
  const images = {
    tablet: getArbitraryByKey(data, 'imageTablet'),
    desktop: getArbitraryByKey(data, 'imageDesktop')
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
  metadata.backgroundcolor = arbitrary.backgroundColor || '';

  return metadata;
}

function getDefaultMetadata(){
  return {
    id: '',
    title: '',
    description: '',
    details: '',
    image: '',
    imagetablet: '',
    imagedesktop: '',
    cta1url: '',
    cta1text: '',
    cta1style: '',
    cta2url: '',
    cta2text: '',
    cta2style: '',
    variant: '',
    backgroundcolor: '',
    promoid: '',
    origin: ''
  };
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

function addLoadingSpinner(marquee){
  marquee.innerHTML = `<div class="lds-ring LOADING">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>`;
}

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
  return BUTTON_STYLES.includes(ctaStyle) ? `con-button ${ctaStyle} button-${TEXT[size]} button-justified-mobile` : '';
}

function getSize(classList){
  const sizes = ['small', 'medium', 'large'];
  for (const size of sizes) {
    if (classList.includes(size)) {
      return size;
    }
  }
  return 'xlarge';
}

function removeLoader(marquee){
  marquee.innerHTML = '';
}

function addBackground(marquee, metadata) {
  if(metadata.backgroundcolor){
    marquee.style.backgroundColor = metadata.backgroundcolor;
  }
}

function applyVariants(marquee, metadata, classList){
  if (metadata.variant) {
    marquee.classList.add(...classList);
  }
}

function getFgContent(metadata, size, cta, cta2){
  return `<div class="text">
    <p class="detail-l">${metadata.details}</p>
    <h1 class="heading-${HEADING[size]}">${metadata.title}</h1>
    <p class="body-${TEXT[size]}">${metadata.description}</p>
    <p class="action-area">
      ${cta} 
      ${cta2}
      </p>  
  </div>`
}

function getReverseFiller(){
  return `<div data-valign="middle" class="media image"></div>`;
}

function createBackground(splitContent){
  let parser = new DOMParser();
  let el = parser.parseFromString(splitContent, 'text/html');
  return el?.body?.childNodes[0];
}

/**
 * function renderMarquee()
 * @param {HTMLElement} marquee - marquee container
 * @param {Array} marquees - marquee data
 * @param {string} id - marquee id
 * @returns {void}
 */
export function renderMarquee(marquee, marquees, id, fallback) {
  if(loaded){
    return;
  }
  loaded = true;
  let found = marquees?.find(obj => obj.id === id);
  let shouldRenderMarquee = marquees?.length && found;
  const metadata = shouldRenderMarquee ? normalizeData(found) : fallback;

  removeLoader(marquee);
  addBackground(marquee, metadata);

  const classList = getClasses(metadata.variant);
  const isSplit = classList.includes('split');
  const isReversed = classList.includes('row-reversed');
  const size = getSize(classList);
  const useReverseFiller = isReversed && !isSplit;

  const mobileBgContent = getContent(metadata.image, 'mobile');
  const tabletBgContent = getContent(metadata.imagetablet, 'tablet');
  const desktopBgContent = getContent(metadata.imagedesktop, 'desktop');
  const splitContent = getContent(metadata.imagedesktop, 'split');

  const bgContent = `${mobileBgContent}${tabletBgContent}${desktopBgContent}`;
  let background = createTag('div', { class: 'background' }, '');
  if(isSplit) {
    background = createBackground(splitContent);
  } else {
    background.innerHTML = bgContent;
  }

  let cta1Classes = getCtaClasses(metadata.cta1style, size);
  let cta2Classes = getCtaClasses(metadata.cta2style, size);
  const reversedFiller = useReverseFiller ? getReverseFiller() : '';

  let cta = getCtaHtml(metadata.cta1url, metadata.cta1text, cta1Classes);
  let cta2 = getCtaHtml(metadata.cta2url, metadata.cta2text, cta2Classes);

  const fgContent = `${reversedFiller}${getFgContent(metadata, size, cta, cta2)}`;
  const foreground = createTag('div', { class: 'foreground container' }, '');
  foreground.innerHTML = fgContent;

  applyVariants(marquee, metadata, classList);
  addAnalytics(marquee);
  marquee.append(background, foreground);
}

function addAnalytics(marquee){
  marquee.setAttribute('data-block', '');
}

function getClasses(variant){
  return variant.split(/\s+|,/).map((c) => c.trim()).filter(i => i !== '');
}

function loadFallback(marquee, metadata){
  renderMarquee(marquee, [], '', metadata);
}

function shouldLoadFallback(){
  return urlParams.get('previewFallback') || urlParams.get('martech');
}

function authorPreview(){
  return urlParams.get('marqueeId');
}

function handleAuthoringMistakes(metadata){
  let safeMetadata = {...getDefaultMetadata(), ...metadata};
  return safeMetadata;
}

/**
 * function init()
 * @param {*} el - element with metadata for marquee
 */
export default async function init(el) {
  metadata = getMetadata(el);
  metadata = handleAuthoringMistakes(metadata);
  const promoId = metadata.promoid;
  const origin = getConfig().chimeraOrigin || metadata.origin;
  marquee = createTag('div', { class: `marquee` }, '');
  addLoadingSpinner(marquee);
  el.parentNode.prepend(marquee);

  if (shouldLoadFallback()) {
    loadFallback(marquee, metadata);
    return;
  }

  getAllMarquees(promoId, origin).then(resp => {
    marquees = resp;
    if (authorPreview()) {
      renderMarquee(marquee, marquees, urlParams.get('marqueeId'), metadata);
    }
  });
}
