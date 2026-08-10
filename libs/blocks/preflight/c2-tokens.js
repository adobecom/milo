import { loadStyle } from '../../utils/utils.js';

// c2 (--s2a-*) tokens are only defined on c2 pages; preflight runs on every Milo page, so load
// them at :root — both the modal and the page-injected overlays resolve their colors from here.
const C2_TOKENS = ['tokens.primitives.css', 'tokens.primitives.light.css', 'tokens.semantic.light.css'];

export default function loadC2Tokens(base) {
  return Promise.all(C2_TOKENS.map((file) => new Promise((res) => {
    loadStyle(`${base}/c2/styles/deps/${file}`, res);
  })));
}
