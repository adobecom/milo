import { createTag } from '../../utils/utils.js';

export default function decorate(block) {
  const container = block.closest('.section');
  const buttonText = block.querySelector('strong');
  const button = createTag('button', { class: 'button read-more-button', 'aria-expanded': 'false' });
  button.textContent = buttonText.textContent;
  buttonText.parentNode.replaceChild(button, buttonText);
  button.addEventListener('click', () => {
    container.classList.add('read-more-expanded');
    button.setAttribute('aria-expanded', 'true');
  });
}
