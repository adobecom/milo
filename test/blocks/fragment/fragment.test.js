import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';

window.lana = { log: stub() };

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: getFragment } = await import('../../../libs/blocks/fragment/fragment.js');

describe('Fragments', () => {
  // beforeEach(() => {
  //   sinon.spy(lana, 'log');
  // });

  // afterEach(() => {
  //   lana.log.restore();
  // });

  it('Loads a fragment', async () => {
    const a = document.querySelector('a');
    await getFragment(a);
    const h1 = document.querySelector('h1');
    expect(h1).to.exist;
  });

  it('Doesnt load a fragment', async () => {
    const a = document.querySelector('a.bad');
    await getFragment(a);
    expect(window.lana.log.args[0][0]).to.equal('Could not get fragment: http://localhost:2000/test/blocks/fragment/mocks/fragments/bad.plain.html');
  });

  it('Doesnt create a malformed fragment', async () => {
    const a = document.querySelector('a.malformed');
    await getFragment(a);
    console.log(window.lana.log.args);
    expect(window.lana.log.args[1][0]).to.equal('Could not make fragment: http://localhost:2000/test/blocks/fragment/mocks/fragments/malform.plain.html');
  });

  it('Doesnt infinitely load circular references', async () => {
    const a = document.querySelector('a.frag-a');
    await getFragment(a);
    expect(document.querySelector('h4')).to.exist;
    expect(window.lana.log.args[2][0]).to.equal('ERROR: Fragment Circular Reference loading http://localhost:2000/test/blocks/fragment/mocks/fragments/frag-a');
  });
});
