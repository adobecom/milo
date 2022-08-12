/* global describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { loadTemplate } from '../../libs/utils/utils.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Template', () => {
  it('loads a template script and style', async () => {
    const meta = document.createElement('meta');
    meta.name = 'template';
    meta.content = 'Template Sidebar';
    document.head.append(meta);
    await loadTemplate();
    const hasTemplateSidebar = document.querySelector('body.template-sidebar');
    expect(hasTemplateSidebar).to.exist;
  });
});
