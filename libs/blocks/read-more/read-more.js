import { createTag } from '../../utils/utils.js';

export default function decorate(block) {
  const container = block.closest('.section');
  const buttonText = block.querySelector('strong');
  const button = createTag('button', { class: 'button con-button filled blue', 'aria-expanded': 'false' });
  button.textContent = buttonText.textContent;
  buttonText.parentNode.replaceChild(button, buttonText);

  const recommendedBlock = container.querySelector('.recommended-articles');
  if (recommendedBlock) {
    recommendedBlock.style.paddingTop = '70px';
  } else {
    container.style.paddingBottom = '70px';
  }

  button.addEventListener('click', () => {
    container.classList.add('read-more-expanded');
    button.setAttribute('aria-expanded', 'true');
  });
}
