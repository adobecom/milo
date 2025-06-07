import { addTempWrapperDeprecated } from '../express-libs/utils.js';
import { fetchRelevantRows } from '../express-libs/relevant.js';
import { createTag } from '../../../utils/utils.js';

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

function setAnalyticsOpen(btn) {
  const analyticsValue = btn.getAttribute('daa-ll');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('daa-ll', analyticsValue.replace(/closed/, 'open'));
}

function setAnalyticsClosed(btn) {
  const analyticsValue = btn.getAttribute('daa-ll');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('daa-ll', analyticsValue.replace(/open/, 'closed'));
}

async function decorateToggleButton($block) {
  const $toggleButton = createTag('a', { class: 'toggle-button' });
  $toggleButton.setAttribute('daa-ll', 'collapsible-card-closed');

  // Add icon
  const { iconMinusSVG, iconPlusSVG } = await import('./img/collapsible-icon.js');
  const collapsibleIcon = createTag('picture', { class: 'icon' }, iconPlusSVG);
  $toggleButton.appendChild(collapsibleIcon);
  $block.prepend($toggleButton);

  $toggleButton.addEventListener('click', () => {
    $block.classList.remove('initial-expansion');
    $block.classList.toggle('expanded');
    const expanded = $toggleButton.classList.toggle('expanded');
    collapsibleIcon.innerHTML = expanded ? iconMinusSVG : iconPlusSVG;
    if ($toggleButton.classList.contains('expanded')) {
      setAnalyticsOpen($toggleButton);
    } else {
      setAnalyticsClosed($toggleButton);
    }
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
