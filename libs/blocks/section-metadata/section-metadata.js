import createTag from '../../utils/utils.js';

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

function handleStyle(div, section) {
  const value = div.textContent.toLowerCase();
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  section.classList.add(...styles);
}

async function handleWrapper(div, section) {
  let value = div.textContent.toLowerCase();
  value = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  let wrapper = section.parentElement.querySelector(`.section.${value.join('.')}`);
  if (!wrapper) {
    wrapper = createTag('div', { class: `section ${value.join(' ')}` });
    section.insertAdjacentElement('beforebegin', wrapper);
  }
  wrapper.append(section);
}

export default function init(el) {
  const section = el.closest('main > div');
  if (!section) return;
  section.className = 'section';
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  keyDivs.forEach((div) => {
    const key = div.textContent;
    const valueDiv = div.nextElementSibling;
    if (key === 'style') {
      handleStyle(valueDiv, section);
    }
    if (key === 'background') {
      handleBackground(valueDiv, section);
    }
    if (key === 'wrapper') {
      handleWrapper(valueDiv, section);
    }
  });
}
