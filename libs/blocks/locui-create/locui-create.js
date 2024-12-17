import { createTag } from '../../utils/utils.js';

function makeGotoSteps(link, linkText) {
  const goTo = createTag('p', null, 'Access the ');
  const goToAnchor = createTag('a', { href: link, target: '_blank', rel: 'noopener noreferrer' }, linkText);
  goTo.append(goToAnchor);
  goTo.append('.');
  return goTo;
}

export default function init(el) {
  el.classList.add('missing-details');
  const heading = createTag('h2', null, 'Missing project details');
  const paragraph = createTag('p', null, 'The project details were removed after you logged in. To resolve this:');
  const steps = createTag('ol', null);
  const gotoSteps = createTag('ol', null);
  const gotoURls = [{ link: 'https://milostudio.adobe.com', linkText: 'MiloStudio Production environment' }, { link: 'https://milostudio.stage.adobe.com', linkText: 'MiloStudio Staging environment' }, { link: 'https://milostudio.dev.adobe.com', linkText: 'MiloStudio Development environment' }];
  const goToContainer = createTag('div', { class: 'goto-step' });
  gotoURls.forEach((gotoUrl) => gotoSteps.append(createTag('li', null, makeGotoSteps(gotoUrl.link, gotoUrl.linkText))));
  goToContainer.append(createTag('p', null, 'Please navigate to the respective MiloStudio environments:'));
  goToContainer.append(gotoSteps);
  const stepsList = ['Close this window or tab.', goToContainer, 'Select the specific tenant.', 'Click on Localization.', 'Click on "Add New Project".'];
  stepsList.forEach((step) => steps.append(createTag('li', null, step)));
  el.append(heading, paragraph, steps);
}
