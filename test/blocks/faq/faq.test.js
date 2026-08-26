import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/faq/faq.js';

const removeLd = () => document.head
  .querySelectorAll('script[type="application/ld+json"]')
  .forEach((s) => s.remove());

describe('FAQ', () => {
  afterEach(removeLd);

  it('builds one accordion item per question row inside a faq-list', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    const list = block.querySelector(':scope > .faq-list.foreground');
    expect(list).to.exist;
    const items = list.querySelectorAll(':scope > details.faq-item');
    expect(items.length).to.equal(3);
  });

  it('opens the first item and leaves the rest closed', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    const items = [...block.querySelectorAll('.faq-item')];
    expect(items[0].hasAttribute('open')).to.be.true;
    expect(items[1].hasAttribute('open')).to.be.false;

    const triggers = block.querySelectorAll('.faq-trigger');
    expect(triggers[0].getAttribute('aria-expanded')).to.equal('true');
    expect(triggers[1].getAttribute('aria-expanded')).to.equal('false');
  });

  it('lays out each item as trigger (question + icon) and panel (answer)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    const item = block.querySelector('.faq-item');
    const trigger = item.querySelector(':scope > summary.faq-trigger');
    expect(trigger).to.exist;

    const question = trigger.querySelector('.faq-question');
    expect(question.tagName).to.equal('H3');
    expect(question.classList.contains('heading-5')).to.be.true;
    expect(question.textContent.trim()).to.equal('What is your refund policy?');
    expect(trigger.querySelector('.faq-icon[aria-hidden="true"]')).to.exist;

    const panel = item.querySelector(':scope > .faq-panel.body-md');
    expect(panel).to.exist;
    expect(panel.querySelector('.faq-panel-inner p').textContent.trim())
      .to.equal('You can request a refund within 30 days.');

    // second item keeps both answer paragraphs
    const secondPanel = block.querySelectorAll('.faq-item')[1].querySelector('.faq-panel-inner');
    expect(secondPanel.querySelectorAll('p').length).to.equal(2);
  });

  it('sets analytics labels with open/close prefix and index', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    const triggers = block.querySelectorAll('.faq-trigger');
    // first is open on load, so its label is prefixed close- (the action if clicked)
    expect(triggers[0].getAttribute('daa-ll')).to.match(/^close-1--/);
    expect(triggers[1].getAttribute('daa-ll')).to.match(/^open-2--/);
  });

  it('skips rows that have no heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/mixed.html' });
    const block = document.querySelector('.faq');
    init(block);

    expect(block.querySelectorAll('.faq-item').length).to.equal(1);
    expect(block.querySelector('.faq-question').textContent.trim()).to.equal('A real question?');
  });

  it('builds an empty list when no row has a heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-headings.html' });
    const block = document.querySelector('.faq');
    init(block);

    const list = block.querySelector(':scope > .faq-list');
    expect(list).to.exist;
    expect(list.querySelectorAll('.faq-item').length).to.equal(0);
  });

  it('updates aria-expanded and the analytics prefix on toggle', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    const first = block.querySelector('.faq-item');
    const trigger = first.querySelector('.faq-trigger');

    // close the initially-open first item
    first.open = false;
    first.dispatchEvent(new Event('toggle'));
    expect(trigger.getAttribute('aria-expanded')).to.equal('false');
    expect(trigger.getAttribute('daa-ll')).to.match(/^open-1--/);

    // reopen it
    first.open = true;
    first.dispatchEvent(new Event('toggle'));
    expect(trigger.getAttribute('aria-expanded')).to.equal('true');
    expect(trigger.getAttribute('daa-ll')).to.match(/^close-1--/);
  });

  it('tags each item with the entry-animation classes', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.faq');
    init(block);

    block.querySelectorAll('.faq-item').forEach((item) => {
      expect(item.classList.contains('parallax-move-up')).to.be.true;
      expect(item.classList.contains('parallax-opacity')).to.be.true;
    });
  });

  describe('SEO variant', () => {
    it('appends an FAQPage ld+json schema when the block is .seo', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/seo.html' });
      init(document.querySelector('.faq'));

      const ld = document.head.querySelector('script[type="application/ld+json"]');
      expect(ld).to.exist;
      const schema = JSON.parse(ld.textContent);
      expect(schema['@type']).to.equal('FAQPage');
      expect(schema.mainEntity).to.have.length(2);
      expect(schema.mainEntity[0]['@type']).to.equal('Question');
      expect(schema.mainEntity[0].name).to.equal('What is your refund policy?');
      expect(schema.mainEntity[0].acceptedAnswer.text).to.contain('30 days');
    });

    it('does not append a schema for a non-seo block', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      init(document.querySelector('.faq'));
      expect(document.head.querySelector('script[type="application/ld+json"]')).to.be.null;
    });

    // Guards the shared module-level SEO_SCHEMA singleton: each .seo block must emit
    // a schema built from only its own questions, with no state leaking between inits.
    it('emits an independent schema per block for multiple seo blocks', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/seo-multi.html' });
      [...document.querySelectorAll('.faq.seo')].forEach((block) => init(block));

      const schemas = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
        .map((s) => JSON.parse(s.textContent));
      expect(schemas).to.have.length(2);

      // first block (2 questions) and second block (3 questions) stay independent
      expect(schemas[0].mainEntity).to.have.length(2);
      expect(schemas[0].mainEntity[0].name).to.equal('Alpha question one?');
      expect(schemas[1].mainEntity).to.have.length(3);
      expect(schemas[1].mainEntity[0].name).to.equal('Beta question one?');
      expect(schemas[1].mainEntity.every((q) => q.name.startsWith('Beta'))).to.be.true;
    });
  });

  describe('security', () => {
    // Regression guard: authored answer text must stay inert inside the ld+json <script>
    // and never break out via a literal </script> sequence.
    it('keeps the ld+json payload inert (no </script> breakout)', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/seo-xss.html' });
      init(document.querySelector('.faq'));

      const ld = document.head.querySelector('script[type="application/ld+json"]');
      expect(ld).to.exist;
      expect(ld.childElementCount, 'nothing should break out into the script').to.equal(0);
      expect(document.querySelector('img'), 'no element should be injected').to.be.null;
      const schema = JSON.parse(ld.textContent); // intact / not truncated at </script>
      expect(schema.mainEntity).to.have.length(2);
    });
  });
});
