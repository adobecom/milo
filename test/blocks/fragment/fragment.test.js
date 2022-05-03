/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: getFragment } = await import('../../../libs/blocks/fragment/fragment.js');

describe('Fragments', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('Loads a fragment', async () => {
    const a = document.querySelector('a');
    await getFragment(a);
    const h1 = document.querySelector('h1');
    expect(h1).to.exist;
  });

  it('Loads a fragment into a parent', async () => {
    const a = document.querySelector('.parent-link');
    const parent = document.querySelector('.parent');
    await getFragment(a, parent);
    const h1 = document.querySelector('.parent h1');
    expect(h1).to.exist;
  });

  it('Doesnt load a fragment', async () => {
    const a = document.querySelector('a.bad');
    await getFragment(a);
    expect(console.log.args[0][0]).to.equal('Could not get fragment');
  });

  it('Doesnt create a malformed fragment', async () => {
    const a = document.querySelector('a.malformed');
    await getFragment(a);
    expect(console.log.args[0][0]).to.equal('Could not make fragment');
  });
});
