import { createIntersectionObserver, createTag } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

const loadAdobeTv = (a) => {
  const bgBlocks = ['aside', 'marquee', 'hero-marquee'];
  if (a.href.includes('.mp4') && bgBlocks.some((b) => a.closest(`.${b}`))) {
    a.classList.add('hide');
    const parentElement = a.parentNode;
    if (!parentElement) return;
    const { href, hash, dataset } = a;
    const attrs = getVideoAttrs(hash || 'autoplay', dataset);
    const video = `<video ${attrs}></video>`;
    a.insertAdjacentHTML('afterend', video);
    createIntersectionObserver({
      el: parentElement,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: () => {
        parentElement
          .querySelector('video')
          .appendChild(createTag('source', { src: href, type: 'video/mp4' }));
      },
    });
    const videoElem = document.body.querySelector(`source[src="${href}"]`)?.parentElement;
    applyHoverPlay(videoElem);
    a.remove();
  } else {
    const embed = `<div class="milo-video">
      <iframe src="${a.href}" class="adobetv" webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" allow="encrypted-media" title="Adobe Video Publishing Cloud Player" loading="lazy">
      </iframe>
    </div>`;
    a.insertAdjacentHTML('afterend', embed);
    a.remove();
  }
};

export default function init(a) {
  a.classList.add('hide-video');
  loadAdobeTv(a);
}
