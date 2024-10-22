import chai, { expect } from '@esm-bundle/chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { getFragmentById } from '../src/getFragmentById.js';

chai.use(chaiAsPromised);

describe('getFragmentById', () => {
    it('throws an error if response is not ok', async () => {
        const promise = getFragmentById('http://localhost:2023', 'testid');
        await expect(promise).to.be.rejectedWith(
            'Failed to get fragment: 404 Not Found',
        );
    });
});
