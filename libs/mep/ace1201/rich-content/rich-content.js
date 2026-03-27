import { decorateBlockText, decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function hangOpeningQuote(header) {
  if (!header) return;
  const openingQuotes = /^(\p{Pi})/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el) {
  decorateBlockText(el);
  const firstText = el?.querySelector('h1, h2, h3, h4, h5, h6, p');
  hangOpeningQuote(firstText);
}

function promoteParagraphTitle(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `title-${headingSize}`);
}

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphTitle(content);
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
  const allClasses = Object.values(viewportContent)?.flatMap(({ classes }) => classes ?? []);
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

function addMissingContent(con, previous) {
  if (!previous) return;

  const [foreground, media] = con;
  const [content, background] = foreground.children;
  const [prevForeground, prevMedia] = previous.contentContainer.children;
  const [prevContent, prevBackground] = prevForeground.children;

  const pairs = [
    [media, prevMedia],
    [content, prevContent],
    [background, prevBackground],
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
  const suffix = '-viewport';
  delimiters.forEach((delimiter, index) => {
    const delimiterIndex = children
      .findIndex((child) => child.textContent.trim().toLowerCase().startsWith(delimiter + suffix));
    if (delimiterIndex < 0) return;
    const nextDelimiterIndex = children
      .findIndex((child) => child.textContent
        .trim().toLowerCase().startsWith(delimiters[index + 1] + suffix));
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
      classes: classes?.split(',').map((c) => c.trim()) ?? [],
    };
  });
  delimiterEls.forEach((delimiterEl) => delimiterEl.remove());
  if (!Object.keys(viewportContent).length) {
    return { default: { contentContainer: el } };
  }
  return viewportContent;
}

export default function init(el) {
  const viewPortConfig = getViewportConfig(el);
  Object.values(viewPortConfig).forEach((value) => {
    const { contentContainer } = value;
    decorate(contentContainer);
  });
  decorateMultiViewport(el, viewPortConfig);
  decorateTextOverrides(el);
}
