import { createIntersectionObserver, createTag } from '../../utils/utils.js';

export default function init(a) {
  const embedTwitter = () => {
    if (!a.origin?.includes('twitter')) return;

    const anchor = createTag('a', { href: a.href });
    const blockquote = createTag('blockquote', { class: 'twitter-tweet' }, anchor);
    const wrapper = createTag('div', { class: 'embed-twitter' }, blockquote);
    const head = document.querySelector('head');
    const script = createTag('script', { src: 'https://platform.twitter.com/widgets.js' });
    head.append(script);

    a.insertAdjacentElement('afterend', wrapper);
    a.remove();
  };

  createIntersectionObserver({ el: a, callback: embedTwitter });
}
