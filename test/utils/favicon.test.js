import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, createTag, getMetadata } from '../../libs/utils/utils.js';
import loadFavIcons from '../../libs/utils/favicon.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Favicon', () => {
  it('sets all default favicon props', async () => {
    const config = setConfig({});
    const favicon = document.head.querySelector('link[rel="icon"]');
    loadFavIcons(createTag, config, getMetadata);
    expect(favicon.href).to.equal('http://localhost:2000/img/favicons/favicon.ico');
  });

  it('sets metadata favicon', async () => {
    const meta = createTag('meta', { name: 'favicon', content: 'otis' });
    document.head.append(meta);
    const config = setConfig({});
    const favicon = document.head.querySelector('link[rel="icon"]');
    loadFavIcons(createTag, config, getMetadata);
    expect(favicon.href).to.equal('http://localhost:2000/img/favicons/otis.ico');
  });
});
