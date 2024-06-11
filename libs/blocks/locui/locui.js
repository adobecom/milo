import { createTag } from '../../utils/utils.js';

export default function init(el) {
  el.classList.add('container');
  const heading = createTag('h2', null, 'Missing project details');
  const paragraph = createTag('p', null, 'The project details were removed after you logged in. To resolve this:');
  const steps = createTag('ol', null);
  const stepList = ['Close this window or tab.', 'Open your project Excel file.', 'Click "Localize..." in Sidekick again.'];
  stepList.forEach((step) => steps.append(createTag('li', null, step)));
  const learnmore = createTag('a', {
    class: 'con-button',
    href: 'https://milo.adobe.com/docs/authoring/localization#:~:text=at%20render%20time.-,Troubleshooting,-Error%20matrix',
    target: '_blank',
  }, 'Learn More');
  el.append(heading, paragraph, steps, learnmore);
}
