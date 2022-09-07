export default function init(a) {
  const embed = a.pathname;
  if (a.origin.includes('youtu')) {
    if (embed.includes('embed')) {
      const id = embed.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${id}`;
      const embedHTML = `<div class="milo-video">
        <iframe src="${embedUrl}" class="youtube" webkitallowfullscreen mozallowfullscreen allowfullscreen style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
        </iframe>
      </div>`;
      a.insertAdjacentHTML('afterend', embedHTML);
      a.remove();
    } else {
      const id = embed.split('/').pop();
      const embedHTML = `<div class="milo-video">
      <iframe src="https://www.youtube.com${id ? `/embed/${id}?rel=0&amp;v=${id}` : embed}" webkitallowfullscreen mozallowfullscreen allowfullscreen style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
      a.insertAdjacentHTML('afterend', embedHTML);
      a.remove();
    }
  }
}
