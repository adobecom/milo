import { createTag } from '../../utils/utils.js';

/**
 * @param {string} ostLink
 * @param {HTMLElement} cta
 * @returns {HTMLElement} wrapper with copy to clipboard button
 */
function addCopyToClipboard(ostLink, cta) {
  if (!ostLink || !cta) return cta;

  const button = createTag('button', {
    style: 'background: none; border: none; padding: 0; cursor: pointer;',
    title: 'Copy',
  }, `<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" id="S_AddTo_22_N" viewBox="0 0 22 22">
      <defs>
        <style>
          .fill {
            fill: #464646;
          }
        </style>
      </defs>
      <rect id="Canvas" fill="#ff13dc" opacity="0" width="22" height="22" />
      <path class="fill" d="M19,8H14V3a.5.5,0,0,0-.5-.5H3a.5.5,0,0,0-.5.5V13.5A.5.5,0,0,0,3,14H8v5a.5.5,0,0,0,.5.5H19a.5.5,0,0,0,.5-.5V8.5A.5.5,0,0,0,19,8Z" />
    </svg>`);

  button.addEventListener('click', () => {
    const url = new URL(ostLink);
    const html = `<a href="${ostLink}" title="Special Link">CTA {{${url.searchParams.get('text')}}}</a>`;
    const clipboardItem = new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) });
    navigator.clipboard.write([clipboardItem]);
  });

  const wrapper = createTag('div', { class: 'copy-cta-wrapper' });
  wrapper.appendChild(button);
  wrapper.appendChild(cta);
  wrapper.style.display = 'flex';
  wrapper.style.gap = '14px';
  return wrapper;
}

export default addCopyToClipboard;
