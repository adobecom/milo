import { debounce } from './utils';

export default class MerchGradient extends HTMLElement {
    static get observedAttributes() {
        return ['colors', 'positions', 'angle', 'border-radius'];
    }

    #angle = '';
    #borderRadius = undefined;
    #colors = [];
    #positions = [];
    #updateParentBackground;

    constructor() {
        super();
        this.#updateParentBackground = debounce(() => {
            if (!this.isConnected) return;
            this.parentElement.style.background = this.value;
            if (this.#borderRadius) {
                this.parentElement.style.borderRadius = this.#borderRadius;
            } else if (this.#borderRadius === '') {
                this.parentElement.style.borderRadius = '';
            }
        }, 1);
    }

    get value() {
        const stops = this.#colors
            .map((color, index) => {
                const position = this.#positions[index] || '';
                return `${color} ${position}`;
            })
            .join(', ');

        return `linear-gradient(${this.#angle}, ${stops})`;
    }

    connectedCallback() {
        this.#updateParentBackground();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'border-radius') {
            this.#borderRadius = newValue?.trim();
        }
        if (name === 'colors' && newValue) {
            this.#colors =
                newValue?.split(',').map((color) => color.trim()) ?? [];
        } else if (name === 'positions' && newValue) {
            this.#positions =
                newValue?.split(',').map((position) => position.trim()) ?? [];
        } else if (name === 'angle') {
            this.#angle = newValue?.trim() ?? '';
        }
        this.#updateParentBackground();
    }
}

customElements.define('merch-gradient', MerchGradient);
