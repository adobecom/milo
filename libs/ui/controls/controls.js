import { loadStyle } from '../../../scripts/scripts.js';
import { html, useState } from '../../deps/htm-preact.js';

const AccordionItem = ({
  title, content, expand, onClick,
}) => {
  const isExpanded = expand ? 'is-expanded' : '';
  const buttonText = isExpanded ? 'Colapse' : 'Expand';
  return html`
    <div class=accordion-item>
        <dt class="title ${isExpanded}" onClick=${onClick}>
          <span>${title}</span>
          <button aria-label=${buttonText}></button>
        </dt>
        <dd class="content ${isExpanded}">
          <div class=content-container>${content}</div>
        </dd>
    </div>
  `;
};

const getInitialState = (key, items) => {
  const lsState = localStorage.getItem(`milo-accordion-${key}`);
  if (lsState !== null) {
    return JSON.parse(lsState);
  }
  return new Array(items.length).fill(true, 0, 1);
};

export function Accordion({ key = null, items = [] }) {
  loadStyle('/libs/ui/controls/controls.css');
  const [isToggled, setIsToggled] = useState(getInitialState(key, items));

  const toggle = (index) => {
    const t = [...isToggled];
    t[index] = !isToggled[index];
    localStorage.setItem(`milo-accordion-${key}`, JSON.stringify(t));
    setIsToggled(t);
  };

  const accordionItems = items.map((item, index) => html`
    <${AccordionItem}
        title="${item.title}"
        content="${item.content}"
        onClick=${() => toggle(index)}
        expand=${isToggled[index]}
    />
  `);

  return html` <dl className="accordion">${accordionItems}</dl> `;
}

export function Input({ label, onChange, id, type = 'text', value = {} }) {
  return html` <div class=field>
        <label for=${id}>${label}</label>
        <input type=${type} id=${id} name=${id} ...${value} onChange=${onChange} />
    </div>`;
}
