import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: getNav } = await import('../../../libs/blocks/milonav/milonav.js');

describe('Header', () => {
  it('Doesnt load a 404 nav', async () => {
    const nav = document.querySelector('nav');
    expect(nav).to.be.null;
  });

  it('Loads a nav', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    const header = document.querySelector('header');
    await getNav(header);
    const nav = document.querySelector('nav');
    expect(nav).to.exist;
  });
});
