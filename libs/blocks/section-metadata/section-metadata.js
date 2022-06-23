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

function handleSectionColumn(value, section) {
  const container = document.createElement('div');
  container.classList.add('container', 'section-columns');
  const col1 = section.querySelector(':scope > div:nth-child(1)');
  col1.classList.add('col-1');
  container.insertAdjacentElement('afterbegin', col1);
  section.insertAdjacentElement('afterbegin', container);
  const allBlocks = section.querySelectorAll(':scope > div:nth-child(n+2)');
  if (allBlocks) {
    const col2 = document.createElement('div');
    col2.classList.add('col-2');
    allBlocks.forEach((block) => {
      col2.insertAdjacentElement('beforeend', block);
    });
    container.insertAdjacentElement('beforeend', col2);
  }
}

function handleStyle(div, section) {
  const value = div.textContent.toLowerCase();
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    section.classList.add(...styles);
    const colClasses = ['left-column', 'right-column'];
    styles.forEach((style) => {
      if (colClasses.indexOf(style) > -1) {
        handleSectionColumn(style, section);
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
