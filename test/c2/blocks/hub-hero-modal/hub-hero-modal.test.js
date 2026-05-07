import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../../libs/c2/blocks/hub-hero-modal/hub-hero-modal.js');

describe('hub-hero-modal', () => {
  const el = document.querySelector('.hub-hero-modal');
  init(el);

  it('renders three sections', () => {
    expect(el.querySelectorAll('.hub-hero-modal-section').length).to.equal(3);
  });

  it('renders a counter in each section', () => {
    expect(el.querySelectorAll('.hub-hero-modal-counter').length).to.equal(3);
  });

  it('counter text shows correct X/Y position', () => {
    const counters = el.querySelectorAll('.hub-hero-modal-counter');
    expect(counters[0].textContent).to.equal('( 1/3 )');
    expect(counters[1].textContent).to.equal('( 2/3 )');
    expect(counters[2].textContent).to.equal('( 3/3 )');
  });

  it('last section content area is the target of the center-alignment Z-pattern rule', () => {
    const sections = el.querySelectorAll('.hub-hero-modal-section');
    const lastSection = sections[sections.length - 1];
    const lastContent = lastSection.querySelector('.hub-hero-modal-content');
    // CSS rule: section.hub-hero-modal-section:last-of-type .hub-hero-modal-content { text-align: center }
    // Applied via stylesheet; unit tests cannot inspect computed style without CSSOM.
    // We verify the element is structurally in the correct position for the rule to fire.
    expect(lastContent).to.exist;
    expect(lastSection.tagName.toLowerCase()).to.equal('section');
  });

  it('each section has a content and media area', () => {
    el.querySelectorAll('.hub-hero-modal-section').forEach((section) => {
      expect(section.querySelector('.hub-hero-modal-content')).to.exist;
      expect(section.querySelector('.hub-hero-modal-media')).to.exist;
    });
  });

  it('counter is the first child of the content area', () => {
    el.querySelectorAll('.hub-hero-modal-content').forEach((content) => {
      expect(content.firstElementChild.classList.contains('hub-hero-modal-counter')).to.be.true;
    });
  });

  it('places a single sticky CTA at modal level, outside all sections', () => {
    // One CTA appended directly to the block, not inside any section
    const cta = el.querySelector('.hub-hero-modal-cta');
    expect(cta).to.exist;
    expect(cta.querySelector('a')).to.exist;
    // CTA must not be a descendant of any section
    expect(el.querySelector('.hub-hero-modal-section .hub-hero-modal-cta')).to.not.exist;
  });

  it('CTA is the last child of the block element', () => {
    expect(el.querySelector('.hub-hero-modal-cta')).to.equal(el.lastElementChild);
  });

  it('content area contains no CTA link after init', () => {
    el.querySelectorAll('.hub-hero-modal-content').forEach((content) => {
      expect(content.querySelector('a')).to.not.exist;
    });
  });

  it('strips heading and .eyebrow class from section rows that contain a heading', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div><p>Header eyebrow</p><h2>Modal Title</h2></div>
          <div></div>
        </div>
        <div>
          <div><p>Label</p><h3>Section heading</h3><p>Body copy.</p></div>
          <div><picture><img src="s.jpg" alt="s"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const eyebrowEl = wrapper.querySelector('.hub-hero-modal');
    init(eyebrowEl);

    const content = eyebrowEl.querySelector('.hub-hero-modal-content');
    // Heading stripped
    expect(content.querySelector('h1, h2, h3, h4, h5, h6')).to.not.exist;
    // .eyebrow class removed from the paragraph that preceded the heading
    expect(content.querySelector('.eyebrow')).to.not.exist;
    wrapper.remove();
  });

  it('does not promote CTA when only section rows beyond the first have a CTA', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div><p>Eyebrow</p><h2>Title</h2></div>
          <div></div>
        </div>
        <div>
          <div><p>Section 1 body only, no CTA.</p></div>
          <div><picture><img src="a.jpg" alt="a"></picture></div>
        </div>
        <div>
          <div><p>Section 2 body.</p><p><a href="https://adobe.com/two">CTA two</a></p></div>
          <div><picture><img src="b.jpg" alt="b"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const lateCtaEl = wrapper.querySelector('.hub-hero-modal');
    init(lateCtaEl);

    // Row 1 has no CTA → modalCta is null → no .hub-hero-modal-cta rendered
    expect(lateCtaEl.querySelector('.hub-hero-modal-cta')).to.not.exist;
    // Row 2's CTA is stripped — no links in any content area
    lateCtaEl.querySelectorAll('.hub-hero-modal-content').forEach((content) => {
      expect(content.querySelector('a')).to.not.exist;
    });
    wrapper.remove();
  });

  it('strips CTA links from section rows beyond the first', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div><p>Eyebrow</p><h2>Title</h2></div>
          <div></div>
        </div>
        <div>
          <div><p>Section 1 body.</p><p><a href="https://adobe.com/one">CTA one</a></p></div>
          <div><picture><img src="a.jpg" alt="a"></picture></div>
        </div>
        <div>
          <div><p>Section 2 body.</p><p><a href="https://adobe.com/two">CTA two</a></p></div>
          <div><picture><img src="b.jpg" alt="b"></picture></div>
        </div>
        <div>
          <div><p>Section 3 body.</p><p><a href="https://adobe.com/three">CTA three</a></p></div>
          <div><picture><img src="c.jpg" alt="c"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const multiCtaEl = wrapper.querySelector('.hub-hero-modal');
    init(multiCtaEl);

    // Only one modal-level CTA from row 1
    expect(multiCtaEl.querySelectorAll('.hub-hero-modal-cta').length).to.equal(1);
    // No links inside any section content area
    multiCtaEl.querySelectorAll('.hub-hero-modal-content').forEach((content) => {
      expect(content.querySelector('a')).to.not.exist;
    });
    wrapper.remove();
  });

  it('does not render carousel navigation buttons', () => {
    expect(el.querySelector('.hub-hero-modal-prev')).to.not.exist;
    expect(el.querySelector('.hub-hero-modal-next')).to.not.exist;
  });

  it('sections use semantic <section> elements with aria-label', () => {
    el.querySelectorAll('.hub-hero-modal-section').forEach((section, i) => {
      expect(section.tagName.toLowerCase()).to.equal('section');
      expect(section.getAttribute('aria-label')).to.equal(`Section ${i + 1} of 3`);
    });
  });

  it('sets daa-lh analytics attribute on the block', () => {
    expect(el.getAttribute('daa-lh')).to.equal('hub-hero-modal');
  });

  it('no heading elements appear inside section content areas', () => {
    el.querySelectorAll('.hub-hero-modal-content').forEach((content) => {
      expect(content.querySelector('h1, h2, h3, h4, h5, h6')).to.not.exist;
    });
  });

  it('extracts row 0 (eyebrow + heading) into a modal title element', () => {
    const title = el.querySelector('.hub-hero-modal-title');
    expect(title).to.exist;
    expect(title.querySelector('h2')).to.exist;
    expect(title.querySelector('h2').textContent).to.equal('Close more deals.');
    // Heading must not appear inside any section
    el.querySelectorAll('.hub-hero-modal-section').forEach((section) => {
      expect(section.querySelector('h1, h2, h3, h4, h5, h6')).to.not.exist;
    });
  });

  it('renders no modal title element when header row has no content', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div></div>
          <div></div>
        </div>
        <div>
          <div><p>Paragraph only, no heading.</p></div>
          <div><picture><img src="c.jpg" alt="c"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const noHeadingEl = wrapper.querySelector('.hub-hero-modal');
    init(noHeadingEl);

    expect(noHeadingEl.querySelector('.hub-hero-modal-title')).to.not.exist;
    wrapper.remove();
  });

  it('gracefully handles a section row with no CTA link', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div><p>Eyebrow</p><h2>Title</h2></div>
          <div></div>
        </div>
        <div>
          <div><p>Body text only, no CTA.</p></div>
          <div><picture><img src="x.jpg" alt="x"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const noCtaEl = wrapper.querySelector('.hub-hero-modal');
    init(noCtaEl);

    const section = noCtaEl.querySelector('.hub-hero-modal-section');
    expect(section).to.exist;
    expect(noCtaEl.querySelector('.hub-hero-modal-cta')).to.not.exist;
    wrapper.remove();
  });

  it('extracts heading from header row, not from section rows', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="hub-hero-modal">
        <div>
          <div><p>Eyebrow</p><h2>Modal Headline</h2></div>
          <div></div>
        </div>
        <div>
          <div><p>First section body.</p><p><a href="https://adobe.com">CTA</a></p></div>
          <div><picture><img src="a.jpg" alt="a"></picture></div>
        </div>
        <div>
          <div><p>Second section body.</p></div>
          <div><picture><img src="b.jpg" alt="b"></picture></div>
        </div>
      </div>`;
    document.body.append(wrapper);
    const titleEl = wrapper.querySelector('.hub-hero-modal');
    init(titleEl);

    const title = titleEl.querySelector('.hub-hero-modal-title');
    expect(title).to.exist;
    expect(title.querySelector('h2').textContent).to.equal('Modal Headline');
    // Heading must not appear inside any section
    titleEl.querySelectorAll('.hub-hero-modal-section').forEach((section) => {
      expect(section.querySelector('h1, h2, h3, h4, h5, h6')).to.not.exist;
    });
    // CTA placed at modal level, not inside sections
    const cta = titleEl.querySelector('.hub-hero-modal-cta');
    expect(cta).to.exist;
    expect(titleEl.querySelector('.hub-hero-modal-section .hub-hero-modal-cta')).to.not.exist;
    wrapper.remove();
  });
});
