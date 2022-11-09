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

function handleStyle(div, section, keyDivs) {
  const configs = [...keyDivs].map(div => (div.textContent.toLowerCase())).join(' ');
  const value = div.textContent.toLowerCase();
  let styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    if (configs.includes('grid')) styles = [...styles, 'grid'];
    if (!configs.includes('columns')) styles = [...styles, 'auto-cols'];
    section.classList.add(...styles);
  }
}

function colsAutoOffset(cols) {
  let offset = cols.length;
  const total = cols.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  if (total > 12) {
    let i = 0;
    for (const col of cols) {
      const addCol = i + parseInt(col);
      if (addCol < 12) i = addCol;
      else offset = cols.indexOf(col) + 1;
    }
  }
  return total == 12 ? null : offset;
}

function handleColumns(value, values, section) {
  if (!value.includes('up')) return { columns: values, offset: colsAutoOffset(values) };
  let upConfig = { 'two': 6, 'three': 4, 'four': 3, 'five': 2, 2: 6, 3: 4, 4: 3, 5: 2 };
  const up = values.find(i => i.includes('up'));
  const colSpan = upConfig[up.replace(' up', '')];
  const sectionClass = Object.keys(upConfig).filter(key => upConfig[key] === colSpan);
  section.classList.add(`${sectionClass[1]}-up`);
  const spans = Array(parseInt(sectionClass[0])).fill(colSpan);
  return { columns: [colSpan], offset: colsAutoOffset(spans) };
}

function handleGridColumns(div, section) {
  const value = div.textContent.toLowerCase();
  const values = value.split(', ');
  const gridCols = [...section.children].filter(c => !c.classList.contains('section-metadata') && !c.classList.contains('fill-row'));
  if (gridCols.length) {
    const { columns, offset } = handleColumns(value, values, section);
    gridCols.forEach((col, i) => {
      col.classList.add(`col-${columns[i] ?? columns[0]}`);
      if (offset && i % offset == 0) col.classList.add('offset');
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
      handleStyle(valueDiv, section, keyDivs);
    }
    if (keyDiv === 'background') {
      handleBackground(valueDiv, section);
    }
    if (keyDiv === 'grid' && valueDiv.textContent) {
      handleStyle(valueDiv, section, keyDivs);
    }
    if (keyDiv === 'columns' && valueDiv.textContent) {
      handleGridColumns(valueDiv, section);
    }
  });
}
