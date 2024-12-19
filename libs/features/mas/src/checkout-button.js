import { CheckoutMixin, createCheckoutElement } from './checkout-mixin.js';

export class CheckoutButton extends CheckoutMixin(HTMLButtonElement) {
    static is = 'checkout-button';
    static tag = 'button';

    #href;

    static createCheckoutButton(options = {}, innerHTML = '') {
        return createCheckoutElement(CheckoutButton, options, innerHTML);
    }

    setCheckoutUrl(value) {
        this.#href = value;
    }

    get href() {
        return this.#href;
    }

    get isCheckoutButton() {
        return true;
    }

    clickHandler(e) {
        if (this.checkoutActionHandler) {
            this.checkoutActionHandler?.(e);
            return;
        }
        if (this.#href) {
            window.location.href = this.#href;
        }
    }
}

// Define custom DOM element
if (!window.customElements.get(CheckoutButton.is)) {
    window.customElements.define(CheckoutButton.is, CheckoutButton, {
        extends: CheckoutButton.tag,
    });
}
