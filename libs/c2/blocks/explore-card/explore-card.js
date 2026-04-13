import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockText, decorateTextOverrides } from '../../../utils/decorate.js';

function hasContent(node) {
  return node.textContent?.trim() !== '' || node.querySelector('img, picture, svg, a[href]');
}

function getForegroundContent(foregroundRow, contentDiv, blockName) {
  if (foregroundRow) {
    if (hasContent(foregroundRow)) {
      [...foregroundRow.children].forEach((child) => child.classList.add(`${blockName}-foreground`));
      contentDiv?.append(...foregroundRow.childNodes);
    }
    foregroundRow.remove();
  }
}

function addMissingContent(con, previous) {
  if (!previous) return;

  const [firstRow, foregroundRow] = con;
  const [contentDiv, backgroundDiv] = firstRow.children;
  const [prevFirstRow, prevForegroundRow] = previous.contentContainer.children;
  const [prevContentDiv, prevBackgroundDiv] = prevFirstRow.children;

  const pairs = [
    [foregroundRow, prevForegroundRow],
    [contentDiv, prevContentDiv],
    [backgroundDiv, prevBackgroundDiv],
  ];

  pairs.forEach(([el, prev]) => {
    if (el?.children.length || el?.textContent) return;
    el?.replaceChildren(...[...prev.children].map((c) => c.cloneNode(true)));
  });
}

function getViewportConfig(el) {
  const viewportContent = {};
  const children = [...el.children];
  const delimiterEls = [];
  const delimiters = ['mobile', 'tablet', 'desktop'];
  const isDelimiter = (text, viewportId) => {
    const sanitizedText = text.trim().toLowerCase();
    return sanitizedText.startsWith(`${viewportId}-viewport`)
      || sanitizedText === viewportId
      || sanitizedText.startsWith(`${viewportId} `)
      || sanitizedText.startsWith(`${viewportId}(`);
  };
  delimiters.forEach((delimiter, index) => {
    const delimiterIndex = children
      .findIndex((child) => isDelimiter(child.textContent, delimiter));
    if (delimiterIndex < 0) return;
    const nextDelimiterIndex = children
      .findIndex((child) => isDelimiter(child.textContent, delimiters[index + 1]));
    const content = children
      .slice(delimiterIndex + 1, nextDelimiterIndex < 0 ? children.length : nextDelimiterIndex);
    addMissingContent(content, viewportContent[delimiters[index - 1]]);
    const delimiterEl = children[delimiterIndex];
    const classes = delimiterEl.textContent.toLowerCase().trim().match(/\(([^)]+)\)/)?.[1];
    delimiterEls.push(delimiterEl);
    const contentContainer = createTag('div');
    contentContainer.append(...content);
    viewportContent[delimiter] = {
      contentContainer,
      classes: classes?.split(',').map((classStr) => classStr.trim()) ?? [],
    };
  });
  delimiterEls.forEach((delimiterEl) => delimiterEl.remove());
  if (!Object.keys(viewportContent).length) {
    return { default: { contentContainer: el } };
  }
  return viewportContent;
}

function decorateMultiViewport(el, viewportContent) {
  const viewportsMap = {
    'mobile-tablet-desktop': {
      mobile: '(width < 768px)',
      tablet: '(width >= 768px) and (width < 1024px)',
      desktop: '(width >= 1024px)',
    },
    'mobile-desktop': {
      mobile: '(width < 1024px)',
      desktop: '(width >= 1024px)',
    },
    'mobile-tablet': {
      mobile: '(width < 768px)',
      tablet: '(width >= 768px)',
    },
  };

  const viewportsPoints = viewportsMap[Object.keys(viewportContent).join('-')];
  if (!viewportsPoints) return;
  const allClasses = Object.values(viewportContent).flatMap(({ classes }) => classes ?? []);
  Object.entries(viewportContent).forEach(([viewport, value]) => {
    if (!viewportsPoints[viewport]) return;
    const { contentContainer, classes } = value;
    const contentChildren = [...contentContainer.children];
    const mq = window.matchMedia(viewportsPoints[viewport]);
    const setContent = () => {
      if (!mq.matches) return;
      el.classList.remove(...allClasses);
      el.classList.add(...classes);
      el.replaceChildren(...contentChildren);
    };
    setContent();
    mq.addEventListener('change', setContent);
  });
}

function decorate(container, el) {
  const blockName = el.classList[0].toLowerCase();
  const rows = container.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  const foregroundRow = rows[1];

  if (!firstRow) return;

  // First row: content (first div) + background (second div)
  const contentDiv = firstRow.querySelector(':scope > div:first-child');
  const backgroundDiv = firstRow.querySelector(':scope > div:last-child');
  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const prodIcon = contentDiv?.querySelector('img');
  const link = contentDiv?.querySelector('a');
  const heading = contentDiv?.querySelector(':is(h1, h2, h3, h4, h5, h6)');

  if (prodIcon) {
    prodIcon.closest('p').classList.add(`${blockName}-mnemonic`);
    if (isSvgUrl(prodIcon.src)) prodIcon.src = getFederatedUrl(prodIcon.src);
  }

  backgroundDiv?.classList.add(`${blockName}-background`);
  contentDiv?.classList.add(`${blockName}-content`);
  firstRow.classList.add(`${blockName}-container`);

  // Second row: foreground container
  getForegroundContent(foregroundRow, contentDiv, blockName);
  decorateBlockText(contentDiv, { heading: '4' });
  decorateTextOverrides(container, undefined, contentDiv);

  if (!link) return;
  const linkContainer = createTag('a', { class: `${blockName}-link-container`, href: link.href, 'data-tracking-label': heading?.textContent });
  link.remove();
  linkContainer.append(contentDiv);
  firstRow.prepend(linkContainer);
}

export default function init(el) {
  const viewportConfig = getViewportConfig(el);
  Object.values(viewportConfig).forEach(({ contentContainer }) => {
    decorate(contentContainer, el);
  });
  decorateMultiViewport(el, viewportConfig);
}
