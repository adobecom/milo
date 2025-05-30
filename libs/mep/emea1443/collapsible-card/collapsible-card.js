import { addTempWrapperDeprecated } from '../express-libs/utils.js';
import { fetchRelevantRows } from '../express-libs/utils/relevant.js';
import { createTag } from '../../../utils/utils.js';

// make change
function toggleCollapsibleCard($block) {
  $block.classList.toggle('expanded');
  $block.classList.remove('initial-expansion');
}

function setClasses($block) {
  const $divs = $block.querySelectorAll(':scope > div');
  $divs[0].classList.add('image');
  $divs[1].classList.add('header');
  $divs[2].classList.add('subcopy');
}
function decorateBackground($block) {
  const $divs = $block.querySelectorAll(':scope > div');
  const firstDivContent = $divs[0].textContent.trim();

  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(firstDivContent)) {
    $block.style.backgroundColor = firstDivContent;
    $divs[0].remove();
  }
}

function decorateToggleButton($block) {
  const $toggleButton = createTag('div', { class: 'toggle-button' });
  $toggleButton.insertAdjacentHTML('afterBegin', '<img class="icon icon-plus" src="https://main--cc--adobecom.aem.page/cc-shared/fragments/tests/emea-latam/2025/q2/emea1443/assets/card-plus.svg" alt="plus">');
  $block.prepend($toggleButton);

  $toggleButton.addEventListener('click', () => {
    toggleCollapsibleCard($block);
  });
}

export default async function decorate($block) {
  addTempWrapperDeprecated($block, 'collapsible-card');

  if ($block.classList.contains('spreadsheet-powered')) {
    const relevantRowsData = await fetchRelevantRows(window.location.pathname);

    if (relevantRowsData && (!relevantRowsData.collapsibleCard || relevantRowsData.collapsibleCard !== 'Y')) {
      $block.remove();
    }
  }

  decorateBackground($block);
  setClasses($block);
  decorateToggleButton($block);
}
