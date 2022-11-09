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

function handleStyle(div, section, customs = []) {
  const value = div.textContent?.toLowerCase();
  let styles = value.split(', ').map((style) => style.replaceAll(' ', '-')).filter(i => i !== '');
  if (section) {
    if (customs.length) styles = [...styles, ...customs];
    section.classList.add(...styles.filter(i => i !== ''));
  }
}

function handleColumns(value, values) {
  if (!value.includes('up')) return { columns: values, offset: null, upClass: null };
  const ups = { 'two': 6, 'three': 4, 'four': 3, 'five': 2, 2: 6, 3: 4, 4: 3, 5: 2 };
  const up = values.find(i => i.includes('up'));
  const colSpan = ups[up.replace(' up', '')];
  return {
    upClass: `${Object.keys(ups).filter(key => ups[key] === colSpan)[1]}-up`,
    columns: [colSpan],
    offset: colSpan == 2 ? 5 : null
  };
}

function handleGridColumns(div, section) {
  const value = div.textContent.toLowerCase();
  const values = value.split(', ');
  const gridItems = [...section.children].filter(c => !c.classList.contains('section-metadata') && !c.classList.contains('fill-row'));
  if (gridItems.length) {
    const { columns, offset, upClass } = handleColumns(value, values);
    if (upClass) section.classList.add([upClass]);
    gridItems.forEach((col, i) => {
      col.classList.add(`col-${columns[i] ?? columns[0]}`);
      if (offset && i % offset == 0) col.classList.add(`offset-desktop`);
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
  const keys = [...keyDivs].map(div => (div.textContent.toLowerCase())).join(' ');
  keyDivs.forEach((div) => {
    const keyDiv = div.textContent.toLowerCase();
    const valueDiv = div.nextElementSibling;
    if (keyDiv === 'style' && valueDiv.textContent) {
      handleStyle(valueDiv, section);
    }
    if (keyDiv === 'background') {
      handleBackground(valueDiv, section);
    }
    if (keyDiv === 'grid') {
      const styles = ['grid'];
      if (!keys.includes('columns')) styles.push('auto-cols');
      handleStyle(valueDiv, section, styles);
    }
    if (keyDiv === 'columns' && valueDiv.textContent) {
      handleGridColumns(valueDiv, section);
    }
  });
}
