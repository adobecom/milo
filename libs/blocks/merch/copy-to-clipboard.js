import { createTag } from '../../utils/utils.js';

/**
 * @param {string} ostLink
 * @param {HTMLElement} cta
 * @returns {HTMLElement} wrapper with copy to clipboard button
 */
function addCopyToClipboard(ostLink, cta) {
  if (!ostLink || !cta) return cta;
  const copyToClipboard = `<button onclick="navigator.clipboard.writeText('${ostLink}')" style="background: none; border: none; padding: 0; cursor: pointer;">
    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" id="S_AddTo_22_N" viewBox="0 0 22 22">
      <defs>
        <style>
          .fill {
            fill: #464646;
          }
        </style>
      </defs>
      <rect id="Canvas" fill="#ff13dc" opacity="0" width="22" height="22" />
      <path class="fill" d="M19,8H14V3a.5.5,0,0,0-.5-.5H3a.5.5,0,0,0-.5.5V13.5A.5.5,0,0,0,3,14H8v5a.5.5,0,0,0,.5.5H19a.5.5,0,0,0,.5-.5V8.5A.5.5,0,0,0,19,8Z" />
    </svg>
  </button>
  ${cta.outerHTML}`;
  const wrapper = createTag('div', { class: 'copy-cta-wrapper' }, copyToClipboard);
  wrapper.style.display = 'flex';
  wrapper.style.gap = '14px';
  return wrapper;
}

export default addCopyToClipboard;
