import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  standard: {
    small: ['s', 's', 's'],
    medium: ['m', 'm', 'm'],
    large: ['l', 'l', 'l'],
    xlarge: ['xl', 'xl', 'xl'],
  },
  inset: {
    small: ['s', 'm'],
    medium: ['m', 'l'],
    large: ['l', 'xl'],
    xlarge: ['xl', 'xxl'],
  },
  text: {
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

function findElementWithClassStartingOrEndingWith(element, searchString) {
  var classes = element.classList;
  var foundClass = "";
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].startsWith(searchString) || classes[i].endsWith(searchString)) {
      foundClass = classes[i];
      break;
    }
  }
  if (foundClass) {
    var parts = foundClass.split("-");
    var newStr = parts[1] + "-" + parts[0];
    return { element: element, class: foundClass, newStr: newStr };
  } else {
    return null;
  }
}

function replaceClassName(el, str) {
  const foundEl = findElementWithClassStartingOrEndingWith(el, str);
  if (foundEl) {
    const findClass = str.slice(1) + str[0];
    const els = foundEl.element.querySelectorAll(`[class^="${findClass}"]`);
    if (!els) return;
    [...els].forEach( (e, i) => {
      for (let i = 0; i < e.classList.length; i++) {
        const className = e.classList[i];
        if (className.startsWith(findClass)) {
          e.classList.replace(className, foundEl.newStr);
        }
      }
    });
  };
}

async function applyOverrides(el) {
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((str, i) => {
    replaceClassName(el, str);
  });
}

export default async function init(el) {
  el.classList.add('text-block', 'con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  const helperClasses = [];
  let blockType = 'text';
  const size = getBlockSize(el);
  const longFormVariants = ['inset', 'long-form', 'bio'];
  longFormVariants.forEach((variant, index) => {
    if (el.classList.contains(variant)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (index > 0) ? 'standard' : variant;
    }
  });
  const config = blockTypeSizes[blockType][size];
  await decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  el.classList.add(...helperClasses);
  await applyOverrides(el);
}
