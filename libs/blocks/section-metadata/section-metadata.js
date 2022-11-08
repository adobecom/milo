function handleBackground(bg, section) {
  if (bg.nodeName === 'PICTURE') {
    section.classList.add('has-background');
    bg.classList.add('section-background');
    section.insertAdjacentElement('afterbegin', bg);
  } else {
    const color = bg;
    if (color) {
      section.style.backgroundColor = color;
    }
  }
}

export function handleStyle(value, section) {
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  section.classList.add(...styles);
}

export const getSectionMetadata = (el) => {
  if (!el) return {};
  const metadata = {};
  el.childNodes.forEach((node) => {
    const key = node.children?.[0]?.textContent?.toLowerCase();
    if (!key) return;
    const pic = node.children?.[1].querySelector('picture');
    const val = key === 'background' && pic ? pic : node.children?.[1]?.textContent?.toLowerCase();
    metadata[key] = val;
  });
  return metadata;
};

export default function init(el) {
  const section = el.closest('.section');
  if (!section) return;
  const metadata = getSectionMetadata(el);
  if (metadata.style) handleStyle(metadata.style, section);
  if (metadata.background) handleBackground(metadata.background, section);
}
