import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/c2/blocks/pill-group/pill-group.js';

async function loadBlock(mock) {
  document.body.innerHTML = await readFile({ path: `./mocks/${mock}.html` });
  const block = document.querySelector('.pill-group');
  const links = [...block.querySelectorAll('a')];
  init(block);
  return { block, links };
}

describe('C2 pill group', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('replaces authored rows with a heading followed by a list', async () => {
    const { block } = await loadBlock('default');
    const [heading, list] = block.children;
    expect(block.children).to.have.length(2);
    expect(heading.tagName).to.equal('H2');
    expect(heading.classList.contains('heading-5')).to.be.true;
    expect(heading.textContent).to.equal('Explore by topic');
    expect(list.tagName).to.equal('UL');
    expect(heading.nextElementSibling).to.equal(list);
  });

  it('wraps each authored link in its own list item as a pill CTA', async () => {
    const { block, links } = await loadBlock('default');
    const items = [...block.querySelectorAll('ul > li')];
    expect(items).to.have.length(3);
    items.forEach((li, i) => {
      expect(li.children).to.have.length(1);
      expect(li.firstElementChild).to.equal(links[i]);
      expect(links[i].classList.contains('con-button')).to.be.true;
      expect(links[i].classList.contains('pill-group-cta')).to.be.true;
    });
    expect(items.map((li) => li.textContent)).to.deep.equal(['Photography', 'Video', 'Design']);
    expect(items.map((li) => li.firstElementChild.getAttribute('href')))
      .to.deep.equal(['/photo', '/video', '/design']);
    expect(block.querySelector('p')).to.be.null;
  });

  it('labels the list with the heading id', async () => {
    const { block } = await loadBlock('default');
    const list = block.querySelector('ul');
    expect(list.getAttribute('aria-labelledby')).to.equal('explore-by-topic');
    expect(block.querySelector(`#${list.getAttribute('aria-labelledby')}`))
      .to.equal(block.querySelector('h2'));
  });

  it('keeps a heading without an id but does not label the list', async () => {
    const { block } = await loadBlock('no-heading-id');
    const heading = block.querySelector('h3');
    expect(heading.classList.contains('heading-5')).to.be.true;
    expect(heading.nextElementSibling.tagName).to.equal('UL');
    expect(block.querySelector('ul').hasAttribute('aria-labelledby')).to.be.false;
    expect([...block.querySelectorAll('li a')].map((a) => a.textContent))
      .to.deep.equal(['Photoshop', 'Illustrator']);
  });

  it('renders only the list when no heading is authored', async () => {
    const { block } = await loadBlock('no-heading');
    expect(block.children).to.have.length(1);
    expect(block.firstElementChild.tagName).to.equal('UL');
    expect(block.querySelector('[class*="heading-"]')).to.be.null;
    expect(block.querySelector('ul').hasAttribute('aria-labelledby')).to.be.false;
    expect(block.querySelectorAll('li')).to.have.length(3);
  });

  it('collects links from every cell and keeps authored button styles', async () => {
    const { block } = await loadBlock('no-heading');
    const [plain, bold, italic] = [...block.querySelectorAll('li > a')];
    expect(plain.textContent).to.equal('Plain');
    expect(plain.className).to.equal('con-button pill-group-cta');
    expect(bold.classList.contains('con-button')).to.be.true;
    expect(bold.classList.contains('blue')).to.be.true;
    expect(bold.classList.contains('pill-group-cta')).to.be.false;
    expect(italic.classList.contains('con-button')).to.be.true;
    expect(italic.classList.contains('outline')).to.be.true;
    expect(italic.classList.contains('pill-group-cta')).to.be.false;
    expect(block.querySelector('strong, em')).to.be.null;
  });

  it('renders an empty labelled list when the links row has no links', async () => {
    const { block } = await loadBlock('no-links');
    const list = block.querySelector('ul');
    expect(block.children).to.have.length(2);
    expect(list.children).to.have.length(0);
    expect(list.getAttribute('aria-labelledby')).to.equal('coming-soon');
    expect(block.textContent).to.not.include('No topics yet.');
  });
});
