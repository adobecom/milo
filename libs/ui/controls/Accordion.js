import { getConfig, loadStyle } from '../../utils/utils.js';
import { html, useState } from '../../deps/htm-preact.js';

const AccordionItem = ({ title, content, expand, onClick }) => {
  const isExpanded = expand ? 'is-expanded' : '';
  const buttonText = isExpanded ? 'Colapse' : 'Expand';
  return html`
    <div id="ai_${title.replace(' ', '_')}" class="accordion-item">
      <dt class="title ${isExpanded}" onClick=${onClick}>
        <span>${title}</span>
        <button aria-label=${buttonText}></button>
      </dt>
      <dd class="content ${isExpanded}">
        <div class="content-container">${content}</div>
      </dd>
    </div>
  `;
};

const getInitialState = (lskey, items) => {
  const lsState = localStorage.getItem(`milo-accordion-${lskey}`);
  if (lsState !== null) {
    return JSON.parse(lsState);
  }
  return [true];
};

export default function Accordion({ lskey = null, items = [], alwaysOpen = false }) {
  const { miloLibs, codeRoot } = getConfig();
  const [isToggled, setIsToggled] = useState(getInitialState(lskey, items));

  loadStyle(`${miloLibs || codeRoot}/ui/controls/accordion.css`);

  const toggle = (index) => {
    let t = [...isToggled];

    if (alwaysOpen) {
      t[index] = !isToggled[index];
    } else {
      t = Array(items.length).fill(false);
      if (!isToggled[index]) {
        t[index] = true;
      }
    }

    localStorage.setItem(`milo-accordion-${lskey}`, JSON.stringify(t));
    setIsToggled(t);
  };

  const accordionItems = items.map(
    (item, index) => html`
      <${AccordionItem}
        title=${item.title}
        content=${item.content}
        onClick=${() => toggle(index)}
        expand=${isToggled[index]}
      />
    `,
  );

  return html` <dl className="accordion">${accordionItems}</dl> `;
}
