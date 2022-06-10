/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: loadJsonLd } = await import('../../../libs/blocks/accordion/accordion.js');

describe('Accordion', () => {
  it('Renders with accordion class', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await loadJsonLd(accordion);
    expect(accordion).to.exist;
  });
  it('Puts JSON-LD data in Script tag', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await loadJsonLd(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.exist;
  });
  it('Loads description in the JSON-LD with no null value', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await loadJsonLd(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.exist;
  });
  it('Shows JSON-LD that has required fields present and not null', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const accordion = document.querySelector('.accordion');
    await loadJsonLd(accordion);
    const script = document.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script.innerHTML);

    expect(json).to.have.all.keys(['@context', '@type', 'mainEntity']);
    expect(json.mainEntity[0]).to.have.all.keys(['@type', 'name', 'acceptedAnswer']);
    expect(json.mainEntity[0].acceptedAnswer).to.have.all.keys(['@type', 'text']);

    expect(json['@context']).to.equal('http://schema.org');
    expect(json['@type']).to.equal('FAQPage');
    expect(json.mainEntity[0]['@type']).to.equal('Question');
    expect(json.mainEntity[0].name).to.not.equal(null);
    expect(json.mainEntity[0].acceptedAnswer['@type']).to.equal('Answer');
    expect(json.mainEntity[0].acceptedAnswer.text).to.not.equal(null);
  });
});
