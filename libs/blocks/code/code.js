import { loadStyle } from '../../utils/utils.js';

const HIGHLIGHT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js';
const HIGHLIGHT_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css';

export default async function init(el) {
  const language = [...el.classList].find((v) => v !== 'code');
  console.log(language)
  const codeEl = el.querySelector('pre code');
  console.log(codeEl);
  await loadStyle(HIGHLIGHT_CSS);
  const hljs = await import(HIGHLIGHT_JS);
  hljs.highlightElement(codeEl);
}
