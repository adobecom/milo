import { createTag } from '../../utils/utils.js';
import { loadMasDependencies } from '../merch/merch.js';

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('maslibs')) {
  await loadMasDependencies(['merch-mnemonic-list', 'merch-card']);
}

const init = async (el) => {
  const rows = el.querySelectorAll(':scope p:not([class])');
  if (rows.length < 1) return;
  [...rows].forEach((paragraph) => {
    const merchMnemonicList = createTag('merch-mnemonic-list');
    paragraph.setAttribute('slot', 'description');
    const picture = paragraph.querySelector('picture');
    const img = picture.querySelector('img');
    const icon = createTag('merch-icon', { slot: 'icon', size: 's', src: img.src });
    picture.remove();
    if (icon) merchMnemonicList.appendChild(icon);
    if (paragraph) merchMnemonicList.appendChild(paragraph);
    el.appendChild(merchMnemonicList);
  });
};

export default init;
