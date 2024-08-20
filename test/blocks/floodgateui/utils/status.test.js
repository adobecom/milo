import { expect } from '@esm-bundle/chai';
import { statuses } from '../../../../libs/blocks/floodgateui/utils/state.js';
import { setStatus, setExcelStatus } from '../../../../libs/blocks/floodgateui/utils/status.js';

describe('View', () => {
  it('setStatus sets the status value without timeout', async () => {
    const name = 'name';
    const type = 'type';
    const text = 'text';
    const description = 'description';
    setStatus(name, type, text, description);
    expect(statuses.value.name.type).to.equal("type");
  });

  it('setStatus sets the status value with timeout. After timeout, the status disappears', async () => {
    const name = 'name';
    const type = 'type';
    const text = 'text';
    const timeout = true;
    const description = 'description';
    setStatus(name, type, text, description, timeout);
    expect(statuses.value.name.type).to.equal("type");
    await setExcelStatus('Found fragments');
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(statuses.value.name).to.not.exist;
  });
});
