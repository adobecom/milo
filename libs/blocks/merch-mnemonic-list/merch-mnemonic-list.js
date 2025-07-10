import { createTag } from '../../utils/utils.js';
import { loadMasComponent, MAS_MERCH_MNEMONIC_LIST, MAS_MERCH_CARD } from '../merch/merch.js';

const init = async (el) => {
  // Load merch components dynamically
  await Promise.all([
    loadMasComponent(MAS_MERCH_MNEMONIC_LIST),
    loadMasComponent(MAS_MERCH_CARD),
  ]);
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
