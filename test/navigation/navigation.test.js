import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import loadBlock from '../../libs/navigation/navigation.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Navigation component', async () => {
  it('Renders the footer block', async () => {
    await loadBlock({ footer: { authoringPath: '/federal/home' }, env: 'qa' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });
});
