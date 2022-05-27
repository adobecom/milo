export default function init(a) {
  const embed = `<div class="milo-video">
    <iframe src="${a.href}" class="adobetv" webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" allow="encrypted-media" title="Adobe Video Publishing Cloud Player" loading="lazy">
    </iframe>
  </div>`;
  a.insertAdjacentHTML('afterend', embed);
  a.remove();
}

export function videoController(arg, el) {
  // get adobetv iframe.
  let adobetvIframe;
  if (el) {
    adobetvIframe = el.querySelector('.adobetv') || el.parentElement.querySelector('.adobetv');
  } else {
    adobetvIframe = document.querySelector('.adobetv');
  }

  // do nothing if either of variable is not available.
  if (!arg || !adobetvIframe) return;

  // run the video control action.
  const { origin } = new URL(adobetvIframe.src);
  adobetvIframe.contentWindow.postMessage({
    type: 'mpcAction',
    action: arg,
  }, origin);
}
