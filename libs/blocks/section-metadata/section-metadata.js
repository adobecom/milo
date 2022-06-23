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

function handleSectionAside(value, section) {
  const firstBlock = section.querySelector(':scope > div:nth-child(1)');
  const allBlocks = section.querySelectorAll(':scope > div:nth-child(n+2)');
  if (firstBlock && allBlocks.length) {
    const container = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    container.classList.add('container', 'aside-columns');
    col1.classList.add('col-1');
    col2.classList.add('col-2');
    col1.insertAdjacentElement('afterbegin', firstBlock);
    allBlocks.forEach((block) => {
      col2.insertAdjacentElement('beforeend', block);
    });
    container.insertAdjacentElement('afterbegin', col1);
    section.insertAdjacentElement('afterbegin', container);
    container.insertAdjacentElement('beforeend', col2);
  }
}

function handleStyle(div, section) {
  const value = div.textContent.toLowerCase();
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    section.classList.add(...styles);
    const colClasses = ['left-aside', 'right-aside'];
    styles.forEach((style) => {
      if (colClasses.indexOf(style) > -1) {
        handleSectionAside(style, section);
      }
    });
  }
}

export default function init(el) {
  const section = el.closest('main > div');
  if (!section) return;
  section.className = 'section';
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  keyDivs.forEach((div) => {
    const valueDiv = div.nextElementSibling;
    if (div.textContent === 'style') {
      handleStyle(valueDiv, section);
    }
    if (div.textContent === 'background') {
      handleBackground(valueDiv, section);
    }
  });
}
