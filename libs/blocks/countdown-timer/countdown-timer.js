import { createTag } from '../../utils/utils.js';
import '../../deps/mas/countdown-timer.js';

export default function init(el) {
  const styles = [...el.classList];
  const firstLevelDivs = el.querySelectorAll(':scope > div');

  // Extract 'DAYS HOURS MINS' from the first div's first child
  const daysHoursMins = firstLevelDivs[0].querySelector(':scope > div').textContent.trim();

  // Extract 'ENDS IN' from the first div's second child
  const cdtLabel = firstLevelDivs[0].querySelector(':scope > div:nth-child(2)').textContent.trim();

  // Extract the time ranges from the second and third divs
  const timeRanges = Array.from(firstLevelDivs)
    .slice(1) // Skip the first div, as it's not part of the time ranges
    .flatMap((div) => Array.from(div.querySelectorAll(':scope > div')).map((innerDiv) => Date.parse(innerDiv.textContent.trim()))) // Extract the text content of each inner div
    .join(','); // Join the array into a comma-separated string

  const cdt = createTag('countdown-timer', { class: styles.join(' ') });
  cdt.setAttribute('label', cdtLabel);
  cdt.setAttribute('daysHoursMins', daysHoursMins);
  cdt.setAttribute('timeRanges', timeRanges);
  el.replaceWith(cdt);
}
