function decorateHero(el) {
  // console.log(el);
  // const name = el.querySelector('h1');
  // const desc = el.querySelector('h1 + p');
  // const parent = name.parentElement;
  // const text = document.createElement('div');
  // text.className = 'text-wrapper';
  // text.append(name, desc);
  // parent.parentElement.append(text);
}

function decorateEngage(el) {

}

function decorateAbout(el) {

}

function decorateGeneric(el) {

}

export default function init(el) {
  const contents = el.querySelectorAll(':scope > div');
  contents[0].className = 'bg';
  contents[1].className = 'fg';

  const pics = contents[0].querySelectorAll(':scope > div > p > picture');
  pics.forEach((pic, idx) => {
    const bgItem = document.createElement('div');
    bgItem.className = `bg-item item-${idx + 1}`;
    bgItem.append(pic);
    contents[0].append(bgItem);
  });
  contents[0].querySelector(':scope > div').remove();

  const variant = el.className;
  switch (variant) {
    case 'section home hero':
      decorateHero(el);
      break;
    case 'section engage':
      decorateEngage(el);
      break;
    case 'section about':
      decorateAbout(el);
      break;
    default:
      decorateGeneric(el);
  }
}
