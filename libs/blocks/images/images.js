import { createTag } from '../../utils/utils.js';

/**
* Initializes the image block by wrapping each picture element in a div with a class of "figure"
*@param {Element} blockEl - The block element to initialize.
*/
export default function init(blockEl) {
  const pictures = blockEl.querySelectorAll('picture')
  blockEl.innerHTML = '';

  if(!pictures.length) return 

  pictures.forEach(pic => {
    const figureEL = createTag('div', { class: 'figure' }, pic)
    blockEl.append(figureEL)
  });

  if(pictures.length > 1) {
    blockEl.classList.add('images-list', `images-list-${pictures.length}`)
  }
}
