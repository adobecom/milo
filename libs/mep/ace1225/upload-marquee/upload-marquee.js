/*
 * ace1225 ONLY — temporary MEP test code, NOT suitable for rollout.
 * Forked from da-cc `creativecloud/blocks/upload-marquee` and delivered via MEP
 * `useBlockCode`; hardcoded to this test's design (layout, fixed sizes, video handling).
 * Delete during the RTP process — see `libs/mep/readme.md`.
 */
import { createTag, getConfig } from '../../../utils/utils.js';

const VIEWPORTS = ['mobile-up', 'tablet-up', 'desktop-up'];
const AnalyticsKeys = {
  uploadAssetCTA: 'Upload asset CTA|UnityWidget',
  editPhotosCTA: 'Edit Photos CTA|UnityWidget',
};
let uploadColumnCounter = 0;
const LCP_IMAGE_PARAMS = {
  webpLarge: 'width=1000&format=webply&optimize=medium',
  webpSmall: 'width=500&format=webply&optimize=medium',
  jpgLarge: 'width=1000&format=jpg&optimize=medium',
  jpgSmall: 'width=500&format=jpg&optimize=medium',
};

// Inlined from da-cc creativecloud/scripts/utils.js (not exported by milo utils).
function getScreenSizeCategory(overridenBreakpoints) {
  const DEFAULT_BREAKPOINTS = { mobile: 599, tablet: 899 };
  const { mobile, tablet } = { ...DEFAULT_BREAKPOINTS, ...overridenBreakpoints };
  const MEDIA_QUERIES = {
    mobile: window.matchMedia(`(max-width: ${mobile}px)`),
    tablet: window.matchMedia(`(min-width: ${mobile + 1}px) and (max-width: ${tablet}px)`),
    desktop: window.matchMedia(`(min-width: ${tablet + 1}px)`),
  };
  if (MEDIA_QUERIES.mobile.matches) return 'mobile';
  if (MEDIA_QUERIES.tablet.matches) return 'tablet';
  return 'desktop';
}

function getBaseImageUrlFromPicture(picture) {
  if (!picture) return null;
  const img = picture.querySelector('img');
  const imgSrc = img?.src;
  if (imgSrc) {
    return { baseUrl: imgSrc.split('?')[0], img };
  }
  const srcset = picture.querySelector('source[srcset]')?.srcset;
  if (!srcset) return null;
  const url = srcset.split(',')[0].trim().split(/\s+/)[0];
  const baseUrl = url ? url.split('?')[0] : null;
  return baseUrl && img ? { baseUrl, img } : null;
}

function rewritePictureToOurSizes(picture) {
  const result = getBaseImageUrlFromPicture(picture);
  if (!result?.baseUrl || !result.img) return null;
  const { baseUrl, img } = result;
  picture.textContent = '';
  picture.append(
    createTag('source', {
      type: 'image/webp',
      srcset: `${baseUrl}?${LCP_IMAGE_PARAMS.webpLarge}`,
      media: '(min-width: 600px)',
    }),
    createTag('source', {
      type: 'image/webp',
      srcset: `${baseUrl}?${LCP_IMAGE_PARAMS.webpSmall}`,
    }),
    createTag('source', {
      type: 'image/jpeg',
      srcset: `${baseUrl}?${LCP_IMAGE_PARAMS.jpgLarge}`,
      media: '(min-width: 600px)',
    }),
  );
  img.setAttribute('src', `${baseUrl}?${LCP_IMAGE_PARAMS.jpgSmall}`);
  img.removeAttribute('loading');
  img.removeAttribute('fetchpriority');
  picture.append(img);
  return img;
}

function rewriteVideoPosterToOurSizes(video, columnIndex) {
  const poster = video.getAttribute('poster');
  if (!poster || poster.startsWith('data:') || poster.startsWith('blob:')) return;
  const baseUrl = poster.trim().split('?')[0];
  if (!baseUrl) return;
  const params = columnIndex === 0
    ? LCP_IMAGE_PARAMS.webpSmall
    : LCP_IMAGE_PARAMS.webpLarge;
  video.setAttribute('poster', `${baseUrl}?${params}`);
}

function setUploadRowMediaPriority(uploadRow) {
  const screenCategory = getScreenSizeCategory({ mobile: 599, tablet: 1199 });
  const activeColumnIndex = { mobile: 0, tablet: 1, desktop: 2 }[screenCategory];
  [...uploadRow.children].forEach((column, index) => {
    const isActive = index === activeColumnIndex;
    const firstPara = column.querySelector('p');
    const mediaPicture = firstPara?.querySelector('picture');
    if (mediaPicture) {
      const img = rewritePictureToOurSizes(mediaPicture);
      if (img) {
        img.setAttribute('loading', isActive ? 'eager' : 'lazy');
        if (isActive) img.setAttribute('fetchpriority', 'high');
      }
    }
    const video = column.querySelector('video');
    if (video) {
      rewriteVideoPosterToOurSizes(video, index);
      video.setAttribute('preload', isActive ? 'auto' : 'none');
    }
  });
}

function logUploadMarqueeInfo(message, errorType = 'i') {
  window.lana?.log(message, { tags: 'upload-marquee', errorType, severity: 'error' });
}

function nextUploadColumnId() {
  uploadColumnCounter += 1;
  return uploadColumnCounter;
}

function buildScopedId(prefix, columnId) {
  return `${prefix}-${columnId}`;
}

function extractUploadContentParts(content) {
  const media = content.querySelector('picture, .video-container.video-holder');
  const terms = content.querySelector('p:last-child');
  const mediaPara = media?.closest('p');
  const hasUploadMarker = (para) => para.querySelector(
    'span[class*=icon-share], span[class*=icon-upload], img[src$=".svg"]:not(.video-container img)',
  );
  const candidateParagraphs = [
    ...content.querySelectorAll('p:not(:last-child)'),
  ].filter(
    (para) => para.textContent.trim() !== '' || para.querySelector('img, svg'),
  );
  const uploadPara = candidateParagraphs.find((para) => hasUploadMarker(para));
  const contentParagraphs = candidateParagraphs.filter((para) => {
    const isMediaOnlyPara = para === mediaPara
      && !hasUploadMarker(para)
      && para.textContent.trim() === '';
    return !isMediaOnlyPara;
  });
  const textParas = contentParagraphs.filter((para) => para !== uploadPara);
  const headingPara = textParas[0];
  const bodyPara = textParas[1];
  return {
    media, terms, contentParagraphs, uploadPara, headingPara, bodyPara,
  };
}

function applyViewportClasses(foreground) {
  foreground.firstElementChild?.classList.add('upload-grid');
  if (
    foreground.childElementCount === 2
    || foreground.childElementCount === 3
  ) {
    [...foreground.children].forEach((child, index) => {
      child.classList.add('upload-grid', VIEWPORTS[index]);
      if (foreground.childElementCount === 2 && index === 1) {
        child.className = 'upload-grid tablet-up desktop-up';
      }
    });
  } else if (foreground.childElementCount === 1) {
    foreground.firstElementChild?.classList.add(...VIEWPORTS);
  }
  return foreground;
}

function getViewportClasses(el) {
  return [...el.classList].filter((cls) => VIEWPORTS.includes(cls));
}

function assignDropZoneTextIds(headingPara, bodyPara, columnId) {
  const describedByIds = [];
  if (headingPara) {
    headingPara.classList.add('drop-zone-heading');
    headingPara.id = buildScopedId('drop-zone-heading', columnId);
    describedByIds.push(headingPara.id);
  }
  if (bodyPara) {
    bodyPara.classList.add('drop-zone-body');
    bodyPara.id = buildScopedId('drop-zone-body', columnId);
    describedByIds.push(bodyPara.id);
  }
  return describedByIds;
}

function makeDecorativeMediaNonFocusable(container) {
  container.querySelectorAll('picture, picture img').forEach((el) => {
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'presentation');
  });
}

async function buildUploadActionControls(para) {
  const button = createTag(
    'a',
    {
      tabindex: '0',
      class: 'con-button blue action-button button-xl no-track',
      'daa-ll': AnalyticsKeys.uploadAssetCTA,
    },
    para.innerHTML,
  );
  makeDecorativeMediaNonFocusable(button);
  const input = createTag('input', {
    type: 'file',
    name: 'file-upload',
    id: 'file-upload',
    class: 'file-upload hide',
    accept: 'image/*',
    'aria-hidden': 'true',
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      input.click();
    }
  });
  para.classList.add('upload-action-container');
  para.textContent = '';
  para.append(button, input);
  return { fileInput: input };
}

function wireDropZoneAccessibility(dropZone, fileInput) {
  dropZone.setAttribute('tabindex', '-1');
  dropZone.addEventListener('click', (event) => {
    event.stopPropagation();
    fileInput?.click();
  });
}

async function buildDropZone(uploadParts, columnId) {
  const dropZone = createTag('div', { class: 'drop-zone' });
  const { fileInput } = await buildUploadActionControls(uploadParts.uploadPara);
  assignDropZoneTextIds(
    uploadParts.headingPara,
    uploadParts.bodyPara,
    columnId,
  );
  wireDropZoneAccessibility(dropZone, fileInput);
  // ace1225: skip the decorative default dropzone icon (not in the design) so we
  // don't eagerly fetch an unused SVG per viewport cell.
  dropZone.append(...uploadParts.contentParagraphs);
  return dropZone;
}

function replaceUploadColumnContent(content, mediaContainer, dropZoneContainer, terms) {
  content.textContent = '';
  content.append(mediaContainer, dropZoneContainer);
  if (terms) {
    dropZoneContainer.append(terms);
  }
}

function buildMarqueeContent(marqueeCell) {
  const marqueeContent = createTag('div', { class: 'upload-marquee-content' });
  [...marqueeCell.children].forEach((child) => marqueeContent.append(child.cloneNode(true)));

  const brandingPara = marqueeContent.querySelector(':scope > p:first-child');
  const [firstPicture, secondPicture] = brandingPara
    ? [...brandingPara.querySelectorAll('picture')]
    : [];
  if (firstPicture && secondPicture) {
    const brandingRow = createTag('span', { class: 'upload-marquee-branding-row' });
    const firstWrap = createTag('span', { class: 'upload-marquee-branding-first' });
    const secondWrap = createTag('span', { class: 'upload-marquee-branding-second' });
    firstWrap.append(firstPicture.cloneNode(true));
    secondWrap.append(secondPicture.cloneNode(true));
    brandingRow.append(firstWrap, secondWrap);
    brandingPara.textContent = '';
    brandingPara.classList.add('upload-marquee-branding');
    brandingPara.append(brandingRow);
    brandingRow.querySelectorAll('picture img, img').forEach((img) => {
      img.setAttribute('loading', 'eager');
    });
  }
  const ctaLink = marqueeContent.querySelector('p strong a[href]');
  if (ctaLink) {
    ctaLink.classList.add('con-button', 'upload-marquee-cta', 'no-track');
    ctaLink.setAttribute('aria-label', ctaLink.textContent.trim());
    ctaLink.setAttribute('daa-ll', AnalyticsKeys.editPhotosCTA);
  }
  const ctaParentPara = ctaLink?.closest('p');
  const heading = marqueeContent.querySelector(':scope > h1');
  const descriptionPara = heading?.nextElementSibling?.tagName === 'P'
    ? heading.nextElementSibling : null;
  const allParas = [...marqueeContent.querySelectorAll(':scope > p')];
  const lastPara = allParas[allParas.length - 1];
  if (
    lastPara
    && lastPara !== ctaParentPara
    && lastPara !== brandingPara
    && lastPara !== descriptionPara
    && lastPara.textContent.trim()
  ) {
    lastPara.classList.add('upload-marquee-dropzone-label');
  }
  return marqueeContent;
}

function buildLayout() {
  const layout = createTag('div', { class: 'upload-marquee-layout' });
  const leftCol = createTag('div', { class: 'upload-marquee-left' });
  const rightCol = createTag('div', { class: 'upload-marquee-right' });
  const uploadsWrapper = createTag('div', { class: 'upload-marquee-uploads' });
  const mediaWrapper = createTag('div', { class: 'upload-marquee-media' });
  return { layout, leftCol, rightCol, uploadsWrapper, mediaWrapper };
}

function appendColumns(viewportContent, uploadsWrapper, mediaWrapper) {
  viewportContent.forEach(({ media, dropZone, viewportClasses }) => {
    if (dropZone && uploadsWrapper) {
      dropZone.classList.add(...viewportClasses);
      uploadsWrapper.append(dropZone);
    }
    if (media) {
      media.classList.add(...viewportClasses);
      mediaWrapper.append(media);
    }
  });
}

function collectViewportContent(row, extractMedia) {
  return [...row.children].map((content) => ({
    media: extractMedia(content),
    dropZone: content.querySelector(':scope > .drop-zone-container'),
    viewportClasses: getViewportClasses(content),
  }));
}

function extractMediaFromColumn(content) {
  const media = content.querySelector('picture, .video-container.video-holder');
  if (!media) return null;
  const mediaContainer = createTag('div', { class: 'media-container' });
  mediaContainer.append(media);
  return mediaContainer;
}

async function decorateUploadColumn(content) {
  const columnId = nextUploadColumnId();
  const mediaContainer = createTag('div', { class: 'media-container' });
  const dropZoneContainer = createTag('div', { class: 'drop-zone-container' });
  const uploadParts = extractUploadContentParts(content);
  if (uploadParts.media) {
    mediaContainer.append(uploadParts.media);
    if (
      uploadParts.media.parentElement?.tagName === 'P'
      && uploadParts.media.parentElement.textContent.trim() === ''
    ) {
      uploadParts.media.parentElement.remove();
    }
  }
  if (!uploadParts.uploadPara) {
    logUploadMarqueeInfo(
      'Failed to create upload button for upload-marquee block.',
    );
    return;
  }
  const dropZone = await buildDropZone(uploadParts, columnId);
  dropZoneContainer.append(dropZone);
  replaceUploadColumnContent(
    content,
    mediaContainer,
    dropZoneContainer,
    uploadParts.terms,
  );
}

function setupLayoutDragAndDrop(layout, uploadsWrapper) {
  let activeDropZone;
  const setActiveDropZone = () => {
    const dropZones = [
      ...uploadsWrapper.querySelectorAll(
        ':scope > .drop-zone-container > .drop-zone',
      ),
    ];
    const nextDropZone = dropZones.find((zone) => zone.offsetParent !== null) || dropZones[0];
    if (activeDropZone && activeDropZone !== nextDropZone) {
      activeDropZone.classList.remove('active');
    }
    activeDropZone = nextDropZone;
    activeDropZone?.classList.add('active');
  };
  const clearActiveDropZone = () => {
    activeDropZone?.classList.remove('active');
    activeDropZone = null;
  };
  layout.addEventListener('dragenter', (event) => {
    event.preventDefault();
    setActiveDropZone();
  });
  layout.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setActiveDropZone();
  });
  layout.addEventListener('dragleave', (event) => {
    event.preventDefault();
    clearActiveDropZone();
  });
  document.addEventListener('dragend', () => clearActiveDropZone());
  layout.addEventListener('drop', (event) => {
    event.preventDefault();
    setActiveDropZone();
    const fileInput = activeDropZone?.querySelector('.file-upload');
    const files = event.dataTransfer?.files;
    if (files?.length && fileInput) {
      try {
        fileInput.files = files;
      } catch {
        // TODO: Trigger lana log
        // Some browsers may not allow assigning FileList directly.
      }
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    clearActiveDropZone();
  });
  uploadsWrapper.querySelectorAll('.drop-zone').forEach((zone) => {
    zone.addEventListener('drop', () => {
      clearActiveDropZone();
    });
  });
  window.addEventListener('drop', () => clearActiveDropZone());
  window.addEventListener('dragend', () => clearActiveDropZone());
}

// Poster→video authoring: author the mp4 URL in the image's alt text as `url#_autoplay | caption`.
// Milo's decorateImageLinks() converts that into `<a href=mp4 data-video-poster=<picture>>` before
// this block's init() runs, so we just hand the resulting anchor to decorateAnchorVideo.
function decorateUploadVideos(uploadRow, decorateAnchorVideo) {
  [...uploadRow.children].forEach((cell) => {
    const videoLink = cell.querySelector('a[href*=".mp4"]');
    if (!videoLink) return;
    if (!videoLink.hash) videoLink.hash = '#autoplay';
    const src = videoLink.href.split('#')[0];
    // Move the link out of its <p> before decorating: decorateAnchorVideo swaps it for a
    // block-level <video> wrapper, which browsers fracture/misplace if left inside a <p>.
    cell.insertBefore(videoLink, cell.firstElementChild);
    decorateAnchorVideo({ src, anchorTag: videoLink });
  });
}

function decorateContentRow(row) {
  row.classList.add('foreground');
  applyViewportClasses(row);
  setUploadRowMediaPriority(row);
}

function mountLayout(el, { layout, leftCol, rightCol }, mediaWrapper) {
  rightCol.append(mediaWrapper);
  layout.append(leftCol, rightCol);
  const foreground = createTag('div', { class: 'foreground' });
  foreground.append(layout);
  el.textContent = '';
  el.append(foreground);
}

async function initDropzoneVariant(el, uploadRow, layoutParts, marqueeContent) {
  const { layout, leftCol, rightCol, uploadsWrapper, mediaWrapper } = layoutParts;
  for (let i = 0; i < uploadRow.children.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await decorateUploadColumn(uploadRow.children[i]);
  }
  appendColumns(
    collectViewportContent(uploadRow, (c) => c.querySelector(':scope > .media-container')),
    uploadsWrapper,
    mediaWrapper,
  );
  if (!uploadsWrapper.children.length || !mediaWrapper.children.length) return;
  leftCol.append(uploadsWrapper);
  rightCol.append(mediaWrapper);
  // ace1225 design: hero copy centered on top; card grid = media (left) + dropzone (right)
  layout.append(rightCol, leftCol);
  setupLayoutDragAndDrop(layout, uploadsWrapper);
  const foreground = createTag('div', { class: 'foreground' });
  // ace1225: hero copy now lives in a separate block above; only render it here if authored.
  const hasHeroCopy = marqueeContent
    && (marqueeContent.textContent.trim() !== '' || marqueeContent.querySelector('picture, img, svg, a'));
  if (hasHeroCopy) foreground.append(marqueeContent);
  foreground.append(layout);
  el.textContent = '';
  el.append(foreground);
}

async function initPromptVariant(el, mediaRow, layoutParts) {
  const { leftCol, mediaWrapper } = layoutParts;
  // 'copy' class is required by Unity to locate and inject the prompt bar
  leftCol.classList.add('copy');
  const promptContainer = createTag('div', { class: 'upload-marquee-prompt-container' });
  leftCol.append(promptContainer);
  appendColumns(
    collectViewportContent(mediaRow, extractMediaFromColumn),
    null,
    mediaWrapper,
  );
  if (!mediaWrapper.children.length) return;
  mountLayout(el, layoutParts, mediaWrapper);
}

export default async function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const { decorateBlockBg, decorateAnchorVideo } = await import(`${base}/utils/decorate.js`);
  el.classList.add('upload-marquee-block', 'con-block');
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  // Rows: last = upload content; first = background (optional); middle = marquee/hero (optional,
  // now usually authored in a separate block above, so upload-marquee is often just [bg, content]).
  const contentRow = rows[rows.length - 1];
  const backgroundRow = rows.length >= 2 ? rows[0] : null;
  const marqueeRow = rows.length >= 3 ? rows[1] : null;
  const isPromptVariant = el.classList.contains('unity-prompt');
  if (backgroundRow && backgroundRow.textContent.trim() !== '') {
    backgroundRow.classList.add('background');
    decorateBlockBg(el, backgroundRow, { useHandleFocalpoint: true });
  }
  // Build the video first: decorateContentRow's setUploadRowMediaPriority needs the <video>.
  decorateUploadVideos(contentRow, decorateAnchorVideo);
  decorateContentRow(contentRow);
  const layoutParts = buildLayout();
  const marqueeCell = marqueeRow?.querySelector(':scope > div');
  const marqueeContent = marqueeCell ? buildMarqueeContent(marqueeCell) : null;
  if (isPromptVariant) {
    if (marqueeContent) layoutParts.leftCol.append(marqueeContent);
    await initPromptVariant(el, contentRow, layoutParts);
  } else {
    await initDropzoneVariant(el, contentRow, layoutParts, marqueeContent);
  }
}
