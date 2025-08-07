import { expect } from './utilities.js';

const { paramsToHash, historyPushState } = await import('../src/utils.js');

describe('function "paramsToHash"', () => {
    it('Transfer query params to hash', () => {
        historyPushState('filter=photo&single_app=illustrator');
        paramsToHash(['filter', 'single_app']);
        expect(window.location.hash).to.equal('#filter=photo&single_app=illustrator');
    });

    it('Update existing hash from query params', () => {
        historyPushState('filter=3D&single_app=animate');
        paramsToHash(['filter', 'single_app']);
        expect(window.location.hash).to.equal('#filter=3D&single_app=animate');
    });
});
