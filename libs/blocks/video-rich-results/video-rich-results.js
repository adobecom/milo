import { createTag } from '../../utils/utils.js';

/**
 * parseKeyValueBlockEl accepts div rendered from block table.
 * div is expected to have child divs representing rows.
 * Each row div has two column div children representing key/value pairs.
 */
export function parseKeyValueBlockEl(el) {
  // if (!el) return null;
  const rows = [...el.children];
  return rows.reduce((map, row) => {
    // if (row.children.length < 2) {
    //   // `Skipping invalid row at ${idx}`
    //   return map;
    // }
    const k = row.children[0].textContent.trim().toLowerCase();
    const v = row.children[1].textContent.trim();
    if (k) map.set(k, v);
    return map;
  }, new Map());
}

/**
 * createVideoObject transforms map or object of k/v pairs into VideoObject.
 */
export function createVideoObject(map) {
  const videoObject = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
  };
  const requiredFields = ['description', 'name', 'thumbnailUrl', 'uploadDate'];
  const recommendedFields = ['contentUrl', 'duration', 'embedUrl', 'expires'];
  requiredFields.forEach((k) => {
    const v = map.get(k.toLowerCase());
    // if (!v) {
    //   // `Value for ${k} required`;
    //   return;
    // }
    videoObject[k] = v;
  });
  recommendedFields.forEach((k) => {
    const v = map.get(k.toLowerCase());
    if (v) {
      videoObject[k] = v;
    }
  });
  return videoObject;
}

export default function init(el) {
  const kv = parseKeyValueBlockEl(el);
  const obj = createVideoObject(kv);
  // console.log(kv);
  // console.log(obj);
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
  document.head.append(script);
  el.remove();
}
