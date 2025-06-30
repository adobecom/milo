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
  }, `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
        <defs>
          <style>
            .fill {
              fill: #464646;
            }
          </style>
        </defs>
        <title>Copy</title>
        <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18"/><rect class="fill" height="1" rx="0.25" width="1" x="16" y="11"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="16" y="9"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="16" y="7"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="16" y="5"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="16" y="3"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="16" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="14" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="12" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="10" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="8" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="1"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="3"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="5"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="7"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="9"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="6" y="11"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="8" y="11"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="10" y="11"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="12" y="11"/>
        <rect class="fill" height="1" rx="0.25" width="1" x="14" y="11"/>
        <path class="fill" d="M5,6H1.5a.5.5,0,0,0-.5.5v10a.5.5,0,0,0,.5.5h10a.5.5,0,0,0,.5-.5V13H5.5a.5.5,0,0,1-.5-.5Z"/>
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
