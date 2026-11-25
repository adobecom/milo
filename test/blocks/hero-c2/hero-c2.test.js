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
    it('replaces the rows with an inner container holding content and media area', async () => {
      const block = await build('', row(COPY, IMAGE), row('', IMAGE), row('Footer'));
      expect(block.children.length).to.equal(1);
      const inner = block.firstElementChild;
      expect(inner.classList.contains('hero-c2-inner')).to.be.true;
      expect(inner.classList.contains('container')).to.be.true;
      expect([...inner.children].map((el) => el.className))
        .to.deep.equal(['hero-c2-content', 'hero-c2-media-area']);
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

  describe('media-bg and media', () => {
    it('uses an image cell as the media-bg and a second-row image as the media', async () => {
      const block = await build('', row(COPY, IMAGE), row('', IMAGE));
      const mediaArea = block.querySelector('.hero-c2-media-area');
      expect(mediaArea.children[0].classList.contains('hero-c2-media-bg')).to.be.true;
      expect(mediaArea.children[0].querySelector('img')).to.exist;
      expect(mediaArea.children[1].classList.contains('hero-c2-media')).to.be.true;
    });

    it('turns plain text into a CSS background', async () => {
      const block = await build('', row(COPY, 'linear-gradient(red, blue)'));
      const mediaBg = block.querySelector('.hero-c2-media-bg');
      expect(mediaBg.style.background).to.contain('linear-gradient');
      expect(mediaBg.querySelector('img')).to.be.null;
    });

    it('omits the media-bg and media when their cells are empty', async () => {
      const block = await build('', row(COPY, ''), row('', ''));
      const mediaArea = block.querySelector('.hero-c2-media-area');
      expect(mediaArea.querySelector('.hero-c2-media-bg')).to.be.null;
      expect(mediaArea.querySelector('.hero-c2-media')).to.be.null;
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

  describe('+++ dividers', () => {
    const LEFT = `${COPY}<p>+++</p>${BUTTONS}<p>+++</p><p>Footer text</p>`;

    it('splits the left cell into message, widget and footer', async () => {
      const block = await build('', row(LEFT, ''), row(IMAGE));
      const content = block.querySelector('.hero-c2-content');
      expect(content.querySelector('.hero-c2-header')).to.exist;
      expect(content.querySelector('.hero-c2-widget .action-area')).to.exist;
      expect(content.querySelector('.hero-c2-footer').textContent).to.equal('Footer text');
      expect(content.textContent).to.not.contain('+++');
      expect(block.querySelector('.hero-c2-media')).to.exist;
    });

    it('reads the media from the last cell of the second row', async () => {
      const block = await build('', row(LEFT, ''), row('', IMAGE));
      expect(block.querySelector('.hero-c2-media picture')).to.exist;
      expect(block.querySelector('.hero-c2-widget picture')).to.be.null;
    });

    it('recognises a divider wrapped in formatting', async () => {
      const block = await build('', row(`${COPY}<p><strong>+++</strong></p>${BUTTONS}`, ''), row(IMAGE));
      expect(block.querySelector('.hero-c2-widget .action-area')).to.exist;
      expect(block.textContent).to.not.contain('+++');
    });

    it('allows a message only, with no dividers', async () => {
      const block = await build('', row(COPY, ''), row('', IMAGE));
      expect(block.querySelector('.hero-c2-header')).to.exist;
      expect(block.querySelector('.hero-c2-widget')).to.be.null;
      expect(block.querySelector('.hero-c2-footer')).to.be.null;
    });

    it('allows a footer without a widget', async () => {
      const block = await build('', row(`${COPY}<p>+++</p><p>+++</p><p>Footer text</p>`, ''), row(IMAGE));
      expect(block.querySelector('.hero-c2-widget')).to.be.null;
      expect(block.querySelector('.hero-c2-footer').textContent).to.equal('Footer text');
    });

    it('allows a widget without a footer', async () => {
      const block = await build('', row(`${COPY}<p>+++</p>${BUTTONS}`, ''), row(IMAGE));
      expect(block.querySelector('.hero-c2-widget')).to.exist;
      expect(block.querySelector('.hero-c2-footer')).to.be.null;
    });
  });

  describe('plain widget', () => {
    it('keeps the media out of the buttons\' supplemental text', async () => {
      const block = await build('', row(COPY, ''), row(BUTTONS, IMAGE));
      const media = block.querySelector('.hero-c2-media');
      expect(media.classList.contains('supplemental-text')).to.be.false;
      expect(media.classList.contains('body-xl')).to.be.false;
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
      expect(await span('content-narrow')).to.equal('span 4');
      expect(await span('content-wide')).to.equal('span 6');
    });

    it('places the media per axis', async () => {
      await setViewport({ width: 1280, height: 800 });
      const placement = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE), row('', IMAGE));
        const { alignSelf, justifySelf } = getComputedStyle(block.querySelector('.hero-c2-media'));
        return [alignSelf, justifySelf];
      };
      expect(await placement('media-v-start media-h-end')).to.deep.equal(['start', 'end']);
      expect(await placement('media-v-end media-h-start')).to.deep.equal(['end', 'start']);
    });

    it('frames the background only in the glassy variant', async () => {
      await setViewport({ width: 1280, height: 800 });
      const shadow = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE));
        return getComputedStyle(block.querySelector('.hero-c2-media-bg')).boxShadow;
      };
      expect(await shadow('')).to.equal('none');
      expect(await shadow('glassy')).to.not.equal('none');
    });

    it('sizes the media as a share of the media area', async () => {
      await setViewport({ width: 1280, height: 800 });
      const share = async (classes) => {
        const block = await build(classes, row(COPY, IMAGE), row('', IMAGE));
        const mediaArea = block.querySelector('.hero-c2-media-area').getBoundingClientRect().width;
        return Math.round((100 * block.querySelector('.hero-c2-media').getBoundingClientRect().width) / mediaArea);
      };
      expect(await share('media-wide')).to.equal(50);
      expect(await share('media-xtra-wide')).to.equal(75);
      expect(await share('media-full')).to.equal(100);
    });

    it('keeps the media at least 250px wide, within the media area', async () => {
      const width = async () => {
        const block = await build('', row(COPY, IMAGE), row('', IMAGE));
        return block.querySelector('.hero-c2-media').getBoundingClientRect().width;
      };
      await setViewport({ width: 1280, height: 800 });
      expect(await width()).to.equal(250);
      await setViewport({ width: 320, height: 800 });
      const area = document.querySelector('.hero-c2-media-area').getBoundingClientRect().width;
      expect(area).to.be.below(250 / 0.33);
      expect(await width()).to.be.at.most(area);
    });

    it('keeps tall media from growing the media area', async () => {
      await setViewport({ width: 1280, height: 800 });
      const TALL = '<picture><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" style="aspect-ratio: 1 / 4"></picture>';
      const heights = async (classes, media) => {
        const block = await build(classes, row(COPY, IMAGE), row('', media));
        const mediaArea = block.querySelector('.hero-c2-media-area').getBoundingClientRect().height;
        return [mediaArea, block.querySelector('.hero-c2-media').getBoundingClientRect().height];
      };
      const [plain] = await heights('', IMAGE);
      const [mediaArea, media] = await heights('media-full', TALL);
      expect(mediaArea).to.equal(plain);
      expect(media).to.be.at.most(mediaArea);
    });
  });
});
