import { turnAnchorIntoVideo } from '../../utils/decorate.js';

const loadAdobeTv = (a) => {
  const bgBlocks = ['aside', 'marquee', 'hero-marquee'];
  if (a.href.includes('.mp4') && bgBlocks.some((b) => a.closest(`.${b}`))) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    turnAnchorIntoVideo({
      hash: a.hash || 'autoplay',
      src: a.href,
      anchorTag: a,
    });
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
