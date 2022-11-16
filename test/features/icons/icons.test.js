
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';
const { default: loadIcons } = await import('../../../libs/features/icons.js');

// const { miloLibs, codeRoot } = config;
// const base = miloLibs || codeRoot;
const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

console.log(config);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Icon Suppprt', () => {
  it('Replaces span.icon', async () => {
    const domIcons = document.querySelectorAll('span.icon');

    console.log(domIcons);
    if (domIcons.length === 0) return;
    await loadIcons(domIcons, config);
    const selector = domIcons[0].querySelector(':scope svg');
    expect(selector).to.exist;
  });

  // it('Fails on JSON', async () => {
  //   const text = await replaceKey('recommended-for-you', config);
  //   expect(text).to.equal('recommended for you');
  // });
  //
  // it('Replaces text', async () => {
  //   config.locale.contentRoot = '/test/features/placeholders';
  //   const regex = /{{(.*?)}}/g;
  //   let text = 'Hello world {{recommended-for-you}}';
  //   text = await replaceText(config, regex, text);
  //   expect(text).to.equal('Hello world Recommended for you');
  // });
  //
  // it('Replaces key', async () => {
  //   const text = await replaceKey('recommended-for-you', config);
  //   expect(text).to.equal('Recommended for you');
  // });
  //
  // it('Gracefully falls back', async () => {
  //   const text = await replaceKey('this-wont-work', config);
  //   expect(text).to.equal('this wont work');
  // });
});

// describe('Icon support', () => {
//   it('Load icons', async () => {
//     const paragraph = document.createElement('p');
//     paragraph.innerHTML = '<span class="icon icon-play"></span>';
//     await loadIcons(paragraph);
//     const selector = paragraph.querySelector(':scope svg');
//     expect(selector).to.exist;
//   });
// });
//
// describe('Get SVGs from a file', () => {
//   it('Dies gracefully when no path is given', async () => {
//     const val = await getSVGsfromFile();
//     expect(val).to.be.null;
//   });
//
//   it('Dies gracefully when a bad path is given', async () => {
//     const val = await getSVGsfromFile('/my/awesome/icon.svg');
//     expect(val).to.be.null;
//   });
//
//   it('Returns svg when a good path is given', async () => {
//     const val = await getSVGsfromFile('../../libs/img/icons/icons.svg');
//     expect(Object.keys(val).length > 0).to.equal(true);
//   });
// });
