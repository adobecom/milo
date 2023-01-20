import { createIntersectionObserver, createTag, loadScript } from '../../utils/utils.js';

export default function init(a) {
  const embedTwitter = () => {
    const anchor = createTag('a', { href: a.href });
    const blockquote = createTag('blockquote', { class: 'twitter-tweet' }, anchor);
    const wrapper = createTag('div', { class: 'embed-twitter' }, blockquote);
    a.parentElement.replaceChild(wrapper, a);
    loadScript('https://platform.twitter.com/widgets.js');
  };

  createIntersectionObserver({ el: a, callback: embedTwitter });
}
