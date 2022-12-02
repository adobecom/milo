import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const accordionFuncs = {};

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('Accordion', () => {
  before(async () => {
    const module = await import('../../../libs/blocks/accordion/accordion.js');
    Object.keys(module).forEach((func) => {
      accordionFuncs[func] = module[func];
    });
  });

  it('Renders with accordion class', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await accordionFuncs.default(accordion);
    expect(accordion).to.exist;
  });

  it('Runs all basic functions of the accordion', async () => {
    // setSEO()
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await accordionFuncs.default(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.exist;

    // handleClick()
    const firstAccordionHeading = document.querySelector('dt');
    expect(firstAccordionHeading.classList.contains('is-open')).to.be.false;
    firstAccordionHeading.querySelector('button').click();
    expect(firstAccordionHeading.classList.contains('is-open')).to.be.true;

    // handleClick() => expanded = true.
    firstAccordionHeading.querySelector('button').click();
    expect(firstAccordionHeading.querySelector('button').getAttribute('aria-expanded')).to.equal('false');

    // handleFocusOut()
    const dt = document.querySelector('dt');
    const focusIn = new Event('focusin');
    dt.dispatchEvent(focusIn);
    expect(dt.classList.contains('has-focus')).to.be.true;

    // handleFocus()
    const focusOut = new Event('focusout');
    dt.dispatchEvent(focusOut);
    expect(dt.classList.contains('has-focus')).to.be.false;
  });

  it('Loads description in the JSON-LD with no null value', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await accordionFuncs.default(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.exist;
  });
  it('Shows JSON-LD that has required fields present and not null', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await accordionFuncs.default(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.innerHTML);
    expect(json).to.have.all.keys(['@context', '@type', 'mainEntity']);
    expect(json.mainEntity[0][0]).to.have.all.keys(['@type', 'name', 'acceptedAnswer']);
    expect(json.mainEntity[0][0].acceptedAnswer).to.have.all.keys(['@type', 'text']);
    expect(json['@context']).to.equal('https://schema.org');
    expect(json['@type']).to.equal('FAQPage');
    expect(json.mainEntity[0][0]['@type']).to.equal('Question');
    expect(json.mainEntity[0][0].name).to.not.equal(null);
    expect(json.mainEntity[0][0].acceptedAnswer['@type']).to.equal('Answer');
    expect(json.mainEntity[0][0].acceptedAnswer.text).to.not.equal(null);
  });
});
