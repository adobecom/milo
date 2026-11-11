import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

setConfig(config);

describe('editorial-card', () => {
  let editorialCards;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const { default: init } = await import('../../../libs/blocks/editorial-card/editorial-card.js');
    editorialCards = document.querySelectorAll('.editorial-card');
    editorialCards.forEach((card) => {
      init(card);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('w/ 1 row has a foreground', () => {
    const foreground = editorialCards[0].querySelector('.foreground');
    expect(foreground).to.exist;
  });

  it('w/ 4 rows has a footer', () => {
    const footer = editorialCards[3].querySelector('.card-footer');
    expect(footer).to.exist;
  });

  it('w/ lockup gets decorated', async () => {
    const lockup = editorialCards[4].classList.contains('m-lockup');
    expect(lockup).to.exist;
  });

  it('media takes full height if no foreground', () => {
    const editorialCardWithMediaOnly = editorialCards[8];
    expect(editorialCardWithMediaOnly.classList.contains('no-foreground')).to.be.true;
  });
});

describe('editorial-card HowTo schema (seo)', () => {
  let init;

  const cleanupScripts = () => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  };

  const initAll = () => {
    document.querySelectorAll('.editorial-card').forEach((card) => init(card));
  };

  before(async () => {
    ({ default: init } = await import('../../../libs/blocks/editorial-card/editorial-card.js'));
  });

  beforeEach(async () => {
    cleanupScripts();
    document.body.innerHTML = await readFile({ path: './mocks/seo.html' });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    cleanupScripts();
  });

  it('emits exactly one HowTo JSON-LD script for a tagged step group', () => {
    initAll();
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).to.equal(1);
    const json = JSON.parse(scripts[0].text);
    expect(json['@context']).to.equal('http://schema.org');
    expect(json['@type']).to.equal('HowTo');
  });

  it('reads name from the heading block above and description from its intro (not the CTA)', () => {
    initAll();
    const json = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').text);
    expect(json.name).to.equal('How to generate a citation online using Student Spaces in Acrobat.');
    expect(json.description).to.equal('Creating properly formatted citations takes just three simple steps. Upload your source, choose your style, and get your citation ready to use.');
    expect(json.description).to.not.contain('Create a citation');
  });

  it('builds one numbered step per tagged card, with title + description as the direction text', () => {
    initAll();
    const json = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').text);
    expect(json.step.length).to.equal(3);
    expect(json.step.map((s) => s.name)).to.eql(['Step 1', 'Step 2', 'Step 3']);
    expect(json.step[0]['@type']).to.equal('HowToStep');
    expect(json.step[0].url).to.equal(`${window.location.origin}${window.location.pathname}`);
    expect(json.step[0].itemListElement[0]['@type']).to.equal('HowToDirection');
    expect(json.step[0].itemListElement[0].text).to.equal('Upload or enter your source. Start by uploading your source material or manually entering the publication details.');
    expect(json.step[2].itemListElement[0].text).to.equal('Copy your formatted citation. Copy your finished citation and paste it straight into your works cited page.');
  });

  it('omits card icons from the schema (no image field on steps)', () => {
    initAll();
    const json = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').text);
    json.step.forEach((step) => {
      expect(step).to.not.have.property('image');
      expect(step.itemListElement[0].text).to.not.contain('.svg');
    });
  });

  it('matches the How To block publisher block exactly', () => {
    initAll();
    const json = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').text);
    expect(json.publisher).to.eql({
      '@type': 'Organization',
      name: 'Adobe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg',
      },
    });
  });

  it('does not emit schema for editorial-cards without the seo token', () => {
    const untaggedCard = document.querySelectorAll('.editorial-card:not(.seo)')[0];
    init(untaggedCard);
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).to.equal(0);
  });

  it('does not emit duplicates even if every tagged card initialises', () => {
    initAll();
    initAll();
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).to.equal(1);
  });

  it('emits an empty description when the heading block has no intro paragraph', () => {
    document.body.innerHTML = `
      <div class="section"><div class="text"><div><div><h2>Heading only.</h2></div></div></div></div>
      <div class="section">
        <div class="editorial-card seo">
          <div><div><h3>Only step.</h3><p>Do the thing.</p></div></div>
        </div>
      </div>`;
    document.querySelectorAll('.editorial-card').forEach((card) => init(card));
    const json = JSON.parse(document.head.querySelector('script[type="application/ld+json"]').text);
    expect(json.name).to.equal('Heading only.');
    expect(json.description).to.equal('');
  });

  it('skips silently when a tagged card has no heading block directly above it', async () => {
    document.body.innerHTML = `
      <div class="section">
        <div class="editorial-card seo">
          <div><div><h3>Orphan step.</h3><p>No heading section precedes this.</p></div></div>
        </div>
      </div>`;
    const card = document.querySelector('.editorial-card.seo');
    expect(() => init(card)).to.not.throw();
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).to.equal(0);
  });

  it('still decorates the tagged card normally (no regression)', () => {
    initAll();
    const taggedCard = document.querySelector('.editorial-card.seo');
    expect(taggedCard.classList.contains('con-block')).to.be.true;
    expect(taggedCard.querySelector('.foreground')).to.exist;
  });
});
