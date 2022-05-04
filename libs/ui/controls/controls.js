import { loadStyle } from '../../utils/utils.js';
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
  return new Array(items.length).fill(true, 0, 1);
};

export function Accordion({ lskey = null, items = [], alwaysOpen = false }) {
  loadStyle('/libs/ui/controls/controls.css');
  const [isToggled, setIsToggled] = useState(getInitialState(lskey, items));

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

export function Input({ label = '', onChange, id, type = 'text', value: val = {} }) {
  const value = typeof val === 'string' ? { value: val } : val;

  return html` <div class="field">
    ${label && html`<label for=${id}>${label}</label>`}
    <input type=${type} id=${id} name=${id} ...${value} onChange=${onChange} />
  </div>`;
}
