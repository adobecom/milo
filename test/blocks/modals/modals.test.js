/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/modals/modals.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Modals', () => {
  it('Doesnt load modals on page load with no hash', async () => {
    window.location.hash = '';
    const modal = document.querySelector('dialog');
    expect(modal).to.be.null;
  });

  it('Loads a modal on load with hash', async () => {
    window.location.hash = '#milo';
    const modal = await init(true);
    expect(modal).to.exist;
  });

  it('Closes a modal on hash removal', async () => {
    window.location.hash = '';
    const modal = await init(true);
    expect(modal).to.be.null;
  });

  it('Closes a modal on button click', async () => {
    window.location.hash = '#milo';
    const modal = await init(true);
    const close = document.querySelector('dialog button');
    close.click();
    expect(window.location.hash).to.be.empty;
  });

  it('Opens an inherited modal', async () => {
    const meta = document.createElement('meta');
    meta.name = '-otis';
    meta.content = 'https://milo.adobe.com/test/scripts/modals/mocks/otis';
    document.head.append(meta);
    window.location.hash = '#otis';
    const modal = await init(true);
    expect(modal).to.exist;
  });

  it('Doesnt open a modal', async () => {
    window.location.hash = '#dexter';
    const modal = await init(true);
    expect(modal).to.be.null;
  });

  it('Loads a modal on hash change', async () => {
    window.location.hash = '';
    const prom = init(true);
    window.location.hash = '#milo';
    prom.then((modal) => {
      expect(modal).to.exist;
    });
  });
});
