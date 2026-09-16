import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import init from '../../../libs/blocks/blog-author/blog-author.js';

const MOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon"></symbol></svg>';

const BLOCK_HTML = `
<div class="blog-author">
  <div><div><picture><img src="https://example.com/author.jpg" alt="Jane Doe"></picture></div></div>
  <div><div><p>Jane Doe</p></div></div>
  <div><div><p>Senior Director, Marketing</p></div></div>
  <div><div><p>Jane has 15 years of experience in B2B marketing.</p></div></div>
  <div><div>
    <a href="https://linkedin.com/in/janedoe">LinkedIn</a>
    <a href="https://twitter.com/janedoe">Twitter</a>
  </div></div>
</div>`;

function getPersonSchema() {
  const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
  const script = scripts.find((s) => {
    try { return JSON.parse(s.textContent)['@type'] === 'Person'; } catch { return false; }
  });
  return script ? JSON.parse(script.textContent) : null;
}

describe('Blog Author', () => {
  beforeEach(() => {
    document.body.innerHTML = BLOCK_HTML;
    stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/svgs/') || url.includes('icons.svg')) {
        return { ok: true, text: async () => MOCK_SVG };
      }
      return { ok: false };
    });
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
    sinon.restore();
  });

  it('adds class to image row', async () => {
    await init(document.querySelector('.blog-author'));
    expect(document.querySelector('.blog-author-image')).to.exist;
    expect(document.querySelector('.blog-author-image picture')).to.exist;
  });

  it('assigns name and title classes by row order', async () => {
    await init(document.querySelector('.blog-author'));
    expect(document.querySelector('.blog-author-name').textContent).to.equal('Jane Doe');
    expect(document.querySelector('.blog-author-title').textContent).to.equal('Senior Director, Marketing');
  });

  it('assigns description class to third and subsequent text rows', async () => {
    await init(document.querySelector('.blog-author'));
    expect(document.querySelector('.blog-author-description').textContent).to.include('15 years');
  });

  it('assigns blog-author-name class to the first text row', async () => {
    await init(document.querySelector('.blog-author'));
    expect(document.querySelector('.blog-author-name')).to.exist;
  });

  it('adds blog-author-social class to links row', async () => {
    await init(document.querySelector('.blog-author'));
    expect(document.querySelector('.blog-author-social')).to.exist;
  });

  it('adds aria-labels to known social links', async () => {
    await init(document.querySelector('.blog-author'));
    const links = document.querySelectorAll('.blog-author-social a');
    expect(links[0].getAttribute('aria-label')).to.equal('LinkedIn');
    expect(links[1].getAttribute('aria-label')).to.equal('X');
  });

  it('sets target and rel on social links', async () => {
    await init(document.querySelector('.blog-author'));
    const link = document.querySelector('.blog-author-social a');
    expect(link.target).to.equal('_blank');
    expect(link.rel).to.equal('noopener noreferrer');
  });

  it('adds icon spans to social links', async () => {
    await init(document.querySelector('.blog-author'));
    const links = document.querySelectorAll('.blog-author-social a');
    expect(links[0].querySelector('.icon-linkedin')).to.exist;
    expect(links[1].querySelector('.icon-twitter')).to.exist;
  });

  it('injects Person JSON-LD schema', async () => {
    await init(document.querySelector('.blog-author'));
    const schema = getPersonSchema();
    expect(schema).to.exist;
    expect(schema['@type']).to.equal('Person');
    expect(schema.name).to.equal('Jane Doe');
    expect(schema.jobTitle).to.equal('Senior Director, Marketing');
    expect(schema.url).to.be.a('string');
    expect(schema['@id']).to.equal(`${window.location.origin}${window.location.pathname}#person`);
    expect(schema.worksFor).to.be.undefined;
  });

  it('includes image and sameAs in schema', async () => {
    await init(document.querySelector('.blog-author'));
    const schema = getPersonSchema();
    expect(schema.image).to.include('example.com/author.jpg');
    expect(schema.sameAs).to.include('https://linkedin.com/in/janedoe');
    expect(schema.sameAs).to.include('https://twitter.com/janedoe');
  });

  it('reads company row after social links into schema and removes it from DOM', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div><p>Jane Doe</p></div></div>
        <div><div>
          <a href="https://linkedin.com/in/jane">LinkedIn</a>
        </div></div>
        <div><div><p>Adobe</p></div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const schema = getPersonSchema();
    expect(schema.worksFor.name).to.equal('Adobe');
    expect(document.querySelector('.blog-author').textContent).to.not.include('Adobe');
  });

  it('omits worksFor from schema when no company row is authored', async () => {
    await init(document.querySelector('.blog-author'));
    const schema = getPersonSchema();
    expect(schema.worksFor).to.be.undefined;
  });

  it('omits schema fields when content is absent', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div><p>Jane Doe</p></div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const schema = getPersonSchema();
    expect(schema.image).to.be.undefined;
    expect(schema.sameAs).to.be.undefined;
    expect(schema.jobTitle).to.be.undefined;
  });

  it('merges social links from multiple authored rows into one container', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div>
          <a href="https://linkedin.com/in/jane">LinkedIn</a>
          <a href="https://instagram.com/jane">Instagram</a>
        </div></div>
        <div><div>
          <a href="https://twitter.com/jane">Twitter</a>
        </div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const socialContainers = document.querySelectorAll('.blog-author-social');
    expect(socialContainers).to.have.length(1);
    expect(socialContainers[0].querySelectorAll('a')).to.have.length(3);
  });

  it('hides unrecognized links in the social row', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div>
          <a href="https://linkedin.com/in/jane">LinkedIn</a>
          <a href="https://example.com/jane">Website</a>
        </div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const links = document.querySelectorAll('.blog-author-social a');
    expect(links[0].hidden).to.be.false;
    expect(links[1].hidden).to.be.true;
  });

  it('does not inject schema when name is missing', async () => {
    document.body.innerHTML = '<div class="blog-author"><div><div><picture><img src="x.jpg"></picture></div></div></div>';
    await init(document.querySelector('.blog-author'));
    expect(getPersonSchema()).to.be.null;
  });

  it('wraps text and social elements in blog-author-content', async () => {
    await init(document.querySelector('.blog-author'));
    const content = document.querySelector('.blog-author-content');
    expect(content).to.exist;
    expect(content.querySelector('.blog-author-name')).to.exist;
    expect(content.querySelector('.blog-author-title')).to.exist;
    expect(content.querySelector('.blog-author-description')).to.exist;
    expect(content.querySelector('.blog-author-social')).to.exist;
  });

  it('applies solid hex background color and removes the row from DOM', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div><p>#f0e6d3</p></div></div>
        <div><div><p>Jane Doe</p></div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const el = document.querySelector('.blog-author');
    expect(el.style.backgroundColor).to.equal('rgb(240, 230, 211)');
    expect(el.textContent).to.not.include('#f0e6d3');
  });

  it('applies gradient background from two comma-separated hex colors', async () => {
    document.body.innerHTML = `
      <div class="blog-author">
        <div><div><p>#f0e6d3, #ffffff</p></div></div>
        <div><div><p>Jane Doe</p></div></div>
      </div>`;
    await init(document.querySelector('.blog-author'));
    const el = document.querySelector('.blog-author');
    expect(el.style.background).to.include('linear-gradient');
    expect(el.textContent).to.not.include('#f0e6d3');
  });

  it('does not treat non-hex text as a background color', async () => {
    await init(document.querySelector('.blog-author'));
    const el = document.querySelector('.blog-author');
    expect(el.style.backgroundColor).to.equal('');
  });
});
