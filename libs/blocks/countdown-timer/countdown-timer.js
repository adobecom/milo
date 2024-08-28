/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {createTag} from '../../utils/utils.js';

export default function init(el) {
  const styles = [...el.classList]; 
  const firstLevelDivs = el.querySelectorAll(':scope > div');

  // Extract 'DAYS HOURS MINS' from the first div's first child
  const daysHoursMins = firstLevelDivs[0].querySelector(':scope > div').textContent.trim();

  // Extract 'ENDS IN' from the first div's second child
  const cdtLabel = firstLevelDivs[0].querySelector(':scope > div:nth-child(2)').textContent.trim();

  // Extract the time ranges from the second and third divs
  const timeRanges = Array.from(firstLevelDivs)
    .slice(1)  // Skip the first div, as it's not part of the time ranges
    .flatMap(div => Array.from(div.querySelectorAll(':scope > div')).map(innerDiv => innerDiv.textContent.trim()))
    .join(', ');  // Join the array into a comma-separated string

  const cdt = createTag('countdown-timer', { class: styles.join(' ')});
  cdt.setAttribute('label', cdtLabel);
  cdt.setAttribute('daysHoursMins', daysHoursMins);
  cdt.setAttribute('timeRanges', timeRanges);
  el.replaceWith(cdt);
}
