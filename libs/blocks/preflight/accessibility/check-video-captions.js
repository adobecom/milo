import { getConfig, getFederatedContentRoot } from '../../../utils/utils.js';

export default async function checkVideoCaptions(elements = [], config = {}) {
  if (!config?.checks?.includes('video-captions')) return [];
  const violations = [];
  // Select Adobe MPC video embeds only
  const mpcIframes = elements.filter((el) => el.tagName.toLowerCase() === 'iframe' && el.src.includes('video.tv.adobe.com'));
  // Determine user geo from locale prefix
  const federalRoot = getFederatedContentRoot();
  const { locale } = getConfig();
  const geo = (locale?.prefix || '').replace('/langstore', '').replace('/', '');
  // Determine captions language using the federated config and user geo
  const localesMap = await fetch(`${federalRoot}/federal/preflight/preflight-config.json?sheet=captions-map`)
    .then((r) => r.json())
    .then((data) => data.data.map((l) => [l.captions, l.geos.split(',')]))
    .catch(() => []);
  const captionsLang = localesMap.find(([, geos]) => geos.includes(geo))?.[0];
  if (!captionsLang) return violations;
  const checks = await Promise.all(mpcIframes.map(async (iframe) => {
    const videoId = iframe.src.match(/\/v\/(\d+)/)?.[1];
    if (!videoId) return null;
    // Check captions in the geo's language first
    const videoData = await fetch(`https://video.tv.adobe.com/vc/${videoId}/${captionsLang}.json`)
      .then((res) => res.json())
      .catch(() => null);
    if (videoData?.captions?.length > 0) return null;
    // If not present and geo language isn't English, try English as fallback
    if (captionsLang !== 'eng') {
      const engCaptions = await fetch(`https://video.tv.adobe.com/vc/${videoId}/eng.json`)
        .then((res) => res.json())
        .catch(() => null);
      if (engCaptions?.captions?.length > 0) return null;
    }
    // Report violation if no captions found in either language
    return {
      description: `MPC video ${videoId} with title "${iframe.title}" is missing captions`,
      impact: 'serious',
      id: 'video-captions',
      help: 'Ensure the MPC video has captions',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
      nodes: [{ html: iframe.outerHTML }],
    };
  }));
  violations.push(...checks.filter(Boolean));
  return violations;
}
