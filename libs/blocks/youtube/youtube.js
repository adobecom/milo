import { createIntersectionObserver, isInTextNode } from '../../utils/utils.js';

export default function init(a) {
  const embedVideo = () => {
    if (isInTextNode(a) || !a.origin?.includes('youtu')) return;
    const title = !a.textContent.includes('http') ? a.textContent : 'Youtube Video';
    const searchParams = new URLSearchParams(a.search);
    const id = searchParams.get('v') || a.pathname.split('/').pop();
    searchParams.delete('v');
    const src = `https://www.youtube.com/embed/${id}?${searchParams.toString()}`;
    const embedHTML = `
    <div class="milo-video">
      <iframe src="${src}" class="youtube"
        webkitallowfullscreen mozallowfullscreen allowfullscreen
        allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"
        scrolling="no"
        id="player-${id}"
        title="${title}">
      </iframe>
    </div>`;
    a.insertAdjacentHTML('afterend', embedHTML);
    a.remove();
    if (document.readyState === 'complete') {
      /* eslint-disable-next-line no-underscore-dangle */
      window._satellite?.track('trackYoutube');
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          /* eslint-disable-next-line no-underscore-dangle */
          window._satellite?.track('trackYoutube');
        }
      });
    }
  };
  createIntersectionObserver({ el: a, callback: embedVideo });
}
