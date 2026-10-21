import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/tag-cta/tag-cta.js';
import { getConfig, loadStyle, setConfig } from '../../../libs/utils/utils.js';

const body = await readFile({ path: './mocks/body.html' });
const mapping = JSON.parse(await readFile({ path: './mocks/tag-mapping.json' }));

describe('Tag CTA', () => {
  let config;
  let language;
  let fetchStub;
  let lana;

  const setMetadata = (ids) => {
    document.querySelector('.card-metadata > div:last-child > div:last-child').textContent = ids;
  };

  before(async () => {
    await Promise.all([
      new Promise((resolve) => { loadStyle('/libs/styles/styles.css', resolve); }),
      new Promise((resolve) => { loadStyle('/libs/blocks/tag-cta/tag-cta.css', resolve); }),
    ]);
  });

  beforeEach(() => {
    document.body.innerHTML = body;
    config = getConfig();
    language = document.documentElement.lang;
    lana = window.lana;
    setConfig({
      placeholders: {
        blog: 'Blog',
        genstudio: 'GenStudio',
        b2b: 'Business-to-Business',
        personalization: 'Personalization',
        'generative-ai': 'Generative AI',
      },
    });
    document.documentElement.lang = 'en';
    window.lana = { log: sinon.spy() };
    fetchStub = sinon.stub(window, 'fetch')
      .callsFake(async () => new Response(JSON.stringify(mapping)));
  });

  afterEach(() => {
    setConfig(config);
    document.documentElement.lang = language;
    window.lana = lana;
    sinon.restore();
    document.body.innerHTML = '';
  });

  it('preserves the authored heading, links and order', async () => {
    const block = document.querySelector('.tag-cta');
    const heading = block.querySelector('h2');
    const links = [...block.querySelectorAll('a')];
    await init(block);

    expect(block.firstElementChild === heading).to.be.true;
    expect(heading.id).to.equal('related-resources');
    expect(heading.textContent).to.equal('Explore related resources');
    expect(heading.classList.contains('tag-cta-heading')).to.be.true;
    const rendered = [...block.querySelectorAll('li > a')];
    expect(rendered.length).to.equal(links.length);
    expect(rendered.every((link, index) => link === links[index])).to.be.true;
    expect(block.querySelector('ul').getAttribute('role')).to.equal('list');
    expect(links[0].getAttribute('href')).to.equal('/resources/marketing');
    expect(fetchStub.called).to.be.false;
  });

  it('handles missing headings, links, and metadata', async () => {
    document.querySelector('.card-metadata').remove();
    const headingOnly = document.querySelector('.heading-only');
    await init(headingOnly);
    expect(headingOnly.children.length).to.equal(1);
    expect(headingOnly.querySelectorAll('ul').length).to.equal(0);

    expect(fetchStub.calledOnceWithExactly(`${getConfig().contentRoot || ''}/tag-cta.json`)).to.be.true;
    fetchStub.resetHistory();

    const linksOnly = document.querySelector('.links-only');
    await init(linksOnly);
    expect(linksOnly.querySelector('li > a').textContent).to.equal('AI');

    const empty = document.createElement('div');
    await init(empty);
    expect(empty.children.length).to.equal(0);
    expect(fetchStub.called).to.be.false;
  });

  it('does not move heading links into the tag list', async () => {
    const block = document.querySelector('.tag-cta');
    const heading = block.querySelector('h2');
    heading.innerHTML = '<a href="/resources">Explore related resources</a>';
    const headingLink = heading.firstElementChild;
    await init(block);

    expect(heading.firstElementChild === headingLink).to.be.true;
    expect(block.querySelectorAll('li').length).to.equal(5);
  });

  it('renders mapped links in metadata order and omits unmapped taxonomy tags', async () => {
    setMetadata('caas:content-type/blog, caas:products/genstudio, caas:events/business-type/b2b, caas:topic/personalization');
    const metadata = document.querySelector('.card-metadata').innerHTML;
    const block = document.querySelector('.heading-only');
    await init(block);

    const pills = [...block.querySelectorAll('.tag-cta-tag')];
    expect(pills.map((pill) => pill.textContent)).to.deep.equal([
      'GenStudio', 'Business-to-Business', 'Personalization',
    ]);
    expect(pills.map((pill) => pill.dataset.caasTag)).to.deep.equal([
      'caas:products/genstudio', 'caas:events/business-type/b2b', 'caas:topic/personalization',
    ]);
    expect(pills.map((pill) => pill.getAttribute('href'))).to.deep.equal([
      '/products/genstudio', '/resources/b2b', 'https://business.adobe.com/blog/personalization',
    ]);
    expect(document.querySelector('.card-metadata').innerHTML).to.equal(metadata);
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('omits blank-link and unmapped tags and preserves linked tag order', async () => {
    setMetadata('caas:products/genstudio, caas:topic/3d-ar, caas:content-type/blog, caas:topic/personalization');
    const block = document.querySelector('.heading-only');
    await init(block);

    const pills = [...block.querySelectorAll('.tag-cta-tag')];
    expect(pills.map((pill) => pill.textContent)).to.deep.equal([
      'GenStudio', 'Personalization',
    ]);
    expect(pills.map((pill) => pill.tagName)).to.deep.equal(['A', 'A']);
    expect(pills.map((pill) => pill.getAttribute('href'))).to.deep.equal([
      '/products/genstudio', 'https://business.adobe.com/blog/personalization',
    ]);
    expect(pills[1].hasAttribute('tabindex')).to.be.false;
  });

  it('uses placeholder labels independently of authored mapping titles', async () => {
    setMetadata('caas:products/genstudio, caas:topic/personalization');
    fetchStub.callsFake(async () => new Response(JSON.stringify({
      data: mapping.data.map((tag) => (
        tag.Tag === 'caas:topic/personalization' ? { ...tag, Title: '' } : tag
      )),
    })));
    const block = document.querySelector('.heading-only');
    await init(block);

    expect([...block.querySelectorAll('.tag-cta-tag')].map((pill) => pill.textContent))
      .to.deep.equal(['GenStudio', 'Personalization']);
  });

  it('appends automatic tags after authored links with include-caas on repeated decoration', async () => {
    setMetadata('caas:products/genstudio, caas:topic/personalization');
    const block = document.querySelector('.include-caas');
    const link = block.querySelector('a');
    await init(block);
    await init(block);

    expect(block.querySelector('li > a') === link).to.be.true;
    expect([...block.querySelectorAll('li')].map((item) => item.textContent))
      .to.deep.equal(['Marketing', 'GenStudio', 'Personalization']);
    expect(block.querySelectorAll('ul').length).to.equal(1);
  });
});
