import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/tag-cta/tag-cta.js';
import { getConfig, loadBlock, loadStyle, setConfig } from '../../../libs/utils/utils.js';

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

  it('collects links across rows without changing attributes, listeners or duplicates', async () => {
    const block = document.querySelector('.multiple-rows');
    const links = [...block.querySelectorAll('a')];
    const onClick = sinon.spy();
    links[0].addEventListener('click', (event) => {
      event.preventDefault();
      onClick();
    });
    await init(block);

    const rendered = [...block.querySelectorAll('li > a')];
    expect(rendered.length).to.equal(4);
    expect(rendered.every((link, index) => link === links[index])).to.be.true;
    expect(links[0].dataset.custom).to.equal('authored');
    expect(links[1].getAttribute('href')).to.equal('https://business.adobe.com/resources.html#ai');
    expect(links[1].target).to.equal('_blank');
    expect(links[1].rel).to.equal('noopener');
    expect(links[3].querySelector('span').textContent).to.equal('Customer Journey');
    expect(block.querySelectorAll('ul').length).to.equal(1);
    links[0].click();
    expect(onClick.calledOnce).to.be.true;
  });

  it('handles missing headings, links and metadata', async () => {
    document.querySelector('.card-metadata').remove();
    const headingOnly = document.querySelector('.heading-only');
    await init(headingOnly);
    expect(headingOnly.children.length).to.equal(1);
    expect(headingOnly.querySelectorAll('ul').length).to.equal(0);
    expect(fetchStub.calledOnceWithExactly(`${getConfig().locale.contentRoot}/tag-cta.json`)).to.be.true;
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

  it('renders mapped links and unmapped taxonomy tags in metadata order', async () => {
    setMetadata('caas:content-type/blog, caas:products/genstudio, caas:events/business-type/b2b, caas:topic/personalization');
    const metadata = document.querySelector('.card-metadata').innerHTML;
    const block = document.querySelector('.heading-only');
    await init(block);

    const pills = [...block.querySelectorAll('.tag-cta-tag')];
    expect(pills.map((pill) => pill.textContent)).to.deep.equal([
      'Blog', 'GenStudio', 'Business-to-Business', 'Personalization',
    ]);
    expect(pills.map((pill) => pill.dataset.caasTag)).to.deep.equal([
      'caas:content-type/blog', 'caas:products/genstudio',
      'caas:events/business-type/b2b', 'caas:topic/personalization',
    ]);
    expect(pills.map((pill) => pill.getAttribute('href'))).to.deep.equal([
      null, '/products/genstudio', '/resources/b2b', 'https://business.adobe.com/blog/personalization',
    ]);
    expect(document.querySelector('.card-metadata').innerHTML).to.equal(metadata);
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('omits mapped tags with blank links and preserves linked and unmapped tag order', async () => {
    setMetadata('caas:products/genstudio, caas:topic/3d-ar, caas:content-type/blog, caas:topic/personalization');
    const block = document.querySelector('.heading-only');
    await init(block);

    const pills = [...block.querySelectorAll('.tag-cta-tag')];
    expect(pills.map((pill) => pill.textContent)).to.deep.equal([
      'GenStudio', 'Blog', 'Personalization',
    ]);
    expect(pills.map((pill) => pill.tagName)).to.deep.equal(['A', 'SPAN', 'A']);
    expect(pills.map((pill) => pill.getAttribute('href'))).to.deep.equal([
      '/products/genstudio', null, 'https://business.adobe.com/blog/personalization',
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

  it('trims and deduplicates metadata IDs and uses localized placeholder labels', async () => {
    document.documentElement.lang = 'fr-FR';
    getConfig().placeholders.personalization = 'Personnalisation';
    setMetadata(' caas:products/genstudio, caas:topic/personalization, caas:topic/personalization, , ');
    const block = document.querySelector('.heading-only');
    await init(block);

    expect([...block.querySelectorAll('.tag-cta-tag')].map((pill) => pill.textContent))
      .to.deep.equal(['GenStudio', 'Personnalisation']);
  });

  it('awaits mapping and placeholder responses before rendering automatic tags', async () => {
    setConfig({ contentRoot: '/tag-cta-async-test' });
    setMetadata('caas:products/genstudio, caas:topic/personalization');
    const { contentRoot } = getConfig().locale;
    let resolveMapping;
    let resolvePlaceholders;
    let mappingRequested;
    let placeholdersRequested;
    const mappingResponse = new Promise((resolve) => { resolveMapping = resolve; });
    const placeholderResponse = new Promise((resolve) => { resolvePlaceholders = resolve; });
    const mappingStarted = new Promise((resolve) => { mappingRequested = resolve; });
    const placeholdersStarted = new Promise((resolve) => { placeholdersRequested = resolve; });
    fetchStub.callsFake((url) => {
      if (url === `${contentRoot}/tag-cta.json`) {
        mappingRequested();
        return mappingResponse;
      }
      if (url === `${contentRoot}/placeholders.json`) {
        placeholdersRequested();
        return placeholderResponse;
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    const block = document.querySelector('.heading-only');
    const heading = block.querySelector('h2');
    const initialized = init(block);

    await mappingStarted;
    expect(block.querySelector('h2')).to.equal(heading);
    expect(block.querySelector('ul')).to.be.null;
    resolveMapping(new Response(JSON.stringify(mapping)));

    await placeholdersStarted;
    expect(block.querySelector('ul')).to.be.null;
    resolvePlaceholders(new Response(JSON.stringify({
      data: [
        { key: 'genstudio', value: 'Translated GenStudio' },
        { key: 'personalization', value: 'Translated Personalization' },
      ],
    })));
    await initialized;

    const pills = [...block.querySelectorAll('.tag-cta-tag')];
    expect(pills.map((pill) => pill.textContent))
      .to.deep.equal(['Translated GenStudio', 'Translated Personalization']);
    expect(pills.map((pill) => pill.getAttribute('href')))
      .to.deep.equal(['/products/genstudio', 'https://business.adobe.com/blog/personalization']);
    expect(fetchStub.calledTwice).to.be.true;
  });

  it('regenerates automatic tags when metadata changes without duplicating the list', async () => {
    const block = document.querySelector('.heading-only');
    await init(block);
    setMetadata('caas:topic/generative-ai');
    await init(block);

    expect(block.querySelectorAll('ul').length).to.equal(1);
    expect(block.querySelectorAll('.tag-cta-tag').length).to.equal(1);
    expect(block.querySelector('a').getAttribute('href'))
      .to.equal('https://business.adobe.com/blog/generative-ai');
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

  ['HTTP error', 'network error'].forEach((failure) => {
    it(`keeps authored content and unlinked taxonomy tags after a mapping ${failure}`, async () => {
      setMetadata('caas:products/genstudio');
      if (failure === 'HTTP error') {
        fetchStub.resolves(new Response('', { status: 503 }));
      } else {
        fetchStub.rejects(new TypeError('Network unavailable'));
      }
      const block = document.querySelector('.include-caas');
      const heading = block.querySelector('h2');
      const link = block.querySelector('a');
      await init(block);

      expect(block.querySelector('h2') === heading).to.be.true;
      expect(block.querySelector('li > a') === link).to.be.true;
      expect([...block.querySelectorAll('.tag-cta-tag')].map((pill) => ({ title: pill.textContent, type: pill.tagName }))).to.deep.equal([{ title: 'GenStudio', type: 'SPAN' }]);
      if (failure === 'network error') {
        expect(window.lana.log.calledOnce).to.be.true;
        expect(window.lana.log.firstCall.args[0]).to.include('Network unavailable');
      }
    });
  });

  it('uses the final ID segment without requiring a taxonomy entry', async () => {
    getConfig().placeholders['not-a-real-topic'] = 'Custom topic';
    setMetadata('caas:topic/not-a-real-topic');
    const block = document.querySelector('.heading-only');
    await init(block);

    expect(block.querySelector('.tag-cta-tag').textContent).to.equal('Custom topic');
    expect(fetchStub.calledOnceWithExactly(`${getConfig().locale.contentRoot}/tag-cta.json`)).to.be.true;
    expect(window.lana.log.called).to.be.false;
  });

  it('skips tags with an empty final segment and leaves the heading without an empty list', async () => {
    setMetadata('caas:topic/');
    const block = document.querySelector('.heading-only');
    await init(block);

    expect(block.querySelectorAll('h2').length).to.equal(1);
    expect(block.querySelectorAll('ul').length).to.equal(0);
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.firstCall.args[0]).to.equal('Unknown or untitled tag: caas:topic/');
  });

  it('loads the registered block from Milo rather than the consumer code root', async () => {
    setConfig({ codeRoot: '/consumer', miloLibs: '/libs' });
    const block = document.querySelector('.tag-cta');
    await loadBlock(block);

    expect(block.dataset.blockStatus).to.equal('loaded');
    expect(block.querySelectorAll('li > a').length).to.equal(5);
  });

  [320, 768, 1520].forEach((width) => {
    it(`wraps long tags without horizontal overflow at ${width}px`, async () => {
      await setViewport({ width, height: 900 });
      const block = document.querySelector('.tag-cta');
      block.querySelector('a').textContent = 'A'.repeat(150);
      const row = block.lastElementChild.firstElementChild;
      for (let index = 0; index < 20; index += 1) {
        const extra = document.createElement('a');
        extra.href = `/resources/topic-${index}`;
        extra.textContent = `Related resource ${index}`;
        row.append(extra);
      }
      await init(block);

      const bounds = block.getBoundingClientRect();
      const links = [...block.querySelectorAll('li > a')];
      expect(bounds.width).to.be.at.most(800);
      expect(bounds.left).to.be.at.least(0);
      expect(bounds.right).to.be.at.most(width);
      expect(block.scrollWidth).to.be.at.most(block.clientWidth);
      expect(links.length).to.equal(25);
      links.forEach((tag) => {
        expect(tag.getBoundingClientRect().width).to.be.at.most(bounds.width);
        expect(getComputedStyle(tag).display).to.not.equal('none');
      });
      expect(new Set(links.map((tag) => tag.offsetTop)).size).to.be.greaterThan(2);
      if (width === 1520) expect(bounds.left).to.equal(360);
    });
  });
});
