import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const LINES2ARRAY_SPLIT_RE = /\s*?\r?\n\s*/;
const BROADCAST_EVENT_RE = /broadcast-event-(\d+)-([\w-]+)/;
const CLIP_RE = /clip-(\d+)-([\w-]+)/;
const SEEK_TO_ACTION_RE = /seek-to-action-([\w-]+)/;

function camelize(s) {
  return s.replace(/-./, (x) => x[1].toUpperCase());
}

function addBroadcastEventField(videoObj, blockKey, blockValue) {
  const [, num, key] = blockKey.match(BROADCAST_EVENT_RE);
  const i = num - 1;
  if (!videoObj.publication) videoObj.publication = [];
  if (!videoObj.publication[i]) videoObj.publication[i] = { '@type': 'BroadcastEvent' };
  switch (key) {
    case 'is-live':
    case 'is-live-broadcast':
      videoObj.publication[i].isLiveBroadcast = ['yes', 'true'].includes(blockValue.toLowerCase());
      break;
    case 'start-date':
    case 'end-date':
      videoObj.publication[i][camelize(key)] = blockValue;
      break;
    default:
      window.lana.log(`VideoMetadata -- Unknown BroadcastEvent property: ${blockKey}`);
      break;
  }
}

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
      window.lana.log(`VideoMetadata -- Unhandled Clip property: ${blockKey}`);
      break;
  }
}

function addSeekToActionField(videoObj, blockKey, blockValue) {
  const [, key] = blockKey.match(SEEK_TO_ACTION_RE);
  if (!videoObj.potentialAction) videoObj.potentialAction = { '@type': 'SeekToAction' };
  switch (key) {
    case 'target':
      videoObj.potentialAction.target = blockValue;
      break;
    case 'start-offset-input':
      videoObj.potentialAction['startOffset-input'] = blockValue;
      break;
    default:
      window.lana.log(`VideoMetadata -- Unhandled SeekToAction property: ${blockKey}`);
      break;
  }
}

export function createVideoObject(blockMap) {
  const video = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
  };
  Object.entries(blockMap).forEach(([k, v]) => {
    const blockVal = v.content && v.content.textContent.trim();
    if (!blockVal) return;
    const blockKey = k && k.replaceAll(' ', '-');
    switch (true) {
      case blockKey === 'content-url':
      case blockKey === 'description':
      case blockKey === 'duration':
      case blockKey === 'embed-url':
      case blockKey === 'expires':
      case blockKey === 'name':
      case blockKey === 'regions-allowed':
      case blockKey === 'upload-date':
        video[camelize(blockKey)] = blockVal;
        break;
      case blockKey === 'thumbnail-url':
        video.thumbnailUrl = blockVal.split(LINES2ARRAY_SPLIT_RE);
        if (video.thumbnailUrl.length < 2) video.thumbnailUrl = blockVal;
        break;
      case BROADCAST_EVENT_RE.test(blockKey):
        addBroadcastEventField(video, blockKey, blockVal);
        break;
      case CLIP_RE.test(blockKey):
        addClipField(video, blockKey, blockVal);
        break;
      case SEEK_TO_ACTION_RE.test(blockKey):
        addSeekToActionField(video, blockKey, blockVal);
        break;
      default:
        window.lana.log(`VideoMetadata -- Unhandled VideoObject property: ${blockKey}`);
        break;
    }
  });
  return video;
}

export default function init(el) {
  const kv = getMetadata(el);
  const obj = createVideoObject(kv);
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
  document.head.append(script);
  el.remove();
}
