import { setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const foundation = document.createElement('meta');
foundation.name = 'foundation';
foundation.content = 'c2';
document.head.append(foundation);
const { default: init } = await import('../../../libs/c2/blocks/hero-c2/hero-c2.js');
const { loadStyle, setConfig } = await import('../../../libs/utils/utils.js');

const FEDERAL_SVG = 'https://main--federal--adobecom.aem.page/federal/assets/svgs/photoshop.svg';
const IMAGE = '<picture><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""></picture>';
const ICON = '<picture><img src="/federal/assets/svgs/photoshop.svg" alt="" loading="lazy" style="display: none"></picture>';
const COPY = `<p>${ICON} Photoshop</p><h1>Heading</h1><p>Body</p>`;
const BUTTONS = '<p><em><a href="/one">One</a></em> <strong><a href="/two">Two</a></strong></p>';

const row = (...cells) => `<div>${cells.map((cell) => `<div>${cell}</div>`).join('')}</div>`;

async function build(classes, ...rows) {
  document.body.innerHTML = `<div class="hero-c2 ${classes}">${rows.join('')}</div>`;
  const block = document.querySelector('.hero-c2');
  await init(block);
  return block;
}

describe('hero-c2', () => {
  before(() => {
    setConfig({ codeRoot: '/libs' });
    return Promise.all(['/libs/c2/styles/styles.css', '/libs/c2/blocks/hero-c2/hero-c2.css']
      .map((href) => new Promise((resolve) => { loadStyle(href, resolve); })));
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    await setViewport({ width: 800, height: 600 });
  });

  after(() => foundation.remove());

  describe('structure', () => {
    it('replaces the rows with an inner container holding content and media', async () => {
      const block = await build('', row(COPY, IMAGE), row('', IMAGE), row('Footer'));
      expect(block.children.length).to.equal(1);
      const inner = block.firstElementChild;
      expect(inner.classList.contains('hero-c2-inner')).to.be.true;
      expect(inner.classList.contains('container')).to.be.true;
      expect([...inner.children].map((el) => el.className))
        .to.deep.equal(['hero-c2-content', 'hero-c2-media']);
    });

    it('puts the heading before the eyebrow and resolves the eyebrow icon URL', async () => {
      const block = await build('', row(COPY, ''));
      const header = block.querySelector('.hero-c2-header');
      const heading = header.querySelector('h1');
      expect(header.firstElementChild).to.equal(heading);
      expect(heading.nextElementSibling.classList.contains('eyebrow')).to.be.true;
      expect(block.querySelector('.eyebrow img').getAttribute('src')).to.equal(FEDERAL_SVG);
    });
  });

  describe('background and foreground', () => {
    it('uses an image cell as the background and a second-row image as the foreground', async () => {
      const block = await build('', row(COPY, IMAGE), row('', IMAGE));
      const media = block.querySelector('.hero-c2-media');
      expect(media.children[0].classList.contains('hero-c2-bg')).to.be.true;
      expect(media.children[0].querySelector('img')).to.exist;
      expect(media.children[1].classList.contains('hero-c2-fg')).to.be.true;
    });

    it('turns plain text into a CSS background', async () => {
      const block = await build('', row(COPY, 'linear-gradient(red, blue)'));
      const bg = block.querySelector('.hero-c2-bg');
      expect(bg.style.background).to.contain('linear-gradient');
      expect(bg.querySelector('img')).to.be.null;
    });

    it('omits the background and foreground when their cells are empty', async () => {
      const block = await build('', row(COPY, ''), row('', ''));
      const media = block.querySelector('.hero-c2-media');
      expect(media.querySelector('.hero-c2-bg')).to.be.null;
      expect(media.querySelector('.hero-c2-fg')).to.be.null;
    });

    it('removes decorative videos from the tab order', async () => {
      const block = await build('', row(COPY, ''), row('', '<video></video>'));
      expect(block.querySelector('video').getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('footer', () => {
    it('adds the footer as a caption after the widget', async () => {
      const block = await build('', row(COPY, ''), row(BUTTONS, ''), row('Footer text'));
      const content = block.querySelector('.hero-c2-content');
      const footer = content.lastElementChild;
      expect(footer.classList.contains('hero-c2-footer')).to.be.true;
      expect(footer.classList.contains('caption')).to.be.true;
      expect(footer.previousElementSibling.classList.contains('hero-c2-widget')).to.be.true;
    });

    it('omits the footer when empty', async () => {
      const block = await build('', row(COPY, ''), row(BUTTONS, ''), row('', ''));
      expect(block.querySelector('.hero-c2-footer')).to.be.null;
    });
  });

  describe('plain widget', () => {
    it('keeps the foreground out of the buttons\' supplemental text', async () => {
      const block = await build('', row(COPY, ''), row(BUTTONS, IMAGE));
      const fg = block.querySelector('.hero-c2-fg');
      expect(fg.classList.contains('supplemental-text')).to.be.false;
      expect(fg.classList.contains('body-xl')).to.be.false;
    });

    it('omits the widget when its cell is empty', async () => {
      const block = await build('', row(COPY, ''), row('', IMAGE));
      expect(block.querySelector('.hero-c2-widget')).to.be.null;
    });

    it('does not load merch code or styles', async () => {
      await build('', row(COPY, ''), row(BUTTONS, ''));
      expect(document.querySelector('link[href*="merch-widget"]')).to.be.null;
    });
  });

  describe('event widget', () => {
    const EVENT = '<p><strong>March 22</strong></p><p>Pre-conference</p><p><strong>March 23-25</strong></p><p>Las Vegas</p>';

    it('groups each bold date with the details after it', async () => {
      const block = await build('event', row(COPY, ''), row(EVENT + BUTTONS, ''));
      const dates = [...block.querySelectorAll('.hero-c2-event-date')];
      expect(dates.map((date) => date.textContent.trim())).to.deep.equal([
        'March 22Pre-conference',
        'March 23-25Las Vegas',
      ]);
      expect(dates[0].firstElementChild.textContent).to.equal('March 22');
    });

    it('keeps the buttons after the dates, outside them', async () => {
      const block = await build('event', row(COPY, ''), row(EVENT + BUTTONS, ''));
      const widget = block.querySelector('.hero-c2-widget');
      expect(widget.classList.contains('hero-c2-event')).to.be.true;
      expect(widget.firstElementChild.classList.contains('hero-c2-event-dates')).to.be.true;
      expect(widget.lastElementChild.classList.contains('action-area')).to.be.true;
      expect(widget.querySelectorAll('.hero-c2-event-dates .con-button').length).to.equal(0);
    });
  });

  describe('merch widget', () => {
    const MERCH = '<p><mas-field field="description"></mas-field></p>';

    it('builds the shared merch widget and loads its stylesheet', async () => {
      const block = await build('merch', row(COPY, ''), row(MERCH + BUTTONS, ''));
      const widget = block.querySelector('.hero-c2-widget');
      expect(widget.classList.contains('merch-widget-c2')).to.be.true;
      expect(widget.querySelector('.merch-widget-content')).to.exist;
      expect(document.querySelector('link[href*="merch-widget.css"]')).to.exist;
    });

    it('applies block-level text overrides to the widget content', async () => {
      const block = await build('merch body-lg', row(COPY, ''), row(MERCH, ''));
      const description = block.querySelector('.merch-widget-content > div');
      expect(description.classList.contains('body-lg')).to.be.true;
      expect(description.classList.contains('body-md')).to.be.false;
    });
  });

  describe('layout', () => {
    it('gives the content five columns by default and the variants their own count', async () => {
      await setViewport({ width: 1280, height: 800 });
      const span = async (classes) => {
        const block = await build(classes, row(COPY, ''));
        return getComputedStyle(block.querySelector('.hero-c2-content')).gridColumnEnd;
      };
      expect(await span('')).to.equal('span 5');
      expect(await span('narrow-content')).to.equal('span 4');
      expect(await span('wide-content')).to.equal('span 6');
    });

    it('places the foreground per axis', async () => {
      await setViewport({ width: 1280, height: 800 });
      const placement = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE), row('', IMAGE));
        const { alignSelf, justifySelf } = getComputedStyle(block.querySelector('.hero-c2-fg'));
        return [alignSelf, justifySelf];
      };
      expect(await placement('fg-v-start fg-h-end')).to.deep.equal(['start', 'end']);
      expect(await placement('fg-v-end fg-h-start')).to.deep.equal(['end', 'start']);
    });

    it('frames the background only in the glassy variant', async () => {
      await setViewport({ width: 1280, height: 800 });
      const shadow = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE));
        return getComputedStyle(block.querySelector('.hero-c2-bg')).boxShadow;
      };
      expect(await shadow('')).to.equal('none');
      expect(await shadow('glassy')).to.not.equal('none');
    });

    it('sizes the foreground as a share of the media area', async () => {
      await setViewport({ width: 1280, height: 800 });
      const share = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE), row('', IMAGE));
        const media = block.querySelector('.hero-c2-media').getBoundingClientRect().width;
        return Math.round((100 * block.querySelector('.hero-c2-fg').getBoundingClientRect().width) / media);
      };
      expect(await share('')).to.equal(33);
      expect(await share('wide-fg')).to.equal(50);
      expect(await share('extra-wide-fg')).to.equal(75);
      expect(await share('full-fg')).to.equal(100);
    });

    it('keeps a tall foreground from growing the media area', async () => {
      await setViewport({ width: 1280, height: 800 });
      const TALL = '<picture><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" style="aspect-ratio: 1 / 4"></picture>';
      const heights = async (classes, fg) => {
        const block = await build(classes, row(COPY, IMAGE), row('', fg));
        const media = block.querySelector('.hero-c2-media').getBoundingClientRect().height;
        return [media, block.querySelector('.hero-c2-fg').getBoundingClientRect().height];
      };
      const [plain] = await heights('', IMAGE);
      const [media, fg] = await heights('full-fg', TALL);
      expect(media).to.equal(plain);
      expect(fg).to.be.at.most(media);
    });
  });
});
