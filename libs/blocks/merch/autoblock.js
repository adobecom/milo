import { decorateLinks, loadBlock, localizeLink } from '../../utils/utils.js';

export function localizePreviewLinks(el) {
  const anchors = el.getElementsByTagName('a');
  for (const a of anchors) {
    const { href } = a;
    if (href?.match(/http[s]?:\/\/\S*\.(hlx|aem).(page|live)\//)) {
      try {
        const url = new URL(href);
        a.href = localizeLink(href, url.hostname);
      } catch (e) {
        window.lana?.log(`Invalid URL - ${href}: ${e.toString()}`);
      }
    }
  }
}

export function postProcessAutoblock(autoblockEl) {
  decorateLinks(autoblockEl);
  localizePreviewLinks(autoblockEl);
  autoblockEl.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
}
