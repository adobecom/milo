import { createTag } from '../../utils/utils.js';

export default (block) => {
  const content = createTag('div', {class: 'locale-flow-form'});
  content.textContent = "The locale flow form goes here. We'll take this information and send it off to the localization service"
}; 
