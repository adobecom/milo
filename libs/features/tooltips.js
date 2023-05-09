import { loadStyle } from '../utils/utils.js';

function buildTooltip(text, tooltipText, options) {
  let classes = ['milo-tooltip'];
  ['top', 'right', 'bottom', 'left'].forEach(
    (x) => options.includes(x) && classes.push(x)
  );
  return `<span class="${classes.join(
    ' '
  )}" data-tooltip="${tooltipText}">${text}</span>`;
}

export async function replaceText(text, config, regex) {
  const { miloLibs, codeRoot } = config;

  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  let finalText = '';
  let ptr = 0;
  for (let match of matches) {
    finalText += text.substring(ptr, match.index);
    const options = match[3] ? match[4].split(',') : [];
    finalText += buildTooltip(match[1], match[2], options);
    ptr = match.index + match[0].length;
  }
  finalText += text.substring(ptr);

  loadStyle(`${miloLibs || codeRoot}/features/tooltips.css`);

  return finalText;
}
