import { createTag } from '../../utils/utils.js';

export default async function init(block) {
  block.innerHTML = '';
  block.append(
    createTag('div', { class: 'dashboard-header' }),
    createTag('div', { class: 'dashboard-grid' }),
  );
}
