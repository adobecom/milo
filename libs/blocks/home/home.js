async function decorateHero(el, fg) {
  const { default: nav } = await import('../milonav/milonav.js');
  const navblock = await nav(fg);
  navblock.querySelector('li:first-child').remove();
}

function decorateEngage(el) {
  const involve = el.querySelector(':scope > .fg > div');
  involve.className = 'get-involved';

  const madeIn = el.querySelector(':scope > .fg > div:last-child');
  madeIn.className = 'made-in';

  const extra = el.querySelector('.extra');
  const pic = extra.querySelector('picture');
  pic.className = 'engage-gradient';
  el.querySelector(':scope > .fg').append(pic);
  extra.remove();
}

function decorateAbout(el) {

}

function decorateGeneric(el) {

}

export default function init(el) {
  const variant = el.className;
  const children = el.querySelectorAll(':scope > div');
  children.forEach((child, idx) => {
    if (idx === 0) {
      child.className = 'bg';
    }
    if (idx === 1) {
      child.className = 'fg';
    }
    if (idx > 1) {
      child.className = 'extra';
    }
  });
  const pics = children[0].querySelectorAll(':scope > div picture');
  pics.forEach((pic, idx) => {
    const bgItem = document.createElement('div');
    bgItem.className = `bg-item item-${idx + 1}`;
    bgItem.append(pic);
    children[0].append(bgItem);
  });
  children[0].querySelector(':scope > div').remove();
  switch (variant) {
    case 'home hero':
      decorateHero(el, children[1]);
      break;
    case 'home engage':
      decorateEngage(el);
      break;
    case 'home about':
      decorateAbout(el);
      break;
    default:
      decorateGeneric(el);
  }
}
