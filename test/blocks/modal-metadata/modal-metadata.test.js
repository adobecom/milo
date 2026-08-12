import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/modal-metadata/modal-metadata.js';

describe('Modal Metadata (c2)', () => {
  it('does nothing when the block is not inside a dialog-modal', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-modal.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    const section = document.querySelector('.section');
    expect(section.classList.contains('center')).to.be.false;
    expect(section.classList.contains('curtain-off')).to.be.false;
  });

  it('applies style metadata as classes on the modal', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    const modal = document.querySelector('.dialog-modal');
    expect(modal.classList.contains('center')).to.be.true;
    expect(modal.classList.contains('grid-width-2')).to.be.true;
  });

  it('adds curtain-off when curtain metadata is off', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    expect(document.querySelector('.dialog-modal').classList.contains('curtain-off')).to.be.true;
  });

  it('does not apply a background when the modal is not tall-video', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    const modal = document.querySelector('.dialog-modal');
    expect(modal.classList.contains('has-background')).to.be.false;
    expect(modal.querySelector(':scope > picture.section-background')).to.be.null;
  });

  it('moves the background picture into a tall-video modal', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/tall-video.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    const modal = document.querySelector('.dialog-modal');
    expect(modal.classList.contains('has-background')).to.be.true;
    const bgPicture = modal.querySelector(':scope > picture.section-background');
    expect(bgPicture).to.exist;
  });

  it('does not add curtain-off when there is no curtain=off metadata', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/tall-video.html' });
    const block = document.querySelector('.modal-metadata');
    await init(block);

    expect(document.querySelector('.dialog-modal').classList.contains('curtain-off')).to.be.false;
  });
});
