import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateVideo, decorateVideoLinks } from '../_shared/s1-video.js';

const HERO_CONTEXT = '.marquee, .aside, .hero-marquee, .quiz-marquee';

function heroContext(el) {
  return !!el.parentElement?.closest(HERO_CONTEXT);
}

function decorateAnchor(a, ctx) {
  const holder = decorateVideo(a, { autoplayByDefault: heroContext(a), make: ctx.make });
  if (!holder) {
    if (!a.parentNode) a.remove();
    return null;
  }
  holder.classList.add('video', 'spectrum2');
  holder.dataset.spectrum2Member = ctx.member;
  holder.dataset.spectrum2Origin = ctx.origin;
  return holder;
}

function decorateVideoBlock(el, ctx) {
  if (el.nodeName === 'A') return decorateAnchor(el, ctx);
  el.classList.add('video');
  pageShims(el, ctx.make);
  return decorateVideoLinks(el, { autoplayByDefault: heroContext(el), make: ctx.make });
}

export const MEMBERS = {
  video: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateVideoBlock,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'video' });
}
