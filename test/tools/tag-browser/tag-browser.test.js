/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const source = await fetch('/tools/da/tag-browser/tag-selector.js').then((response) => response.text());
const moduleUrl = URL.createObjectURL(new Blob([
  source.replace(
    'https://da.live/nx/deps/lit/lit-core.min.js',
    `${window.location.origin}/libs/deps/lit-all.min.js`,
  ).replace(
    "import getStyle from 'https://da.live/nx/utils/styles.js';",
    'const getStyle = async () => new CSSStyleSheet();',
  ),
], { type: 'text/javascript' }));
await import(moduleUrl);
URL.revokeObjectURL(moduleUrl);

describe('DA tag selector insertion', () => {
  let browser;
  let sendText;
  let tags;

  beforeEach(async () => {
    tags = [
      { value: 'caas:products/analytics', title: 'Analytics', children: [] },
      { value: 'caas:products/photoshop', title: 'Photoshop', children: [] },
    ];
    sendText = sinon.stub();
    browser = document.createElement('da-tag-selector');
    browser.rootTags = [{ value: 'products', title: 'Products', children: tags }];
    browser.actions = { sendText };
    document.body.append(browser);
    await browser.updateComplete;
    await browser.updateComplete;
    browser.shadowRoot.querySelector('.tag-title').click();
    await browser.updateComplete;
  });

  afterEach(() => {
    browser.remove();
    sinon.restore();
  });

  it('inserts tag values without opening details, including consecutive inserts', async () => {
    const buttons = browser.shadowRoot.querySelectorAll('.tag-insert');
    buttons[0].click();
    await browser.updateComplete;
    buttons[1].click();
    await browser.updateComplete;

    expect(sendText.firstCall.args).to.deep.equal(['caas:products/analytics']);
    expect(sendText.secondCall.args).to.deep.equal([', caas:products/photoshop']);
    expect(browser.shadowRoot.querySelector('.tag-info-column')).to.equal(null);
    expect(browser.shadowRoot.querySelectorAll('.tag-group-column')).to.have.length(2);
  });

  it('keeps existing details unchanged when inserting a different tag', async () => {
    const titles = browser.shadowRoot.querySelectorAll('.tag-group-column')[1]
      .querySelectorAll('.tag-title');
    titles[0].click();
    await browser.updateComplete;
    browser.shadowRoot.querySelectorAll('.tag-insert')[1].click();
    await browser.updateComplete;

    expect(sendText.calledOnceWithExactly(tags[1].value)).to.equal(true);
    expect(browser.shadowRoot.querySelector('.tag-info').textContent).to.include(tags[0].value);
    expect(browser._activeTag).to.equal(tags[0]);
  });

  it('still opens details from the title and inserts from the details button', async () => {
    browser.shadowRoot.querySelectorAll('.tag-group-column')[1]
      .querySelector('.tag-title').click();
    await browser.updateComplete;
    browser.shadowRoot.querySelector('.tag-info-insert').click();
    await browser.updateComplete;

    expect(sendText.calledOnceWithExactly(tags[0].value)).to.equal(true);
    expect(browser.shadowRoot.querySelector('.tag-info-column')).not.to.equal(null);
  });

  it('does not insert a group', () => {
    browser.handleTagInsert(browser.rootTags[0]);
    expect(sendText.called).to.equal(false);
  });

  async function search(value) {
    const input = browser.shadowRoot.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await browser.updateComplete;
  }

  it('keeps comma-separated inserts when returning from search details', async () => {
    await search('caas:products');
    for (const tag of tags) {
      const title = [...browser.shadowRoot.querySelectorAll('.tag-title')]
        .find((button) => button.textContent.trim() === tag.title);
      title.focus();
      title.click();
      await browser.updateComplete;
      const insert = browser.shadowRoot.querySelector('.tag-info-insert');
      insert.focus();
      insert.click();
      const back = browser.shadowRoot.querySelector('.tag-back');
      back.focus();
      back.click();
      await browser.updateComplete;
    }

    expect(sendText.firstCall.args).to.deep.equal([tags[0].value]);
    expect(sendText.secondCall.args).to.deep.equal([`, ${tags[1].value}`]);
  });

  it('finds matching tags at every level across groups, including tag values', async () => {
    browser.rootTags = [
      { value: 'root-match', title: 'Matching root', children: [] },
      {
        value: 'first',
        title: 'First group',
        children: [{
          value: 'nested',
          title: 'Nested group',
          children: [{ value: 'deep', title: 'Matching deep tag', children: [] }],
        }],
      },
      {
        value: 'second',
        title: 'Second group',
        children: [
          { value: 'matching-value', title: 'Different title', children: [] },
          { value: 'other', title: 'Unrelated tag', children: [] },
        ],
      },
    ];
    await browser.updateComplete;
    await browser.updateComplete;
    await search('MATCHING');

    expect([...browser.shadowRoot.querySelectorAll('.tag-title')]
      .map((tag) => tag.textContent.trim()))
      .to.deep.equal(['Matching root', 'Matching deep tag', 'Different title']);
    expect(browser.shadowRoot.querySelectorAll('.tag-group-column')).to.have.length(1);
    expect(browser.shadowRoot.querySelectorAll('.tag-insert')).to.have.length(3);
    expect(browser.shadowRoot.querySelector('.tag-back')).to.equal(null);
  });

  it('searches outside the selected group and supports result details and insertion', async () => {
    const otherTag = { value: 'other/illustrator', title: 'Illustrator', children: [] };
    browser.rootTags = [
      ...browser.rootTags,
      { value: 'other', title: 'Other group', children: [otherTag] },
    ];
    await browser.updateComplete;
    await browser.updateComplete;
    browser.shadowRoot.querySelector('.tag-title').click();
    await browser.updateComplete;
    await search('illustrator');
    browser.shadowRoot.querySelector('.tag-insert').click();
    expect(sendText.calledOnceWithExactly(otherTag.value)).to.equal(true);

    browser.shadowRoot.querySelector('.tag-title').click();
    await browser.updateComplete;
    expect(browser.shadowRoot.querySelector('.tag-info').textContent).to.include(otherTag.value);
    expect(browser.shadowRoot.querySelectorAll('.tag-group-column:not(.tag-info-column)'))
      .to.have.length(1);

    await search('');
    expect(browser.shadowRoot.querySelectorAll('.tag-group-column')).to.have.length(2);
    expect(browser.shadowRoot.querySelector('.tag-info')).to.equal(null);
    expect([...browser.shadowRoot.querySelectorAll('.tag-group-column')[1]
      .querySelectorAll('.tag-title')].map((tag) => tag.textContent.trim()))
      .to.deep.equal(['Analytics', 'Photoshop']);
  });

  it('returns from search details without clearing the query or changing the browsing path', async () => {
    browser.handleBackClick();
    await browser.updateComplete;

    for (const navigate of [false, true]) {
      if (navigate) {
        browser.shadowRoot.querySelector('.tag-title').click();
        await browser.updateComplete;
      }
      const path = browser._tags;
      await search('photo');
      browser.shadowRoot.querySelector('.tag-title').click();
      await browser.updateComplete;
      expect(browser.shadowRoot.querySelector('.tag-info')).not.to.equal(null);

      browser.shadowRoot.querySelector('.tag-back').click();
      await browser.updateComplete;
      expect(browser.shadowRoot.querySelector('.tag-info')).to.equal(null);
      expect(browser.shadowRoot.querySelector('input').value).to.equal('photo');
      expect(browser.shadowRoot.querySelector('.tag-title').textContent.trim()).to.equal('Photoshop');
      expect(browser.shadowRoot.querySelector('.tag-back')).to.equal(null);
      expect(browser._tags).to.equal(path);
      await search('');
    }
  });

  it('shows no unrelated groups when there are no matches', async () => {
    await search('no matching tags');
    expect(browser.shadowRoot.querySelectorAll('.tag-title')).to.have.length(0);
    expect(browser.shadowRoot.querySelector('.tag-info')).to.equal(null);
  });
});
