import { expect } from '@esm-bundle/chai';
import { debounce } from "../../libs/utils/action.js";


describe('Input', () => {
    it('Debounces callback correctly', async () => {
        const header = document.createElement('h2')
        header.setAttribute('id', 'debounce');
        const setValue = () => {
            header.textContent = 'debounced!';
        };

        debounce(setValue, 300)();

        expect(header.textContent).to.equal('');
        setTimeout(() => {
            expect(header.textContent).to.equal('');
        }, 100)
        setTimeout(() => {
            expect(header.textContent).to.equal('debounced!');
            header.remove();
        }, 300)
    });
});
