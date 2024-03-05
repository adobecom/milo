/* eslint-disable no-shadow */
import { createTag, getConfig, loadMartech } from '../../utils/utils.js';

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
  },
};

const ALLOY_TIMEOUT = 500;

const WIDTHS = {
  split: 1199,
  mobile: 1440,
  tablet: 2048,
  desktop: 2400,
};

const HEIGHTS = {
  split: 828,
  mobile: 992,
  tablet: 520,
  desktop: 813,
};

const LANA_OPTIONS = { tags: 'caasMarquee' };

const API_CONFIGS = {
  spectra: {
    prod: 'https://cchome.adobe.io/int/v1/models',
    stage: 'https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/models',
  },
  caas: {
    prod: 'https://14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection',
    stage: 'https://14257-chimera-sanrai.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection',
  },
};

const MAX_NUM_CTAS = 2;
const CTA_STYLES = {
  STRONG: 'blue',
  EM: 'outline',
};
function getCtaStyle(tagName) {
  return CTA_STYLES[tagName] || '';
}

function getUrl(ctaLink) {
  if (!ctaLink) {
    return '';
  }
  const modalPath = ctaLink.getAttribute('data-modal-path');
  const modalHash = ctaLink.getAttribute('data-modal-hash');
  const target = ctaLink.target ? `#${ctaLink.target}` : '';
  if (modalPath && modalHash) {
    return `${modalPath}${modalHash}`;
  }
  return `${ctaLink.href}${target}`;
}
function parseCtas(el) {
  const ctas = {};
  const ctaLinks = el.querySelectorAll('a');

  for (let i = 1; i <= MAX_NUM_CTAS; i += 1) {
    const ctaLink = ctaLinks[i - 1] || '';
    ctas[`cta${i}url`] = getUrl(ctaLink);
    ctas[`cta${i}text`] = ctaLink.textContent?.trim() || '';
    ctas[`cta${i}style`] = getCtaStyle(ctaLink.parentNode?.tagName);
  }
  return ctas;
}
function getMetadata(el) {
  let metadata = {};
  for (const row of el.children) {
    const key = row.children[0].textContent.trim().toLowerCase() || '';
    let val = row.children[1].innerHTML || '';
    if (key.startsWith('image')) {
      const img = row.children[1].querySelector('img');
      const video = row.children[1].querySelector('.video');
      val = img ? new URL(img.src).pathname : '';
      val = video ? new URL(video.href).pathname : val;
    }
    if (key.includes('cta')) {
      metadata = { ...metadata, ...parseCtas(row.children[1]) };
    }
    if (key.includes('variant')) {
      val = val.replaceAll(',', '');
    }
    metadata[key] = val;
  }
  return metadata;
}

function isProd() {
  const { host } = window.location;
  return !(host.includes('hlx.page')
    || host.includes('localhost')
    || host.includes('stage.adobe')
    || host.includes('corp.adobe'));
}

const BUTTON_STYLES = ['blue', 'outline'];
const prod = isProd();
const urlParams = new URLSearchParams(window.location.search);
const debug = urlParams.get('debug');

function log(...args) {
  if (!prod || debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  } else {
    window.lana?.log(...args);
  }
}

const REQUEST_TIMEOUT = isProd() ? 1500 : 10000;

const TEXT = {
  small: 'm',
  medium: 'm',
  large: 'xl',
  xlarge: 'xl',
};

const HEADING = {
  small: 'xl',
  medium: 'xl',
  large: 'xxl',
  xlarge: 'xxl',
};

const IMAGE_EXTENSIONS = /^.*\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico|avif|jfif)$/;
const VIDEO_EXTENSIONS = /^.*\.(mp4|mpeg|mpg|mov|wmv|avi|webm|ogg)$/;
const VALID_MODAL_RE = /fragments(.*)#[a-zA-Z0-9_-]+$/;

let segments = [];
let marquee;
let marquees = [];
let selectedId = '';
let metadata;
let loaded = false;

const waitForEventOrTimeout = (eventName, timeout, timeoutVal) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    if (timeoutVal !== undefined) {
      resolve(timeoutVal);
    } else {
      reject(new Error(`Timeout waiting for ${eventName} after ${timeout}ms`));
    }
  }, timeout);

  window.addEventListener(eventName, (event) => {
    clearTimeout(timer);
    resolve(event);
  }, { once: true });
});

// See https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/personalization/custom-personalization.html?lang=en
// for more information on how to integrate with this API.
async function segmentApiEventHandler(e) {
  const SEGMENT_MAP = isProd() ? SEGMENTS_MAP.prod : SEGMENTS_MAP.stage;
  if (e.detail?.type === 'pageView') {
    const mappedUserSegments = [];
    const userSegments = e.detail?.result?.destinations?.[0]?.segments || [];
    for (const userSegment of userSegments) {
      if (SEGMENT_MAP[userSegment.id]) {
        mappedUserSegments.push(SEGMENT_MAP[userSegment.id]);
      }
    }
    if (mappedUserSegments.length) {
      segments = mappedUserSegments;
      // eslint-disable-next-line no-use-before-define
      selectedId = await getMarqueeId();
      // eslint-disable-next-line no-use-before-define
      renderMarquee(marquee, marquees, selectedId, metadata);
    }
  }
  // eslint-disable-next-line no-use-before-define
  loadFallback(marquee, metadata);
}

function fetchExceptionHandler(fnName, error) {
  log(`${fnName} fetch caught exception: ${error}`, LANA_OPTIONS);
  return null;
}

async function responseHandler(response, fnName) {
  try {
    if (!response || response?.status !== 200) {
      log(`${fnName}: Invalid response or status: response: ${response}, status: ${response?.status} `, LANA_OPTIONS);
      return [];
    }
    return await response?.json() || [];
  } catch (e) {
    log(`${fnName}: response handler exception: ${e} `, LANA_OPTIONS);
    return [];
  }
}

async function getAllMarquees(promoId, origin) {
  const endPoint = isProd() ? API_CONFIGS.caas.prod : API_CONFIGS.caas.stage;
  const payload = `originSelection=${origin}&promoId=${promoId}&language=en&country=US&perf=true`;

  /* eslint-disable object-curly-newline */
  const response = await fetch(`${endPoint}?${payload}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  }).catch((error) => fetchExceptionHandler('getAllMarquees', error));

  const json = await responseHandler(response, 'getAllMarquees');
  const marquees = await json?.cards;
  return Array.isArray(marquees) ? marquees : [];
}

/**
 * function getMarqueeId() : Eventually from Spectra API
 * @returns {string} id - currently marquee index (eventually will be marquee ID from Spectra)
 */
async function getMarqueeId() {
  const visitedLinks = [document.referrer];
  log(`Segments: ${segments} sent to Spectra AI`, LANA_OPTIONS);
  const endPoint = isProd() ? API_CONFIGS.spectra.prod : API_CONFIGS.spectra.stage;
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'ChimeraAcom',
    },
    body: `{"endpoint":"acom-banner-recom-v1","contentType":"application/json","payload":{"data":{"visitedLinks": ${JSON.stringify(visitedLinks)}, "segment": ${JSON.stringify(segments)}}}}`,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  }).catch((error) => fetchExceptionHandler('getMarqueeId', error));

  const json = await responseHandler(response, 'getMarqueeId');
  return json?.data?.[0]?.content_id || '';
}

function getArbitraryByKey(data, key) {
  return data.arbitrary?.find((item) => item.key === key)?.value || '';
}

/**
 * function normalizeData()
 * @param {*} data - marquee JSON data
 * @returns {Object} metadata - marquee data
 */
function normalizeData(data) {
  const images = {
    tablet: getArbitraryByKey(data, 'imageTablet'),
    desktop: getArbitraryByKey(data, 'imageDesktop'),
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

function getDefaultMetadata() {
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
    origin: '',
  };
}

function getVideoHtml(src) {
  return `<video autoplay muted playsinline> <source src="${src}" type="video/mp4"></video>`;
}

function getImageHtml(src, screen) {
  const format = (screen === 'desktop' || screen === 'split') ? 'png' : 'jpeg';
  const style = (screen === 'desktop') ? 'style="object-position: 32% center;"' : '';
  const fetchPriority = (screen === 'mobile') ? 'fetchpriority="high"' : '';
  const loadingType = (screen === 'mobile' || screen === 'split') ? 'eager' : 'lazy';
  const width = WIDTHS[screen];
  const height = HEIGHTS[screen];
  return `<picture>
        <source type="image/webp" srcset="${src}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
        <source type="image/webp" srcset="${src}?width=750&amp;format=webply&amp;optimize=medium">
        <source type="image/${format}" srcset="${src}?width=2000&amp;format=${format}&amp;optimize=medium" media="(min-width: 600px)">
        <img loading="${loadingType}" alt src="${src}?width=750&amp;format=${format}&amp;optimize=medium" width="${width}" height="${height}" ${fetchPriority} ${style}>
  </picture>`;
}

function getContent(src, screen) {
  const isImage = IMAGE_EXTENSIONS.test(src);
  const isVideo = VIDEO_EXTENSIONS.test(src);
  let inner = '';
  if (isImage) {
    inner = getImageHtml(src, screen);
  }
  if (isVideo) {
    inner = getVideoHtml(src);
  }
  if (screen === 'split') {
    return `<div data-valign="middle" class="asset image bleed">${inner}</div>`;
  }
  return `<div class=${screen}-only>${inner}</div>`;
}

function addLoadingSpinner(marquee) {
  marquee.innerHTML = `<div class="lds-ring LOADING">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>`;
}

function getModalHtml(ctaUrl, classes, ctaText) {
  const [fragment, hash] = ctaUrl.split('#');
  return `<a href="#${hash}" data-modal-path="${fragment}" data-modal-hash="#${hash}" daa-ll="${ctaText}" class="modal link-block ${classes}">${ctaText}</a>`;
}

const isValidModal = (u) => VALID_MODAL_RE.test(u);

function getCtaHtml(url, text, classes) {
  if (isValidModal(url)) {
    return getModalHtml(url, classes, text);
  }
  return url ? `<a class="${classes}" href="${url}"> ${text} </a>` : '';
}

function getCtaClasses(ctaStyle, size) {
  return BUTTON_STYLES.includes(ctaStyle) ? `con-button ${ctaStyle} button-${TEXT[size]} button-justified-mobile` : '';
}

function getSize(classList) {
  const sizes = ['small', 'medium', 'large'];
  for (const size of sizes) {
    if (classList.includes(size)) {
      return size;
    }
  }
  return 'xlarge';
}

function removeLoader(marquee) {
  marquee.innerHTML = '';
}

function addBackground(marquee, metadata) {
  if (metadata.backgroundcolor) {
    marquee.style.backgroundColor = metadata.backgroundcolor;
  }
}

function applyVariants(marquee, metadata, classList) {
  if (metadata.variant) {
    marquee.classList.add(...classList);
  }
}

function getFgContent(metadata, size, cta, cta2) {
  return `<div class="text">
    <p class="detail-l">${metadata.details}</p>
    <h1 class="heading-${HEADING[size]}">${metadata.title}</h1>
    <p class="body-${TEXT[size]}">${metadata.description}</p>
    <p class="action-area">
      ${cta} 
      ${cta2}
      </p> 
  </div>`;
}

function getReverseFiller() {
  return '<div data-valign="middle" class="media image"></div>';
}

function createBackground(splitContent) {
  const parser = new DOMParser();
  const el = parser.parseFromString(splitContent, 'text/html');
  return el?.body?.childNodes[0];
}

function addAnalytics(marquee) {
  marquee.setAttribute('data-block', '');
}

function getClasses(variant) {
  return variant.split(/\s+|,/).map((c) => c.trim()).filter((i) => i !== '');
}

/**
 * function renderMarquee()
 * @param {HTMLElement} marquee - marquee container
 * @param {Array} marquees - marquee data
 * @param {string} id - marquee id
 * @returns {void}
 */
export function renderMarquee(marquee, marquees, id, fallback) {
  if (loaded) {
    return;
  }
  loaded = true;
  const found = marquees?.find((obj) => obj.id === id);
  const shouldRenderMarquee = marquees?.length && found;
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
  if (isSplit) {
    background = createBackground(splitContent);
  } else {
    background.innerHTML = bgContent;
  }

  const cta1Classes = getCtaClasses(metadata.cta1style, size);
  const cta2Classes = getCtaClasses(metadata.cta2style, size);
  const reversedFiller = useReverseFiller ? getReverseFiller() : '';

  const cta = getCtaHtml(metadata.cta1url, metadata.cta1text, cta1Classes);
  const cta2 = getCtaHtml(metadata.cta2url, metadata.cta2text, cta2Classes);

  const fgContent = `${reversedFiller}${getFgContent(metadata, size, cta, cta2)}`;
  const foreground = createTag('div', { class: 'foreground container' }, '');
  foreground.innerHTML = fgContent;

  applyVariants(marquee, metadata, classList);
  addAnalytics(marquee);
  marquee.append(background, foreground);
}

function loadFallback(marquee, metadata) {
  renderMarquee(marquee, [], '', metadata);
}

function shouldLoadFallback() {
  return urlParams.get('previewFallback') || urlParams.get('martech');
}

function authorPreview() {
  return urlParams.get('marqueeId');
}

function handleAuthoringMistakes(authoredFields) {
  const safeMetadata = { ...getDefaultMetadata(), ...authoredFields };
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
  marquee = createTag('div', { class: 'marquee' }, '');
  addLoadingSpinner(marquee);
  el.parentNode.prepend(marquee);

  if (shouldLoadFallback()) {
    loadFallback(marquee, metadata);
    return;
  }

  const martechPromise = loadMartech();
  const marqueesPromise = getAllMarquees(promoId, origin);
  await Promise.all([martechPromise, marqueesPromise]);
  marquees = await marqueesPromise;
  const event = await waitForEventOrTimeout('alloy_sendEvent', ALLOY_TIMEOUT, new Event(''));
  await segmentApiEventHandler(event);

  if (authorPreview()) {
    renderMarquee(marquee, marquees, urlParams.get('marqueeId'), metadata);
  }
}
