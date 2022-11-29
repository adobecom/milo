import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/quote/quote.js');
const quotes = document.querySelectorAll('.quote');

/* eslint-disable-next-line no-restricted-syntax */
for await (const quote of quotes) {
  await init(quote);
}

describe('Blockquote', () => {
  it('Renders as a blockquote element', async () => {
    const quote = quotes[0].querySelector('blockquote');
    expect(quote).to.exist;
  });
});
