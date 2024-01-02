import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/martech-metadata/martech-metadata.js');
const { setConfig } = await import('../../../libs/utils/utils.js');

describe('martech-attribute-metadata', () => {
  it('updated config', () => {
    let config;
    const origConfig = {
      pathname: '/es/my-test',
      locales: { es: { ietf: 'es-ES', tk: 'hah7vzn.css' } },
      locale: { ietf: 'es-ES' },
    };
    setConfig(origConfig);
    const blocks = document.querySelectorAll('.martech-metadata');
    blocks.forEach((block) => {
      config = init(block);
    });
    expect(config?.analyticLocalization?.['Comprar Ahora']).to.equal('Buy now');
  });

  it('removes the block afterwards.', () => {
    const blockCheck = document.querySelectorAll('.martech-metadata');
    expect(blockCheck.length).to.equal(0);
  });
});
