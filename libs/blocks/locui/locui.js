import { createTag } from '../../utils/utils.js';

export default function init(el) {
  el.classList.add('container');
  const heading = createTag('h2', null, 'Missing project details');
  const text = createTag('p', null, 'After authentication, unfortunately the project details were cleared upon redirect. To get back to your project, please return to the excel and run the project again.');
  const learnmore = createTag('a', {
    class: 'con-button',
    href: 'https://milo.adobe.com/docs/authoring/localization#:~:text=at%20render%20time.-,Troubleshooting,-Error%20matrix',
    target: '_blank',
  }, 'Learn More');
  el.append(heading, text, learnmore);
}
