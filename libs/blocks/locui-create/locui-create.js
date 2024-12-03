import { createTag } from '../../utils/utils.js';

export default function init(el) {
  el.classList.add('missing-details');
  const heading = createTag('h2', null, 'Missing project details');
  const paragraph = createTag('p', null, 'The project details were removed after you logged in. To resolve this:');
  const steps = createTag('ol', null);
  const goTo = createTag('p', { class: 'goto-step' }, 'Go to ');
  const goToAnchor = createTag('a', { href: 'https://milostudio.adobe.com', target: '_blank', rel: 'noopener noreferrer' }, 'MiloStudio');
  goTo.append(goToAnchor);
  goTo.append('.');
  const stepsList = ['Close this window or tab.', goTo, 'Select the specific tenant.', 'Click on Localization.', 'Click on "Add New Project".'];
  stepsList.forEach((step) => steps.append(createTag('li', null, step)));
  el.append(heading, paragraph, steps);
}
