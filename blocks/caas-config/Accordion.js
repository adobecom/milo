import { html, useState } from './htm-preact.js';

const LS_KEY = 'CAAS_ACCORDION_STATE';

const AccordionItem = ({ title, content, expand, onClick }) => {
    const isExpanded = expand ? 'is-expanded' : '';
    return html`
        <div>
            <dt class="title ${isExpanded}" onClick=${onClick}>${title}</dt>
            <dd class="content ${isExpanded}">${content}</dd>
        </div>
    `;
};

const getInitialState = (items) => {
    const lsState = localStorage.getItem(LS_KEY);
    if (lsState !== null) {
        return JSON.parse(lsState);
    }
    return new Array(items.length).fill(true, 0, 1);
}

const Accordion = ({ items = [] }) => {
    const [isToggled, setIsToggled] = useState(getInitialState(items));

    const toggle = (index) => {
        const t = [...isToggled];
        t[index] = !isToggled[index];
        localStorage.setItem(LS_KEY, JSON.stringify(t));
        setIsToggled(t);
    };

    const accordionItems = items.map((item, index) => {
        return html`
            <${AccordionItem}
                title="${item.title}"
                content="${item.content}"
                onClick=${() => toggle(index)}
                expand=${isToggled[index]}
            />
        `;
    });

    return html` <dl className="accordion">${accordionItems}</dl> `;
};

export default Accordion;
