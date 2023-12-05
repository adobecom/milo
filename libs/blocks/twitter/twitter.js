import { createIntersectionObserver, createTag, loadScript, isInTextNode } from '../../utils/utils.js';

export default function init(a) {
  if (isInTextNode(a)) return;
  const embedTwitter = () => {
    const url = a.href.replace('https://x.com', 'https://twitter.com');
    const anchor = createTag('a', { href: url });
    const blockquote = createTag('blockquote', { class: 'twitter-tweet' }, anchor);
    const wrapper = createTag('div', { class: 'embed-twitter' }, blockquote);
    a.parentElement.replaceChild(wrapper, a);
    loadScript('https://platform.twitter.com/widgets.js');
  };

  createIntersectionObserver({ el: a, callback: embedTwitter });
}
