import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import nofollow from '../../../libs/features/links.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Nofollow', async () => {
  it('Returns undefined if no path provided', async () => {
    const imnull = await nofollow();
    expect(imnull).to.be.undefined;
  });

  it('Does not find links that are relative', async () => {
    await nofollow('/test/blocks/links/mocks/links.json');
    const links = document.body.querySelectorAll('a');
    expect(links[0].getAttribute('rel')).to.equal('nofollow noopener noreferrer');
    expect(links[1].getAttribute('rel')).to.equal(null);
  });

  it('Sets target correctly', async () => {
    await nofollow('/test/blocks/links/mocks/links.json');
    const links = document.body.querySelectorAll('a');
    expect(links[0].getAttribute('target')).to.equal('_blank');
    expect(links[1].getAttribute('target')).to.equal(null);
    expect(links[2].getAttribute('target')).to.equal(null);
  });
});
