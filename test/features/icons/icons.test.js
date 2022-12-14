import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const { default: loadIcons } = await import('../../../libs/features/icons.js');

const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Icon Suppprt', () => {
  it('Replaces span.icon', async () => {
    const domIcons = document.querySelectorAll('span.icon');
    if (domIcons.length === 0) return;
    await loadIcons(domIcons, config);
    const selector = domIcons[0].querySelector(':scope svg');
    expect(selector).to.exist;
  });
});
