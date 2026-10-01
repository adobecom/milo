import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';
import { applyTextOverrides } from '../_shared/text.js';
import { hasContent } from '../_shared/dom.js';

const getSrc = (image) => image.src || image.querySelector('[src]')?.src || image.href;

const getImage = (el) => el.querySelector('.modal-img-link') || el.querySelector('.image-link, .s2-image-link')
  || el.querySelector('picture') || el.querySelector('a[href$=".svg"]');
const getVideo = (el) => el.querySelector('.s2-video, .video-container, .pause-play-wrapper, video, .milo-video');

function stepLd(win, count, image, step) {
  return {
    '@type': 'HowToStep',
    url: `${win.location.origin}${win.location.pathname}`,
    name: `Step ${count}`,
    ...(image && { image: getSrc(image) }),
    itemListElement: [
      {
        '@type': 'HowToDirection',
        text: step.textContent?.trim(),
      },
    ],
  };
}

function writeJsonLd(el, make, heading, description, mainImage, stepsLd) {
  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name: heading,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'Adobe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg',
      },
    },
    step: stepsLd,
  };
  if (mainImage) {
    jsonLd['@image'] = {
      '@type': 'ImageObject',
      url: getSrc(mainImage),
    };
  }
  const doc = el.ownerDocument;
  const script = make('script', { type: 'application/ld+json' }, JSON.stringify(jsonLd));
  doc.getElementsByTagName('head')[0].appendChild(script);
  return script;
}

function howToInfo(el) {
  const infoDiv = el.querySelector(':scope > div > div');
  if (!infoDiv) return {};
  const heading = infoDiv.firstElementChild;
  if (!heading) return {};
  heading.classList.add('s2-heading-l');
  if (!heading.id) heading.id = heading.textContent.replace(/\s+/g, '-').toLowerCase();

  const image = getImage(infoDiv.lastElementChild);
  const video = getVideo(infoDiv.lastElementChild);
  const desc = infoDiv.childElementCount > 2 || (infoDiv.childElementCount === 2 && !image)
    ? infoDiv.children[1]
    : infoDiv.children[2] || '';

  const rest = [...infoDiv.children].filter((child) => child !== heading && child !== desc);
  const row = infoDiv.parentElement;
  infoDiv.remove();
  row.append(heading, desc, ...rest);
  row.className = 'how-to-heading';
  return { heading, desc, mainImage: image, mainVideo: video, rest };
}

function legacyList(el, make) {
  const rows = [...el.children];
  const list = make('ol');
  rows.slice(1).forEach((row) => list.append(make('li', null, [...row.childNodes])));
  rows.forEach((row, idx) => { if (idx > 1) row.remove(); });
  return list;
}

function howToSteps(el, make) {
  const stepsDiv = el.children[1]?.firstElementChild;
  const list = stepsDiv?.querySelector('ol, ul') || legacyList(el, make);
  const info = { steps: [], images: {} };
  [...list.children].forEach((step, idx) => {
    step.append(make('div', {}, [...step.childNodes]));
    info.steps.push(step);
    const img = getImage(step);
    if (!img) return;
    info.images[idx] = img;
    if (img.previousElementSibling?.nodeName === 'BR') img.previousElementSibling.remove();
    step.insertBefore(img, step.firstElementChild);
  });
  el.children[1]?.remove();
  return info;
}

function decorateHowTo(el, ctx) {
  const { make } = ctx;
  el.classList.add('how-to');
  pageShims(el, make);
  decorateVideoLinks(el, { make });

  const isSeo = el.classList.contains('seo');
  const isLargeMedia = el.classList.contains('large-image') || el.classList.contains('large-media');
  const mediaClass = isLargeMedia ? 'how-to-media-large' : 'how-to-media-mini';

  const { desc, heading, mainImage, mainVideo, rest = [] } = howToInfo(el);
  const { steps, images } = howToSteps(el, make);

  const orderedList = make('ol', { class: 'how-to-steps' });
  orderedList.append(...steps);

  if (mainImage) el.append(make('div', { class: `how-to-media ${mediaClass}` }, mainImage));
  if (mainVideo) el.append(make('div', { class: `how-to-media${isLargeMedia ? ' how-to-media-large' : ''}` }, mainVideo));
  rest.filter((node) => !hasContent(node)).forEach((node) => node.remove());

  if (isSeo) {
    const win = el.ownerDocument.defaultView;
    const stepsLd = steps.map((step, idx) => stepLd(win, idx + 1, images[idx], step));
    writeJsonLd(el, make, heading?.textContent, desc?.textContent, mainImage, stepsLd);
  }
  applyTextOverrides(el, ctx.overrides);

  const rows = [...el.children].filter((child) => child.tagName === 'DIV');
  const foreground = make('div', { class: 'how-to-foreground' });
  if (mainImage || mainVideo) foreground.classList.add(mediaClass);
  rows.forEach((row) => foreground.append(row));
  foreground.append(orderedList);
  el.append(foreground);
}

export const MEMBERS = {
  'how-to': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'c1',
    viewportPrePass: false,
    decorate: decorateHowTo,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'how-to' });
}
