import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const LINES2ARRAY_SPLIT_RE = /\s*?\r?\n\s*/;
const BROADCAST_EVENT_RE = /broadcast-event-(\d+)-([\w-]+)/;
const CLIP_RE = /clip-(\d+)-([\w-]+)/;
const SEEK_TO_ACTION_RE = /seek-to-action-([\w-]+)/;

function camelize(str) {
  return str.replace(/-./, (match) => match[1].toUpperCase());
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
      window.lana.log(`VideoMetadata -- Unknown BroadcastEvent property: ${blockKey}`, { tags: 'errorType=warn,module=video-metadata' });
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
      window.lana.log(`VideoMetadata -- Unhandled Clip property: ${blockKey}`, { tags: 'errorType=warn,module=video-metadata' });
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
      window.lana.log(`VideoMetadata -- Unhandled SeekToAction property: ${blockKey}`, { tags: 'errorType=warn,module=video-metadata' });
      break;
  }
}

export function createVideoObject(record) {
  const video = {};
  Object.entries(record).forEach(([key, blockVal]) => {
    if (!blockVal) return;
    const blockKey = key && key.replaceAll(' ', '-');
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
        window.lana.log(`VideoMetadata -- Unhandled VideoObject property: ${blockKey}`, { tags: 'errorType=warn,module=video-metadata' });
        break;
    }
  });
  if (Object.keys(video).length) {
    return Object.assign(video, {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
    });
  }
  return null;
}

export function blockMapToRecord(blockMap) {
  return blockMap && Object.entries(blockMap).reduce((rec, kv) => {
    const [key, value] = kv;
    const val = value?.content?.textContent?.trim();
    if (!val) return rec;
    rec[key] = val;
    return rec;
  }, {});
}

export default function init(el) {
  const metadata = getMetadata(el);
  el.remove();
  const record = blockMapToRecord(metadata);
  const obj = createVideoObject(record);
  if (!obj) return;
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
  document.head.append(script);
}
