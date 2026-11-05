import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import fetchTags from '../../../tools/da/tag-browser/tag-utils.js';

describe('DA tag sheet', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => sinon.restore());

  it('turns sheets into groups without changing tag values or display labels', async () => {
    const data = {
      primaryProductName: { data: [{ name: 'analytics', title: 'Analytics' }] },
      'CaaS tags': { data: [{ name: 'caas:products/adobe-analytics', title: 'Products / Analytics' }] },
      Empty: { data: [] },
      ':names': ['primaryProductName', 'CaaS tags', 'Empty'],
      ':type': 'multi-sheet',
      ':version': 3,
    };
    fetchStub.resolves(new Response(JSON.stringify(data)));

    const groups = await fetchTags('/tags.json');

    expect(fetchStub.calledOnceWithExactly('/tags.json')).to.equal(true);
    expect(groups).to.deep.equal([
      {
        name: 'primaryProductName',
        title: 'primaryProductName',
        children: [{ name: 'analytics', title: 'Analytics', children: [] }],
      },
      {
        name: 'CaaS tags',
        title: 'CaaS tags',
        children: [{
          name: 'caas:products',
          title: 'caas:products',
          children: [{ name: 'caas:products/adobe-analytics', title: 'Products / Analytics', children: [] }],
        }],
      },
    ]);
  });

  it('shares slash-prefix groups recursively while retaining flat tags and source order', async () => {
    fetchStub.resolves(new Response(JSON.stringify({
      data: [
        { name: 'caas:topic/design/layout', title: 'Layout' },
        { name: 'flat', title: 'Flat / display only' },
        { name: 'caas:topic/design/color', title: 'Color' },
        { name: 'caas:topic/strategy', title: 'Strategy' },
        { name: 'caas:products/analytics', title: 'Analytics' },
      ],
    })));

    const groups = await fetchTags('/tags.json');

    expect(groups[0].children).to.deep.equal([
      {
        name: 'caas:topic',
        title: 'caas:topic',
        children: [
          {
            name: 'design',
            title: 'design',
            children: [
              { name: 'caas:topic/design/layout', title: 'Layout', children: [] },
              { name: 'caas:topic/design/color', title: 'Color', children: [] },
            ],
          },
          { name: 'caas:topic/strategy', title: 'Strategy', children: [] },
        ],
      },
      { name: 'flat', title: 'Flat / display only', children: [] },
      {
        name: 'caas:products',
        title: 'caas:products',
        children: [{ name: 'caas:products/analytics', title: 'Analytics', children: [] }],
      },
    ]);
  });

  it('keeps prefix-valued tags insertable and skips empty grouping segments without changing values', async () => {
    fetchStub.resolves(new Response(JSON.stringify({
      data: [
        { name: 'topic', title: 'Topic tag' },
        { name: 'topic/item', title: 'Topic item' },
        { name: '/topic//deep/item', title: 'Nested item' },
        { name: 'topic/', title: 'Trailing slash' },
      ],
    })));

    const groups = await fetchTags('/tags.json');

    expect(groups[0].children).to.deep.equal([
      { name: 'topic', title: 'Topic tag', children: [] },
      {
        name: 'topic',
        title: 'topic',
        children: [
          { name: 'topic/item', title: 'Topic item', children: [] },
          {
            name: 'deep',
            title: 'deep',
            children: [{ name: '/topic//deep/item', title: 'Nested item', children: [] }],
          },
          { name: 'topic/', title: 'Trailing slash', children: [] },
        ],
      },
    ]);
  });

  it('supports a single sheet and returns no groups for an empty sheet', async () => {
    fetchStub.onFirstCall().resolves(new Response(JSON.stringify({ data: [{ name: 'learn', title: 'Learn' }] })));
    fetchStub.onSecondCall().resolves(new Response(JSON.stringify({ data: [] })));

    const groups = await fetchTags('/single.json');
    expect(groups[0].title).to.equal('Tags');
    expect(groups[0].children[0].name).to.equal('learn');
    expect(await fetchTags('/empty.json')).to.deep.equal([]);
  });

  it('rejects failed requests and invalid JSON', async () => {
    fetchStub.onFirstCall().resolves(new Response('', { status: 404 }));
    fetchStub.onSecondCall().resolves(new Response('not json'));

    for (const url of ['/missing.json', '/invalid.json']) {
      const error = await fetchTags(url).then(() => null, (err) => err);
      expect(error).to.be.instanceOf(Error);
    }
  });
});
