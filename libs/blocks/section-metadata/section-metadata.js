import { handleFocalpoint } from '../../utils/decorate.js';
import { createTag, getFedsPlaceholderConfig } from '../../utils/utils.js';

const replacePlaceholder = async (key) => {
  const { replaceKey } = await import('../../features/placeholders.js');
  return replaceKey(key, getFedsPlaceholderConfig());
};
const ADD_MORE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none"><path fill="#292929" d="M12 24.24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12Zm0-21.943c-5.483 0-9.943 4.46-9.943 9.943s4.46 9.943 9.943 9.943 9.943-4.46 9.943-9.943S17.483 2.297 12 2.297Z"/><path fill="#292929" d="M16.55 11.188h-3.5v-3.5a1.05 1.05 0 0 0-2.1 0v3.5h-3.5a1.05 1.05 0 0 0 0 2.1h3.5v3.5a1.05 1.05 0 0 0 2.1 0v-3.5h3.5a1.05 1.05 0 0 0 0-2.1Z"/></svg>';

const mediaQueries = {
  mobile: window.matchMedia('(max-width: 599px)'),
  tablet: window.matchMedia('(min-width: 600px) and (max-width: 1199px)'),
};

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

const applyBackground = (colors, section) => {
  if (colors.length === 1) {
    const [color] = colors;
    section.style.background = color;
    return;
  }
  if (colors.length === 2) {
    const [mobileColor, tabletDesktopColor] = colors;
    section.style.background = mediaQueries.mobile.matches ? mobileColor : tabletDesktopColor;
    return;
  }
  if (colors.length >= 3) {
    const [mobileColor, tabletColor, desktopColor] = colors;
    if (mediaQueries.mobile.matches) {
      section.style.background = mobileColor;
    } else if (mediaQueries.tablet.matches) {
      section.style.background = tabletColor;
    } else {
      section.style.background = desktopColor;
    }
  }
};

export function handleBackground(div, section) {
  const pic = div.background.content?.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    handleFocalpoint(pic, div.background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.background.content?.textContent?.trim();
    if (color) {
      const colors = color.split('|').map((c) => c.trim());
      applyBackground(colors, section);
      Object.keys(mediaQueries).forEach((key) => {
        mediaQueries[key].addEventListener('change', () => applyBackground(colors, section), 100);
      });
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

export function getDelayTime(time) {
  if (time > 99) return time;
  return (time * 1000);
}

function handleDelay(time, section) {
  if (!(time || section)) return;
  section.classList.add('hide-sticky-section');
  setTimeout(() => { section.classList.remove('hide-sticky-section'); }, getDelayTime(time));
}

function handleAnchor(anchor, section) {
  if (!anchor || !section) return;
  section.id = anchor.toLowerCase().trim().replaceAll(/\s+/g, '-');
  section.classList.add('section-anchor');
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.replace(/ /g, '-').trim().toLowerCase();
    const content = row.children[1];
    const text = content?.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

async function createAndConfigureShowMoreButton(section, cardsCount) {
  const seeMoreText = await replacePlaceholder('see-more-features');
  const showMoreButton = createTag(
    'div',
    { class: `show-more-button${cardsCount <= 3 ? ' hidden' : ''}` },
  );
  const button = createTag('button', {}, seeMoreText);

  const iconSpan = createTag('span', {
    class: 'show-more-icon',
    'aria-hidden': 'true',
  }, `${ADD_MORE_ICON}`);
  button.appendChild(iconSpan);

  button.addEventListener('click', () => {
    section.classList.add('show-all');
    section.querySelector('.show-more-button').remove();
  });

  showMoreButton.append(button);
  return showMoreButton;
}

async function handleCollapseSection(section) {
  if (!section) return;
  const blocks = section.querySelectorAll(':scope > div:not(:last-child)');
  const showMoreButton = await createAndConfigureShowMoreButton(section, blocks.length);
  section.append(showMoreButton);
  const { decorateDefaultLinkAnalytics } = await import('../../martech/attributes.js');
  decorateDefaultLinkAnalytics(showMoreButton);
}

function addListAttrToSection(section) {
  if (!section) return;
  const isSectionUp = [...section.classList].some((c) => c.endsWith('-up'));
  const hasHeader = section.querySelector('h1, h2, h3, h4, h5, h6');
  const allowedBlocks = ['icon-block', 'action-item', 'section-metadata'];
  const hasAllowedChildren = [...section.children]
    .every((child) => allowedBlocks.some((block) => child.classList.contains(block)));
  if (!isSectionUp || hasHeader || !hasAllowedChildren) return;
  section.setAttribute('role', 'list');
  [...section.children].forEach((child) => {
    if (child.classList.contains('section-metadata')) return;
    child.setAttribute('role', 'listitem');
  });
}

export default async function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  const advanced = el.classList.contains('advanced');
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (metadata.delay) handleDelay(metadata.delay.text, section);
  if (metadata.anchor) handleAnchor(metadata.anchor.text, section);
  if (metadata['collapse-ups-mobile']?.text === 'on') await handleCollapseSection(section);
  if (advanced) handleAdvanced(metadata, section);
  addListAttrToSection(section);
}
