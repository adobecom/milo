import { decorateButtons } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function hangOpeningQuote(header) {
  const openingQuotes = /^(\p{Pi})/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el, config = ['lg', 'l']) {
  const headings = el?.querySelectorAll('h1, h2, h3, h4, h5, h6');

  hangOpeningQuote(headings[0]);

  const prevSib = headings[0]?.previousElementSibling;
  prevSib?.classList.add('eyebrow');

  const body = `body-${config[0]}`;
  const bodyEls = el?.querySelectorAll('p:not([class])') || [];
  bodyEls.forEach((bodyEl) => bodyEl.classList.add(body));
  decorateButtons(el, config[1] && `button-${config[1]}`);
}

const blockSizes = {
  medium: 'md',
  large: 'lg',
};

function getBlockSize(block) {
  const defaultSize = 'large';
  const size = Object.keys(blockSizes).find((key) => block.classList.contains(key));
  return blockSizes[size] ?? blockSizes[defaultSize];
}

function getButtonSize(block) {
  return [...block.classList].find((c) => c.includes('button'))?.split('-').pop();
}

function decorate(el, block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  const blockSize = getBlockSize(el);
  const buttonSize = getButtonSize(el);
  decorateText(content, [blockSize, buttonSize]);
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
  delimiters.forEach((delimiter, index) => {
    const delimiterIndex = children
      .findIndex((child) => child.textContent.toLowerCase().includes(delimiter));
    if (delimiterIndex < 0) return;
    const nextDelimiterIndex = children
      .findIndex((child) => child.textContent.toLowerCase().includes(delimiters[index + 1]));
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
    decorate(el, contentContainer);
  });
  decorateMultiViewport(el, viewPortConfig);
}
