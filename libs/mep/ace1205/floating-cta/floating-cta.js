import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const createArrowIcon = (className) => {
  const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11.208 5.417L7.50781 1.7168C7.18554 1.39453 6.66406 1.39453 6.34179 1.7168C6.01953 2.03907 6.01953 2.56055 6.34179 2.88282L8.63281 5.17481H1.375C0.918955 5.17481 0.549805 5.54395 0.549805 6.00001C0.549805 6.45607 0.918945 6.82521 1.375 6.82521H8.63281L6.34179 9.1172C6.01953 9.43947 6.01953 9.96095 6.34179 10.2832C6.50292 10.4444 6.71386 10.5254 6.9248 10.5254C7.13574 10.5254 7.34668 10.4444 7.50781 10.2832L11.208 6.58302C11.5303 6.26075 11.5303 5.73927 11.208 5.417Z" fill="#292929"/></svg>`;
  const arrowIcon = createTag('span', { class: className });
  arrowIcon.innerHTML = ARROW_SVG;
  return arrowIcon;
}

export default function init(el) {
  const blockName = el.classList[0]?.toLowerCase();
  if (!blockName) return;

  const rows = el.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  if (!firstRow) return;

  const contentDiv = firstRow.querySelector(':scope > div:first-child');
  if (!contentDiv) return;
  
  const identifiers = ['icon', 'text', 'arrow'];
  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const prodIcon = contentDiv.querySelector('img');

  if (prodIcon && isSvgUrl(prodIcon.src)) {
    prodIcon.src = getFederatedUrl(prodIcon.src);
  }

  const ctaContent = createTag('div', { class: `${blockName}-content` });
  const cta = createTag('button');
  cta.classList.add(`${blockName}-wrapper`);
  let count = 0;
  while (contentDiv.firstChild) {
    const child = contentDiv.firstChild;
    if (child.nodeType === Node.ELEMENT_NODE && count < identifiers.length) {
      child.classList.add(`${blockName}-${identifiers[count]}`);
      count++;
    }
    ctaContent.appendChild(child);
  }
  ctaContent.appendChild(createArrowIcon(`${blockName}-${identifiers[2]}`));
  cta.appendChild(ctaContent);
  firstRow.replaceWith(cta);

  // const section = document.querySelector('main .section:nth-child(2)');

  // const observer = new IntersectionObserver(
  //   ([entry]) => {
  //     // When the hero banner is mostly above the viewport, show the CTA
  //     const topCrossedMidpoint = entry.boundingClientRect.top <= -window.innerHeight * 0.33;
  //     console.log('CTA visibility:', topCrossedMidpoint, entry.boundingClientRect.top, -window.innerHeight * 0.33);
  //     cta.classList.toggle('active', topCrossedMidpoint);
  //   },
  //   { threshold: [0] }
  // );
  // observer.observe(section);
}