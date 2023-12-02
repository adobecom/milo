import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/martech-attribute-metadata/martech-attribute-metadata.js');
const { getConfig, setConfig } = await import('../../../libs/utils/utils.js');
const origConfig = getConfig();
/* TODO: need to figure out how to spoof non us-EN cuz this isn't working */
origConfig.locale = { ietf: 'es-ES' };
setConfig(origConfig);

describe('martech-attribute-metadata', () => {
  it('updated config', () => {
    let config;
    const blocks = document.querySelectorAll('.martech-attribute-metadata');
    blocks.forEach((block) => {
      config = init(block);
    });
    expect(config?.analyticLocalization?.['Comprar Ahora']).to.equal('Buy now');
  });

  it('removes the block afterwards.', () => {
    const blockCheck = document.querySelectorAll('.martech-attribute-metadata');
    expect(blockCheck.length).to.equal(0);
  });
});
