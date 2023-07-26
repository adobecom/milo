import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const accordionFuncs = {};
document.body.innerHTML = await readFile({ path: './mocks/editorial-body.html' });
describe('Accordion', () => {
  before(async () => {
    const module = await import('../../../libs/blocks/accordion/accordion.js');
    Object.keys(module).forEach((func) => {
      accordionFuncs[func] = module[func];
    });
    const accordions = document.body.querySelectorAll('.accordion');
    accordions.forEach((accordion) => {
      module.default(accordion);
    });
  });

  it('Load editorial body', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/editorial-body.html' });
    const accordionDl = document.querySelector('dl.accordion');
    expect(accordionDl).to.exist;
  });

  it('Runs all basic functions of the accordion', async () => {
    // handleClick()
    const firstAccordionButton = document.body.querySelector('dt button');
    console.log('firstAccordionButton');
    console.log(firstAccordionButton);
    expect(firstAccordionButton.getAttribute('aria-expanded')).to.equal('true');
    firstAccordionButton.click();
    expect(firstAccordionButton.getAttribute('aria-expanded')).to.equal('false');

    // handleClick() => expanded = true.
    firstAccordionButton.click();
    expect(firstAccordionButton.getAttribute('aria-expanded')).to.equal('true');
  });
});
