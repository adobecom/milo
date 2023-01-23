function handleBackground(div, section) {
  const pic = div.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.textContent;
    if (color) {
      section.style.backgroundColor = color;
    }
  }
}

export function handleStyle(text, section) {
  if (section) {
    if (!text) return;
    const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
    section.classList.add(...styles);
  }
}

function handleLayout(text, section) {
  if (!(text || section)) return;
  const layoutClass = `grid-template-columns-${text.replaceAll(' | ', '-')}`;
  section.classList.add(layoutClass);
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  if (metadata.style) handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata.background.content, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
}
