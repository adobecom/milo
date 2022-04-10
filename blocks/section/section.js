function decorateHero(el) {

}

function decorateEngage(el) {

}

function decorateAbout(el) {

}

function decorateGeneric(el) {

}

export default function init(el) {
  const variant = el.classList[1];
  switch (variant) {
    case 'hero':
      decorateHero(el);
      break;
    case 'engage':
      decorateEngage(el);
      break;
    case 'about':
      decorateAbout(el);
      break;
    default:
      decorateGeneric(el);
  }
}
