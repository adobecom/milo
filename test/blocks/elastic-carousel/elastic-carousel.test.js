import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import init from '../../../libs/c2/blocks/elastic-carousel/elastic-carousel.js';

describe('Elastic Carousel', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir');
  });

  it('wraps slides in a carousel container and sets carousel dataset roles', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const container = block.querySelector('.elastic-carousel-container');
    expect(container).to.exist;
    expect(container.querySelectorAll('.elastic-carousel-item').length).to.equal(2);

    expect(block.dataset.role).to.equal('group');
    expect(block.dataset.ariaRoledescription).to.equal('carousel');
    expect(block.dataset.ariaRole).to.equal('group');
    expect(block.dataset.ariaLabel).to.equal('My Carousel');
  });

  it('builds each slide as an anchor with link, index and accessibility attributes', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const slide = block.querySelector('.elastic-carousel-item');
    expect(slide.tagName).to.equal('A');
    expect(slide.getAttribute('href')).to.equal('https://www.adobe.com/one');
    expect(slide.getAttribute('role')).to.equal('link');
    expect(slide.getAttribute('data-index')).to.equal('1');
    expect(slide.getAttribute('aria-describedby')).to.equal('elastic-carousel-slide-1');
    expect(slide.getAttribute('daa-ll')).to.equal('Learn more-1--Slide one heading');
  });

  it('lays out the header, media and footer regions inside the slide', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const slide = block.querySelector('.elastic-carousel-item');
    const inner = slide.querySelector('.elastic-carousel-item-container');
    expect(inner.id).to.equal('elastic-carousel-slide-1');

    const header = slide.querySelector('.elastic-carousel-item-header');
    expect(header.querySelector('img')).to.exist;
    expect(header.querySelector('h3').textContent.trim()).to.equal('Slide one heading');

    expect(slide.querySelector('.elastic-carousel-item-media video')).to.exist;

    const footer = slide.querySelector('.elastic-carousel-item-footer');
    expect(footer.textContent).to.contain('Learn more');
  });

  it('rewrites federated svg icon sources to the federated content root', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const icon = block.querySelector('.elastic-carousel-item-header img');
    expect(icon.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/icon-one.svg');
  });

  it('prepares a video asset with a source, muted playback and no controls', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const video = block.querySelector('.elastic-carousel-item-media video');
    expect(video.getAttribute('preload')).to.equal('none');
    expect(video.hasAttribute('muted')).to.be.true;
    expect(video.getAttribute('tabindex')).to.equal('-1');
    expect(video.hasAttribute('controls')).to.be.false;

    const source = video.querySelector('source');
    expect(source.getAttribute('src')).to.equal('/media/one.mp4');
    expect(source.getAttribute('type')).to.equal('video/mp4');
  });

  it('rewrites a federated svg media asset and falls back to the default carousel name', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/image-asset.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const media = block.querySelector('.elastic-carousel-item-media img');
    expect(media.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/media/hero.svg');
    // link text has no pipe, so the carousel name falls back to the default
    expect(block.dataset.ariaLabel).to.equal('Adobe slides');
  });

  it('reverses slide order in RTL', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const firstSlide = block.querySelector('.elastic-carousel-item');
    // in RTL the authored last slide becomes the first rendered slide
    expect(firstSlide.querySelector('h3').textContent.trim()).to.equal('Slide two heading');
  });
});

describe('Elastic Carousel responsive geometry', () => {
  const longLabel = 'Uczniowie, studenci, nauczyciele i wykładowcy';
  let styles;
  let originalViewport;

  const settleLayout = async () => {
    for (let frame = 0; frame < 4; frame += 1) {
      await new Promise((resolve) => { requestAnimationFrame(resolve); });
    }
  };

  const finishTransitions = (block) => {
    block.getAnimations({ subtree: true })
      .filter((animation) => animation instanceof window.CSSTransition)
      .forEach((animation) => animation.finish());
  };

  const applyTextSpacing = () => {
    const spacing = document.createElement('style');
    spacing.id = 'text-spacing';
    spacing.textContent = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
    document.head.append(spacing);
  };

  const expectFullText = (card) => {
    const bounds = card.getBoundingClientRect();
    card.querySelectorAll('.elastic-carousel-item-header p, .elastic-carousel-item-footer > :is(h1, h2, h3, h4, h5, h6, p)')
      .forEach((text) => {
        const rect = text.getBoundingClientRect();
        expect(getComputedStyle(text).webkitLineClamp).to.equal('none');
        expect(text.scrollHeight, text.textContent).to.be.at.most(text.clientHeight + 1);
        expect(rect.left).to.be.at.least(bounds.left - 1);
        expect(rect.right).to.be.at.most(bounds.right + 1);
        expect(rect.bottom).to.be.at.most(bounds.bottom + 1);
      });
    const block = card.closest('.elastic-carousel').getBoundingClientRect();
    expect(bounds.bottom, 'card stays within carousel flow').to.be.at.most(block.bottom + 1);
  };

  const expectSpacing = (paragraph) => {
    const style = getComputedStyle(paragraph);
    const size = parseFloat(style.fontSize);
    expect(parseFloat(style.lineHeight)).to.be.at.least(size * 1.5);
    expect(parseFloat(style.letterSpacing)).to.be.at.least(size * 0.12);
    expect(parseFloat(style.wordSpacing)).to.be.at.least(size * 0.16);
    expect(parseFloat(style.marginBottom)).to.be.at.least(size * 2);
  };

  const expectFinalLineVisible = async (card) => {
    const paragraph = card.querySelector('.elastic-carousel-item-footer > p');
    paragraph.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'instant' });
    await settleLayout();
    // Stacking margins can reflow after the scroll timeline advances.
    window.scrollBy({
      top: paragraph.getBoundingClientRect().bottom - window.innerHeight + 24,
      behavior: 'instant',
    });
    await settleLayout();
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    const rects = [...range.getClientRects()];
    const rect = rects[rects.length - 1];
    expect(rect.top).to.be.at.least(0);
    expect(rect.bottom).to.be.at.most(window.innerHeight + 1);
    expect(paragraph.contains(document.elementFromPoint(rect.left + Math.min(rect.width / 2, 5), (rect.top + rect.bottom) / 2)), 'last line is not clipped or covered by another card').to.be.true;
  };

  const loadCarousel = async (slideCount = 5) => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    const template = block.firstElementChild.cloneNode(true);
    while (block.children.length < slideCount) block.append(template.cloneNode(true));
    const image = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"/>')}`;
    [...block.children].forEach((slide) => {
      const heading = slide.querySelector('h3');
      const label = document.createElement('p');
      label.className = 'eyebrow';
      label.textContent = longLabel;
      heading.replaceWith(label);
      const title = document.createElement('h3');
      title.textContent = 'Generate stunning content easily.';
      slide.firstElementChild.children[2].replaceWith(title);
      const description = document.createElement('p');
      description.textContent = 'Do it all with industry-leading apps for design, photo, video, and creative AI.';
      slide.firstElementChild.insertBefore(description, slide.firstElementChild.lastElementChild);
      slide.querySelector('img').src = image;
      slide.querySelector('video').removeAttribute('data-video-source');
      slide.querySelector('video').removeAttribute('controls');
    });
    const spacer = document.createElement('div');
    spacer.style.height = '1000px';
    document.body.prepend(spacer);
    document.body.append(spacer.cloneNode());
    await init(block);
    window.scrollTo(0, block.getBoundingClientRect().top + window.scrollY);
    await settleLayout();
    return block;
  };

  before(async () => {
    originalViewport = { width: window.innerWidth, height: window.innerHeight };
    styles = document.createElement('style');
    styles.textContent = await readFile({ path: '../../../libs/c2/styles/styles.css' })
      + (await readFile({ path: '../../../libs/c2/blocks/elastic-carousel/elastic-carousel.css' }))
        .replaceAll('../../assets/', '/libs/c2/assets/');
    document.head.append(styles);
  });

  afterEach(async () => {
    sinon.restore();
    document.getElementById('text-spacing')?.remove();
    document.body.replaceChildren();
    document.documentElement.removeAttribute('dir');
    window.scrollTo(0, 0);
    await settleLayout();
  });

  after(async () => {
    styles.remove();
    await setViewport(originalViewport);
  });

  ['ltr', 'rtl'].forEach((direction) => {
    [false, true].forEach((textSpacing) => {
      it(`reveals complete ${direction} desktop text on hover/focus with text spacing ${textSpacing}`, async () => {
        await setViewport({ width: 1366, height: 768 });
        document.documentElement.setAttribute('dir', direction);
        const block = await loadCarousel();
        const card = block.querySelector('[data-index="3"]');
        const title = card.querySelector('.elastic-carousel-item-footer h3');
        const description = card.querySelector('.elastic-carousel-item-footer p');
        if (textSpacing) applyTextSpacing();
        await settleLayout();
        expect(getComputedStyle(title).webkitLineClamp).to.equal('1');
        expect(getComputedStyle(description).webkitLineClamp).to.equal('2');
        if (textSpacing) expectSpacing(description);
        for (const interaction of ['hover', 'focus']) {
          if (interaction === 'hover') card.dispatchEvent(new MouseEvent('mouseenter'));
          else card.focus();
          await settleLayout();
          finishTransitions(block);
          await settleLayout();
          expectFullText(card);
          const footer = card.querySelector('.elastic-carousel-item-footer');
          const footerBounds = footer.getBoundingClientRect();
          const textBounds = description.getBoundingClientRect();
          const arrow = getComputedStyle(footer, '::after');
          const inset = direction === 'rtl'
            ? textBounds.left - footerBounds.left : footerBounds.right - textBounds.right;
          expect(inset, 'full text reserves arrow space')
            .to.be.at.least(parseFloat(arrow.width) + parseFloat(arrow.marginRight) - 1);
          expect(footerBounds.bottom).to.be.at.most(block.getBoundingClientRect().bottom + 1);
          await expectFinalLineVisible(card);
          card.classList.remove('hovered');
        }
      });
    });

    [320, 375, 380, 414].forEach((width) => {
      it(`reserves the ${direction} mobile arrow space for long labels at ${width}px throughout stacking`, async () => {
        await setViewport({ width, height: 800 });
        document.documentElement.setAttribute('dir', direction);
        const block = await loadCarousel();
        const top = block.getBoundingClientRect().top + window.scrollY;
        const range = block.offsetHeight - window.innerHeight;
        for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
          window.scrollTo(0, top + range * progress);
          await settleLayout();
          block.querySelectorAll('.elastic-carousel-item-header').forEach((header) => {
            const label = header.querySelector('p');
            const icon = header.querySelector('img');
            const style = getComputedStyle(header);
            const arrowStyle = getComputedStyle(header, '::after');
            const bounds = header.getBoundingClientRect();
            const available = bounds.width - parseFloat(style.paddingLeft)
              - parseFloat(style.paddingRight) - icon.getBoundingClientRect().width
              - parseFloat(arrowStyle.width) - 2 * parseFloat(style.columnGap);
            expect(label.getBoundingClientRect().width, 'label excludes icon, arrow and gaps')
              .to.be.at.most(available + 1);
            expect(icon.getBoundingClientRect().width).to.be.closeTo(24, 0.1);
            expect(parseFloat(arrowStyle.width)).to.equal(24);
            const labelStyle = getComputedStyle(label);
            expect(labelStyle.webkitLineClamp).to.equal('none');
            expect(label.scrollHeight).to.be.at.most(label.clientHeight + 1);
            expect(label.textContent).to.equal(longLabel);
          });
          expect(document.documentElement.scrollWidth).to.be.at.most(window.innerWidth);
        }
      });
    });
  });

  it('updates measured card heights and disconnects the size observer on removal', async () => {
    const observe = sinon.spy();
    const disconnect = sinon.spy();
    let resized;
    sinon.stub(window, 'ResizeObserver').callsFake((callback) => {
      resized = callback;
      return { observe, disconnect };
    });
    await setViewport({ width: 1366, height: 768 });
    const block = await loadCarousel();
    const card = block.querySelector('.elastic-carousel-item');
    expect(observe.callCount).to.equal(5);
    resized([{ target: card, borderBoxSize: [{ blockSize: 900 }] }]);
    expect(card.style.getPropertyValue('--elastic-carousel-item-height')).to.equal('900px');
    block.remove();
    await settleLayout();
    expect(disconnect.calledOnce).to.be.true;
  });

  describe('touch row scrolling', () => {
    let originalStyles;

    before(() => {
      originalStyles = styles.textContent;
      styles.textContent = originalStyles.replaceAll('(hover: none)', '(min-width: 0px)');
    });

    beforeEach(() => {
      const nativeMatchMedia = window.matchMedia.bind(window);
      sinon.stub(window, 'matchMedia').callsFake((query) => nativeMatchMedia(
        query === '(hover: none) and (min-width: 768px)' ? '(min-width: 768px)' : query,
      ));
    });

    after(() => {
      styles.textContent = originalStyles;
    });

    ['ltr', 'rtl'].forEach((direction) => {
      [375, 768, 1024, 1366].forEach((width) => {
        it(`exposes complete ${direction} non-hover text with WCAG spacing at ${width}px`, async () => {
          await setViewport({ width, height: 800 });
          document.documentElement.setAttribute('dir', direction);
          const block = await loadCarousel();
          applyTextSpacing();
          await settleLayout();
          const cards = [...block.querySelectorAll('.elastic-carousel-item')];
          cards.forEach((card) => {
            expectFullText(card);
            expectSpacing(card.querySelector('.elastic-carousel-item-footer > p'));
          });
          await expectFinalLineVisible(cards[0]);
          await expectFinalLineVisible(cards.at(-1));
          expect(document.documentElement.scrollWidth).to.be.at.most(window.innerWidth);
        });
      });

      [768, 1024, 1280, 1366].forEach((width) => {
        it(`makes both ${direction} edge cards reachable at ${width}px without hover`, async () => {
          await setViewport({ width, height: 900 });
          document.documentElement.setAttribute('dir', direction);
          const block = await loadCarousel();
          const row = block.querySelector('.elastic-carousel-container');
          const cards = [...row.querySelectorAll('.elastic-carousel-item')];
          expect(getComputedStyle(block).overflowX).to.equal('auto');
          expect(getComputedStyle(row).transform).to.equal('none');
          expect(getComputedStyle(row).animationName).to.equal('none');
          const distance = block.scrollWidth - block.clientWidth;
          expect(distance).to.be.above(0);
          const expectVisible = (card) => {
            const bounds = block.getBoundingClientRect();
            const rect = card.getBoundingClientRect();
            expect(rect.left).to.be.at.least(bounds.left - 1);
            expect(rect.right).to.be.at.most(bounds.right + 1);
          };
          expectVisible(cards[0]);
          block.scrollLeft = direction === 'rtl' ? -distance : distance;
          await settleLayout();
          expect(Math.abs(block.scrollLeft)).to.be.closeTo(distance, 1);
          expectVisible(cards.at(-1));
          const lastHref = cards.at(-1).href;
          const cardWidth = cards.at(-1).getBoundingClientRect().width;
          cards.at(-1).dispatchEvent(new MouseEvent('mouseenter'));
          cards.at(-1).focus();
          window.dispatchEvent(new WheelEvent('wheel', { deltaX: 100 }));
          await settleLayout();
          expect(block.classList.contains('disable-hover')).to.be.false;
          expect(row.classList.contains('stick-left')).to.be.false;
          expect(row.classList.contains('stick-right')).to.be.false;
          expect(cards.at(-1).classList.contains('hovered')).to.be.false;
          expect(cards.at(-1).getBoundingClientRect().width).to.be.closeTo(cardWidth, 0.1);
          expect(cards.at(-1).href).to.equal(lastHref);
          expectVisible(cards.at(-1));
          cards[0].focus();
          await settleLayout();
          expectVisible(cards[0]);
          expect(document.activeElement).to.equal(cards[0]);
          expect(document.documentElement.scrollWidth).to.be.at.most(window.innerWidth);
        });
      });

      it(`centers a short ${direction} row without creating overflow`, async () => {
        await setViewport({ width: 1024, height: 900 });
        document.documentElement.setAttribute('dir', direction);
        const block = await loadCarousel(2);
        const cards = [...block.querySelectorAll('.elastic-carousel-item')];
        const bounds = block.getBoundingClientRect();
        const left = Math.min(...cards.map((card) => card.getBoundingClientRect().left));
        const right = Math.max(...cards.map((card) => card.getBoundingClientRect().right));
        expect((left + right) / 2).to.be.closeTo((bounds.left + bounds.right) / 2, 1);
        expect(block.scrollWidth).to.equal(block.clientWidth);
      });

      it(`returns from the ${direction} touch row to the stacked mobile layout`, async () => {
        await setViewport({ width: 1024, height: 900 });
        document.documentElement.setAttribute('dir', direction);
        const block = await loadCarousel();
        block.scrollLeft = direction === 'rtl' ? -block.scrollWidth : block.scrollWidth;
        await setViewport({ width: 375, height: 800 });
        await settleLayout();
        expect(getComputedStyle(block).overflowX).to.equal('visible');
        expect(getComputedStyle(block.querySelector('.elastic-carousel-container')).display)
          .to.equal('grid');
        expect(block.scrollLeft).to.equal(0);
        expect(block.scrollWidth).to.equal(block.clientWidth);
      });
    });
  });
});
