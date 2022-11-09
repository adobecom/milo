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

function colsAutoOffset(cols) {
  let offsets = {};
  const total = cols.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  if (total > 12) {
    let rowSum = 0, rowStart = 0;
    cols.forEach((col, idx, arr) => {
      const sum = rowSum + parseInt(col, 10);
      if (sum < 12) rowSum = sum;
      else if (sum == 12) rowSum = 0, rowStart = idx + 1;
      else if (sum > 12) rowSum = parseInt(col, 10), rowStart = idx;
      if (sum > 12 || sum < 12 && idx === arr.length - 1) offsets[rowStart] = (12 - rowSum) / 2;
    });
  } else if (total < 12) {
    offsets[0] = (12 - total) / 2;
  }
  return offsets;
}

function handleColumns(value, values, section) {
  if (!value.includes('up')) return { columns: values, offsets: colsAutoOffset(values) };
  const ups = { 'two': 6, 'three': 4, 'four': 3, 'five': 2, 2: 6, 3: 4, 4: 3, 5: 2 };
  const up = values.find(i => i.includes('up'));
  const colSpan = ups[up.replace(' up', '')];
  const sectionClass = Object.keys(ups).filter(key => ups[key] === colSpan);
  section.classList.add(`${sectionClass[1]}-up`);
  const spans = Array(parseInt(sectionClass[0])).fill(colSpan);
  return { columns: [colSpan], offsets: colsAutoOffset(spans) };
}

function handleGridColumns(div, section) {
  const value = div.textContent.toLowerCase();
  const values = value.split(', ');
  const gridItems = [...section.children].filter(c => !c.classList.contains('section-metadata') && !c.classList.contains('fill-row'));
  if (gridItems.length) {
    const { columns, offsets } = handleColumns(value, values, section);
    gridItems.forEach((col, i) => {
      col.classList.add(`col-${columns[i] ?? columns[0]}`);
      if (offsets[i]) col.classList.add(`offset-${offsets[i]}`);
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
