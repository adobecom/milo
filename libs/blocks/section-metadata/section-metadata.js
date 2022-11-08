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
  if (section) {
    section.classList.add(...styles);
  }
}

function handleGrid(div, section) {
  const value = div.textContent.toLowerCase();
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    section.classList.add('grid', ...styles);
  }
}

function handleUps(value, values, section) {
  if (!value.includes('up')) return { up: null, columns: values };
  let upConfig = { 'two': 6, 'three': 4, 'four': 3, 'five': 2, 2: 6, 3: 4, 4: 3, 5: 2 };
  const up = values.find(i => i.includes('up'));
  const offset = value.includes('offset');
  if (offset) {
    upConfig[2] = 5;
    upConfig['two'] = 5;
  }
  const colSpan = upConfig[up.replace(' up', '')];
  const sectionClass = Object.keys(upConfig).filter(key => upConfig[key] === colSpan);
  section.classList.add(`${sectionClass[1]}-up`);
  return { up, columns: [colSpan] };
}

function handleGridCols(div, section) {
  const value = div.textContent.toLowerCase();
  const values = value.split(', ');
  const children = [...section.children].filter(c => !c.classList.contains('section-metadata') && !c.classList.contains('fill-row'));
  if (children.length) {
    const { up, columns } = handleUps(value, values, section);
    const getCol = i => columns[i] ? columns[i] : columns[0];
    const offset = up && value.includes('offset') ? values.find(i => i.includes('offset')).replaceAll(' ', '-') : null;
    children.forEach((child, i) => {
      child.classList.add(`col-${getCol(i)}`);
      if (up && offset && i % parseInt(up.replace(' up', '')) == 0) child.classList.add(offset);
    });
  }
}

export const getSectionMetadata = (el) => {
  if (!el) return {};
  const metadata = {};
  el.childNodes.forEach((node) => {
    const key = node.children?.[0]?.textContent?.toLowerCase();
    if (!key) return;
    const val = node.children?.[1]?.textContent?.toLowerCase();
    metadata[key] = val;
  });
  return metadata;
};

export default function init(el) {
  const section = el.closest('.section');
  if (!section) return;
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  keyDivs.forEach((div) => {
    const keyDiv = div.textContent.toLowerCase();
    const valueDiv = div.nextElementSibling;
    if (keyDiv === 'style' && valueDiv.textContent) {
      handleStyle(valueDiv, section);
    }
    if (keyDiv === 'background') {
      handleBackground(valueDiv, section);
    }
    if (keyDiv === 'grid' && valueDiv.textContent) {
      handleGrid(valueDiv, section);
    }
    if (keyDiv === 'columns' && valueDiv.textContent) {
      handleGridCols(valueDiv, section);
    }
  });
}
