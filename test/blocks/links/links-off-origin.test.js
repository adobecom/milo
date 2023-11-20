import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import linkHandlers from '../../../libs/features/links.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Off origin links', () => {
  it('Sets target correctly', async () => {
    await linkHandlers('/test/blocks/links/mocks/off-origin.json');
    const links = document.body.querySelectorAll('a');

    expect(links[0].getAttribute('target')).to.equal('_blank');
    expect(links[1].getAttribute('target')).to.equal(null);
    expect(links[2].getAttribute('target')).to.equal('_blank');
    expect(links[3].getAttribute('target')).to.equal('_blank');
  });
});
