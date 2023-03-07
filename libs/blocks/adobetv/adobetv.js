export default function init(a) {
  const embed = `<div class="milo-video">
    <iframe src="${a.href}" class="adobetv" webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" allow="encrypted-media" title="Adobe Video Publishing Cloud Player" loading="lazy">
    </iframe>
  </div>`;
  a.insertAdjacentHTML('afterend', embed);
  a.remove();
}
