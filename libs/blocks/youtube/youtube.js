export default function init(a) {
  const embed = a.pathname;
if (a.origin?.includes('youtu')) {
  const id = embed.split('/').pop();
  let src;
  let className;
  if (embed.includes('embed')) {
    src = `https://www.youtube.com/embed/${id}`;
    className = 'youtube';
  } else {
    src = `https://www.youtube.com${id ? `/embed/${id}?rel=0&amp;v=${id}` : embed}`;
  }
  const embedHTML = `<div class="milo-video">
      <iframe src="${embedUrl}" ${className && `class="${className}"`} webkitallowfullscreen mozallowfullscreen allowfullscreen style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" scrolling="no" title="Content from Youtube" loading="lazy">
      </iframe>
    </div>`;
  a.insertAdjacentHTML('afterend', embedHTML);
  a.remove();
}
}
