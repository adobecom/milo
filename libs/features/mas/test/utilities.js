import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { expect, use } from '@esm-bundle/chai';
import sinon from 'sinon';
import priceLiteralsJson from '../price-literals.json' with { type: 'json' };
import { equalsCaseInsensitive } from '@dexter/tacocat-core';

const TAG_NAME_SERVICE = 'mas-commerce-service';

use(chaiAsPromised);
window.masPriceLiterals = priceLiteralsJson.data;

use((chai) => {
    const parser = new DOMParser();
    const root = document.createElement('div');
    function normalise(val) {
        root.innerHTML = parser.parseFromString(val, 'text/html');
        return root.innerHTML
            .trim()
            .replace(/>\s*</g, '><')
            .replace(/>\s*/g, '>')
            .replace(/\s*</g, '<')
            .replace(/"\s*>/g, '">')
            .replace(/"\s*\/>/g, '/>')
            .replace(/\s+/g, ' ');
    }

    chai.Assertion.addMethod('html', function assertHtml(snapshot) {
        const normAct = normalise(this._obj);
        const normExp = normalise(snapshot);
        this.assert(
            equalsCaseInsensitive(normAct, normExp),
            'expected to match html snapshot',
            'expected not to match html snapshot',
            normAct,
            normExp,
        );
    });
});

const initMasCommerceService = (attributes, checkoutAction) => {
    const el = document.createElement(TAG_NAME_SERVICE);
    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            el.setAttribute(key, attributes[key]);
        });
    }
    if (checkoutAction) {
        el.registerCheckoutAction(checkoutAction);
    }
    document.head.appendChild(el);
    return el;
};

const removeMasCommerceService = () => {
    document.querySelector(TAG_NAME_SERVICE)?.remove();
};

export { expect, sinon, initMasCommerceService, removeMasCommerceService };
