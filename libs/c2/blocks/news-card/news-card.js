import { decorateBlockText } from '../../../utils/decorate.js';

export default function init(el) {
  el.closest('.section').classList.add('news-card-section');
  decorateBlockText(el);
}
