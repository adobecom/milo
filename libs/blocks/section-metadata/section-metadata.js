function handleBackground(div, section) {
  const pic = div.background.content.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    handleFocalpoint(pic, div.background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.background.content.textContent;
    if (color) {
      section.style.background = color;
    }
  }
}

export function handleFocalpoint(pic, child) {
  if (!(child)) return;
  let text = '';
  if (child.childElementCount == 2) {
    text = child.querySelectorAll('p')[1]?.textContent;
  } else if (child.textContent) {
    text = child.textContent;
  }
  const image = pic.querySelector('img');
  const directions = text.slice(text.indexOf(':') + 1).split(',');
  const [x,y = ''] = directions
  if (image) {
    image.style.objectPosition = `${x.trim().toLowerCase()} ${y.trim().toLowerCase()}`;
  }
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function handleTopHeight(section) {
  const headerHeight = document.querySelector('header').offsetHeight;
  section.style.top = `${headerHeight}px`;
}

function handleStickySection(sticky, section) {
  const main = document.querySelector('main');
  switch (sticky) {
    case 'sticky-top':
      window.addEventListener('resize', debounce(() => handleTopHeight(section)));
      main.prepend(section);
      break;
    case 'sticky-bottom':
      main.append(section);
      break;
    default:
      break;
  }
}

export function handleStyle(text, section) {
  if (!text || !section) return;
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  const sticky = styles.find((style) => style === 'sticky-top' || style === 'sticky-bottom');
  if (sticky) {
    handleStickySection(sticky, section);
  }
  section.classList.add(...styles);
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
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
}
