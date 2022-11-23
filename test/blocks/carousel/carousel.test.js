import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const carouselFuncs = {};

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('Carousel', () => {
  before(async () => {
    const module = await import('../../../libs/blocks/carousel/carousel.js');
    Object.keys(module).forEach((func) => {
      carouselFuncs[func] = module[func];
    });
  });

  it('Renders with carousel class', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const carousel = document.querySelector('.carousel');
    await carouselFuncs.default(carousel);
    expect(carousel).to.exist;
  });
});
