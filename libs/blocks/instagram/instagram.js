import { createIntersectionObserver, createTag, loadScript, isInTextNode } from '../../utils/utils.js';

export default function init(a) {
  if (isInTextNode(a) || (!a.href.includes('/p/') && !a.href.includes('/reel/'))) return;

  const embedInstagram = async () => {
    const href = a.href.replace('/reel/', '/p/');
    const anchor = createTag('a', { href });
    const blockquote = createTag('blockquote', {
      class: 'instagram-media',
      'data-instgrm-captioned': '',
      'data-instgrm-permalink': href,
    }, anchor);
    const wrapper = createTag('div', { class: 'embed-instagram' }, blockquote);
    a.parentElement.replaceChild(wrapper, a);

    if (window.instgrm) {
      window.instgrm.Embeds.process(wrapper);
    } else {
      loadScript('https://www.instagram.com/embed.js');
    }
  };

  createIntersectionObserver({ el: a, callback: embedInstagram });
}
