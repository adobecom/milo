import { getConfig, getFederatedContentRoot } from '../../../utils/utils.js';

export default async function checkVideoCaptions(elements = [], config = {}) {
  if (!config?.checks?.includes('video-captions')) return [];
  const violations = [];
  const mcpIframes = elements.filter((el) => el.tagName.toLowerCase() === 'iframe' && el.src.includes('video.tv.adobe.com'));
  const federalRoot = getFederatedContentRoot();
  const { locale } = getConfig();
  const geo = (locale?.prefix || '').replace('/langstore', '').replace('/', '');
  const localesMap = await fetch(`${federalRoot}/federal/preflight/preflight-config.json?sheet=captions-map`)
    .then((r) => r.json())
    .then((data) => data.data.map((l) => [l.captions, l.geos.split(',')]));
  const captionsLang = localesMap.find(([, geos]) => geos.includes(geo))?.[0];
  for (const iframe of mcpIframes) {
    const videoId = iframe.src.match(/\/v\/(\d+)/)?.[1];
    // eslint-disable-next-line
    if (!videoId) continue;
    const videoData = await fetch(`https://video.tv.adobe.com/vc/${videoId}/${captionsLang}.json`)
      .then((res) => res.json());
    // eslint-disable-next-line
    if (videoData?.captions?.length > 0) continue;
    violations.push({
      description: `Video ${videoId} with title "${iframe.title}" is missing captions`,
      impact: 'serious',
      id: 'video-captions',
      help: 'Ensure the video has captions',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
      nodes: [{ html: iframe.outerHTML }],
    });
  }
  return violations;
}
