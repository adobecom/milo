import { handleFocalpoint } from '../../utils/decorate.js';

const generateID = () => {
  const idLength = 9;
  const getId = Date.now();

  let uid = getId.toString().split('').reverse();
  uid = uid.splice(0, idLength).join('');

  return uid;
};

function handleAdvanced(metadata, section) {
  console.log('where my metadata', metadata);
  if (!metadata || !section) return;

  const templateAreaArray = [metadata.grid, metadata['grid-tablet'], metadata['grid-desktop']];
  console.log('grid array', templateAreaArray);
  const sectionId = `section-${generateID()}`;
  section.classList.add('advanced', sectionId);

  if (!metadata.grid || !metadata.grid.text) return;
  console.log('metadata.grid', metadata['grid-desktop']?.text);

  // test - get all breakpoint details
  // const gridBreakpoint = Object.keys(metadata).filter((key) => key.indexOf('grid') === 0).reduce((newData, key) => {
  //   console.log('newData', newData);
  //   newData[key] = metadata[key];
  //   return newData;
  // }, {});
  // console.log('gridBreakpoint', gridBreakpoint);
  const templateAreas = [];

  // const tabletAreasArray = gridBreakpoint['grid-tablet'];
  // // const tabletAreasArray = Object.entries(gridBreakpoint['grid-tablet']);
  // // const desktopAreasArray = Object.entries(gridBreakpoint['grid-desktop']);
  // console.log('tabletAreasArray', tabletAreasArray.text); // tabletAreasArray[1][1]?.text
  // // const desktopTemplateAreas = [];

  metadata.grid.text.split('\n').forEach((line) => {
    console.log('line', line);
    templateAreas.push(...line.trim().replace(/,/g, '').split('\n'));
  });
  const areasString = templateAreas.map((area) => `"${area}"`).join('\n');
  const areas = templateAreas.map((area) => `${area}`).join('\n').replace(/\n/g, ' ').split(' ');

  // const testArray = areas.replace(/\n/g, ' ').split(' ');
  // Removes duplicates
  const gridTemplateAreas = [...new Set(areas)];
  console.log('area Styles', areas);
  console.log('grid Areas Styles', gridTemplateAreas);

  const items = section.querySelectorAll(":scope > div:not([class*='metadata'])");
  [...items].forEach((item, rdx) => {
    const currentStyle = item.getAttribute('style') || '';
    // item.style = `${currentStyle} grid-area: area-${rdx + 1}`;
    item.style = `${currentStyle} grid-area: ${gridTemplateAreas[rdx]}`;
  });
  const templateAreasStyles = `
    .${sectionId} {
      grid-template-areas: ${areasString};
    }
  `;
  console.log('templateAreasStyles', templateAreasStyles);
  section.style = `grid-template-areas: ${areasString}`;
}

function handleBackground(div, section) {
  const pic = div.background.content?.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    handleFocalpoint(pic, div.background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.background.content?.textContent;
    if (color) {
      section.style.background = color;
    }
  }
}

export async function handleStyle(text, section) {
  if (!text || !section) return;
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  const sticky = styles.find((style) => style === 'sticky-top' || style === 'sticky-bottom');
  if (sticky) {
    const { default: handleStickySection } = await import('./sticky-section.js');
    await handleStickySection(sticky, section);
  }
  if (styles.includes('masonry')) styles.push('masonry-up');
  section.classList.add(...styles);
}

function handleMasonry(text, section) {
  section.classList.add(...['masonry-layout', 'masonry-up']);
  const divs = section.querySelectorAll(":scope > div:not([class*='metadata'])");
  const spans = [];
  text.split('\n').forEach((line) => spans.push(...line.trim().split(',')));
  [...divs].forEach((div, i) => {
    const spanWidth = spans[i] ? spans[i] : 'span 4';
    div.classList.add(`grid-${spanWidth.trim().replace(' ', '-')}`);
  });
}

function handleLayout(text, section) {
  if (!(text || section)) return;
  const layoutClass = `grid-template-columns-${text.replaceAll(' | ', '-')}`;
  section.classList.add(layoutClass);
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.replace(/ /g, '-').trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default async function init(el) {
  const section = el.closest('.section');
  const advanced = el.classList.contains('advanced');
  const metadata = getMetadata(el);
  // const sectionMetadata = el.closest('.section-metadata');
  // sectionMetadata.remove();
  // console.log('shamon', sectionMetadata);
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (advanced) handleAdvanced(metadata, section);
}
