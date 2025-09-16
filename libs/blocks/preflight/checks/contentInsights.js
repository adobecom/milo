console.log('---------------------');
import { runGeneralChecks } from 'https://studio-preflight-import--milo--adobecom.aem.live/libs/blocks/preflight/panels/general.js';
import { openAllModals, checkImageDimensions } from 'https://studio-preflight-import--milo--adobecom.aem.live/libs/blocks/preflight/checks/assets.js';
import { checkAlt } from 'https://studio-preflight-import--milo--adobecom.aem.live/libs/blocks/preflight/accessibility/audit-image-alt-text.js';
import { 
    checkLcpEl, 
    checkSingleBlock, 
    checkImageSize, 
    checkVideoPoster, 
    checkFragments, 
    checkForPersonalization, 
    checkPlaceholders, 
    checkIcons 
} from 'https://studio-preflight-import--milo--adobecom.aem.live/libs/blocks/preflight/checks/performance.js';
import { checkH1s, checkTitle, checkCanon, checkDescription, checkBody, checkLorem } from 'https://studio-preflight-import--milo--adobecom.aem.live/libs/blocks/preflight/checks/seo.js';

export default async function executeCheck() {
  window.contentInsights = {};
  console.log('---------2------------');
  const perfChecks = [
      checkLcpEl(window.location.href, document),
      checkSingleBlock(document),
      checkImageSize(window.location.href, document),
      checkVideoPoster(window.location.href, document),
      checkFragments(window.location.href, document),
      checkForPersonalization(document),
      checkPlaceholders(window.location.href, document),
      checkIcons(window.location.href, document),
  ];
  console.log('---------3------------');
  const perfKeys = ['a','b','c','d','e','f','g'];
  const perfResults = await Promise.all(perfChecks);
  window.contentInsights.performance = perfKeys.reduce((acc, key, idx) => {
      acc[key] = perfResults[idx];
      return acc;
  }, {});
  
  window.contentInsights.general = runGeneralChecks();
  const seoChecks = [
      checkH1s(document),
      checkTitle(document),
      checkCanon(document),
      checkDescription(document),
      checkBody(document),
      checkLorem(document),
  ];
  const keys = ['h1', 'title', 'canon', 'description', 'body', 'lorem'];
  const results = await Promise.all(seoChecks);
  window.contentInsights.seo = keys.reduce((acc, key, idx) => {
      acc[key] = results[idx];
      return acc;
  }, {});
  window.contentInsights.accessibility = await checkAlt();
  
  await openAllModals(document);
  const { assetsWithMismatch: imagesWithMismatch, assetsWithMatch: imagesWithMatch } = (await checkImageDimensions(window.location.href, document))?.details;
  window.contentInsights.assets = {
     imagesWithMismatch,
     imagesWithMatch,
  }
  
  window.dispatchEvent(new CustomEvent('content-insights-complete', { detail: window.contentInsights }));
}
