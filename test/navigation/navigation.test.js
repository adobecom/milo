import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import loadBlock from '../../libs/navigation/navigation.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Navigation component', async () => {
  it('Renders the footer block', async () => {
    await loadBlock({ authoringPath: '/federal/dev', footer: { privacyId: '12343' }, env: 'qa' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });

  it('Renders the header block', async () => {
    await loadBlock({ authoringPath: '/federal/dev', header: { imsClientId: 'fedsmilo' }, env: 'qa' }, 'http://localhost:2000');
    const el = document.getElementsByTagName('header');
    expect(el).to.exist;
  });

  it('Does not render either header or footer if not found in configs', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadBlock({ authoringPath: '/federal/dev', env: 'qa' }, 'http://localhost:2000');
    const header = document.getElementsByTagName('header');
    const footer = document.getElementsByTagName('footer');
    expect(header).to.be.empty;
    expect(footer).to.be.empty;
  });
});
