import { expect } from '@esm-bundle/chai';
import getUuid from '../../libs/utils/getUuid.js';
import { isValidUuid } from '../../libs/blocks/caas-config/caas-config.js';

const LONG_STRING = 'go milo'.repeat(2000);
describe('Get a UUID from a string', () => {
  it('should generate valid UUIDs', async () => {
    const uuid1 = await getUuid('hello world');
    expect(uuid1).to.equal('2aae6c35-c94f-5fb4-95db-e95f408b9ce9');
    expect(isValidUuid(uuid1)).to.equal(true);

    const uuid2 = await getUuid('The quick brown fox jumps over the lazy dog');
    expect(uuid2).to.equal('2fd4e1c6-7a2d-58fc-ad84-9ee1bb76e739');
    expect(isValidUuid(uuid2)).to.equal(true);
  });

  it('should generate valid UUIDs for a very long string', async () => {
    const uuid1 = await getUuid(LONG_STRING);
    expect(uuid1).to.equal('83d82a68-f13a-508b-a43a-828f2b2448d9');
    expect(isValidUuid(uuid1)).to.equal(true);
  });

  it('should generate valid UUIDs for a very long string with extra char', async () => {
    // eslint-disable-next-line prefer-template
    const uuid1 = await getUuid(LONG_STRING + 'x');
    expect(uuid1).to.equal('9322e891-76b8-5c0f-b69e-01addc7d1114');
    expect(isValidUuid(uuid1)).to.equal(true);
  });

  it('should generate valid UUIDs for single char', async () => {
    const uuid1 = await getUuid('0');
    expect(uuid1).to.equal('b6589fc6-ab0d-582c-b120-99d1c2d40ab9');
    expect(isValidUuid(uuid1)).to.equal(true);

    const uuid2 = await getUuid('1');
    expect(uuid2).to.equal('356a192b-7913-504c-9457-4d18c28d46e6');
    expect(isValidUuid(uuid2)).to.equal(true);
  });
});
