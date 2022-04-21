import {
    html,
    useEffect,
    useState,
} from '../../libs/deps/htm-preact.js';

const Wtf = () => {
    const [a] = useState('weqrqwer');
    return html`<div>WTF ${a}</div>`;
}

export default Wtf;
