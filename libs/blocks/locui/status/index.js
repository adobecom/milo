import { html } from '../../../deps/htm-preact.js';

const errorLink = 'https://milo.adobe.com/docs/authoring/localization#:~:text=at%20render%20time.-,Troubleshooting,-Error%20matrix';

export default function errorLinks(desc, type) {
  const linkPattern = /\[(.*?)\]\((.*?)\)/g;
  const link = linkPattern.exec(desc);
  if (link) {
    const msg = desc.replace(linkPattern, '');
    const [text, href] = link.slice(1);
    return html`
      <span>
        ${msg.substring(0, link.index)}
        <a href="${href}" target="_blank">${text}</a>
        ${msg.substring(link.index, msg.length)} 
      </span>`;
  }
  return type === 'error'
    ? html`${desc} <a href="${errorLink}" target="_blank">more details</a>`
    : desc;
}
