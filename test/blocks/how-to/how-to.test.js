/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: loadJsonLd } = await import('../../../libs/blocks/how-to/how-to.js');

describe('How To', () => {
  it('Renders as an ordered list', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.querySelector('.how-to');
    await loadJsonLd(howTo);
    const howToList = document.querySelector('ol');
    expect(howToList).to.exist;
  });
  it('Puts JSON-LD data in Script tag', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.querySelector('.how-to');
    await loadJsonLd(howTo);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.exist;
  });
  it('Loads description in the JSON-LD with no null value', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.querySelector('.how-to');
    await loadJsonLd(howTo);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script.innerHTML.search('"description":')).to.be.above(0);
    expect(script).to.exist;
  });
  it('Shows JSON-LD that has required fields present and not null', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.querySelector('.how-to');
    await loadJsonLd(howTo);
    const script = document.querySelector('script[type="application/ld+json"]');
    // convert script innerHTML to JSON
    const json = JSON.parse(script.innerHTML);

    // exect all keys to exist
    expect(json).to.have.all.keys(
      '@context',
      '@type',
      'name',
      'description',
      'publisher',
      'step',
    );
    expect(json.publisher).to.have.all.keys(
      '@type',
      'name',
      'logo',
    );
    expect(json.publisher.logo).to.have.all.keys(
      '@type',
      'url',
    );
    expect(json.step[0]).to.have.all.keys(
      '@type',
      'url',
      'name',
      'itemListElement',
    );
    expect(json.step[0].itemListElement[0]).to.have.all.keys(
      '@type',
      'text',
    );

    expect(json['@context']).to.equal('http://schema.org');
    expect(json['@type']).to.equal('HowTo');
    expect(json.name).to.not.equal(null);
    expect(json.description).to.not.equal(null);
    expect(json.publisher).to.not.equal(null);
    expect(json.publisher['@type']).to.equal('Organization');
    expect(json.publisher.name).to.not.equal(null);
    expect(json.publisher.logo['@type']).to.equal('ImageObject');
    expect(json.publisher.logo).to.not.equal(null);
    expect(json.publisher.logo.url).to.not.equal(null);
    expect(json.step).to.not.equal(null);
    expect(json.step[0]['@type']).to.equal('HowToStep');
    expect(json.step[0].url).to.not.equal(null);
    expect(json.step[0].name).to.not.equal(null);
    expect(json.step[0].itemListElement).to.not.equal(null);
    expect(json.step[0].itemListElement[0]['@type']).to.equal('HowToDirection');
    expect(json.step[0].itemListElement[0].text).to.not.equal(null);
  });
});
