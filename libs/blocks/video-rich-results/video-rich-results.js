import { createTag } from '../../utils/utils.js';

const LINES2ARRAY_SPLIT_RE = /\s*?\r?\n\s*/;
const BROADCAST_EVENT_RE = /broadcast-event-(\d+)-([\w-]+)/;
const CLIP_RE = /clip-(\d+)-([\w-]+)/;

function camelize(s) {
  return s.replace(/-./, (x) => x[1].toUpperCase());
}

/**
 * parseKeyValueBlockEl accepts div rendered from block table.
 * div is expected to have child divs representing rows.
 * Each row div has two column div children representing key/value pairs.
 */
function parseKeyValueBlockEl(el) {
  // if (!el) return null;
  const rows = [...el.children];
  return rows.reduce((map, row) => {
    // if (row.children.length < 2) {
    //   // `Skipping invalid row at ${idx}`
    //   return map;
    // }
    const k = row.children[0].textContent.trim();
    const v = row.children[1].textContent.trim();
    if (k) map[k] = v;
    return map;
  }, {});
}

/**
 * addBroadcastEventField adds BroadcastEvent-related key/value to existing VideoObject.
 */
function addBroadcastEventField(videoObj, blockKey, blockValue) {
  const [, num, key] = blockKey.match(BROADCAST_EVENT_RE);
  const i = num - 1;
  if (!videoObj.publication) videoObj.publication = [];
  if (!videoObj.publication[i]) videoObj.publication[i] = { '@type': 'BroadcastEvent' };
  switch (key) {
    case 'is-live':
    case 'is-live-broadcast':
      videoObj.publication[i].isLiveBroadcast = blockValue.toLowerCase() === 'true';
      break;
    case 'start-date':
    case 'end-date':
      videoObj.publication[i][camelize(key)] = blockValue;
      break;
    default:
      window.lana.log(`VideoRichResults -- Unknown BroadcastEvent property: ${blockKey}`);
      break;
  }
}

/**
 * addClipField adds Clip-related key/value to existing VideoObject.
 */
function addClipField(videoObj, blockKey, blockValue) {
  const [, num, key] = blockKey.match(CLIP_RE);
  const i = num - 1;
  if (!videoObj.hasPart) videoObj.hasPart = [];
  if (!videoObj.hasPart[i]) videoObj.hasPart[i] = { '@type': 'Clip' };
  switch (key) {
    case 'start-offset':
    case 'end-offset':
      videoObj.hasPart[i][camelize(key)] = parseInt(blockValue, 10);
      break;
    case 'name':
    case 'url':
      videoObj.hasPart[i][camelize(key)] = blockValue;
      break;
    default:
      window.lana.log(`VideoRichResults -- Unknown Clip property: ${blockKey}`);
      break;
  }
}

/**
 * createVideoObject transforms map or object of k/v pairs into VideoObject.
 */
export function createVideoObject(blockMap) {
  const video = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
  };
  Object.entries(blockMap).forEach(([k, v]) => {
    if (!v) return;
    const blockKey = k && k.replaceAll(' ', '-').toLowerCase();
    switch (blockKey) {
      case 'content-url':
      case 'description':
      case 'duration':
      case 'embed-url':
      case 'expires':
      case 'name':
      case 'regions-allowed':
      case 'upload-date':
        video[camelize(blockKey)] = v;
        return;
      case 'thumbnail-url':
        video.thumbnailUrl = v.split(LINES2ARRAY_SPLIT_RE);
        if (video.thumbnailUrl.length < 2) video.thumbnailUrl = v;
        return;
      case 'user-interaction-count':
        video.interactionStatistic = {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: parseInt(v, 10),
        };
        return;
      default:
        if (BROADCAST_EVENT_RE.test(blockKey)) {
          addBroadcastEventField(video, blockKey, v);
          return;
        }
        if (CLIP_RE.test(blockKey)) {
          addClipField(video, blockKey, v);
          return;
        }
        window.lana.log(`VideoRichResults -- Unknown VideoObject property: ${blockKey}`);
        break;
    }
  });
  return video;
}

export default function init(el) {
  const kv = parseKeyValueBlockEl(el);
  const obj = createVideoObject(kv);
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
  document.head.append(script);
  el.remove();
}
