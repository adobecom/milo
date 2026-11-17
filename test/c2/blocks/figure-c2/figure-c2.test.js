import { expect } from '@esm-bundle/chai';
import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../../libs/utils/utils.js';
import init from '../../../../libs/c2/blocks/figure-c2/figure-c2.js';

setConfig({});

const picture = (alt = '') => `<picture><img src="" alt="${alt}"></picture>`;
const YT = 'https://www.youtube.com/watch?v=7Uyip_54N5A';

function makeBlock(innerHTML) {
  const el = document.createElement('div');
  el.className = 'figure-c2';
  el.innerHTML = innerHTML;
  document.body.append(el);
  return el;
}

describe('figure-c2', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('builds one figure per cell with an unwrapped caption', () => {
    const el = makeBlock(`
      <div>
        <div><p>${picture('one')}</p><p><em>First caption</em></p></div>
        <div>${picture('two')}</div>
      </div>`);
    init(el);

    const figures = el.querySelectorAll(':scope > figure');
    expect(figures.length).to.equal(2);
    const caption = figures[0].querySelector(':scope > figcaption.caption');
    expect(caption.textContent).to.equal('First caption');
    expect(!!caption.querySelector('em')).to.be.false;
    expect(figures[0].firstElementChild.tagName).to.equal('PICTURE');
    expect(figures[1].querySelector('figcaption')).to.be.null;
  });

  it('wraps the image in the authored link', () => {
    const el = makeBlock(`
      <div><div>
        <p>${picture('linked')}</p>
        <p><a href="https://www.adobe.com/">https://www.adobe.com/</a></p>
      </div></div>`);
    init(el);

    const link = el.querySelector('figure > a');
    expect(link.querySelector(':scope > picture img').alt).to.equal('linked');
    expect(link.textContent.trim()).to.equal('');
  });

  it('wraps embed links in their own container', () => {
    const el = makeBlock(`
      <div><div>
        <p><a class="youtube link-block" href="${YT}">${YT}</a></p>
        <p><em>Video caption</em></p>
      </div></div>`);
    init(el);

    const figure = el.querySelector('figure');
    expect(figure.firstElementChild.matches('.figure-c2-embed')).to.be.true;
    expect(figure.querySelector('.figure-c2-embed > a:only-child')).to.exist;
    expect(figure.lastElementChild.matches('figcaption')).to.be.true;
  });

  it('never wraps media in an embed link, keeping mixed media in authored order', () => {
    const el = makeBlock(`
      <div><div>
        <div class="milo-video"><iframe class="adobetv"></iframe></div>
        <p>${picture('poster')}</p>
        <div class="video-holder"><video data-hoverplay></video></div>
        <p><a class="youtube link-block" href="${YT}">${YT}</a></p>
        <p><em>Mixed caption</em></p>
      </div></div>`);
    init(el);

    const order = [...el.querySelector('figure').children].map((child) => child.className || child.tagName);
    expect(order).to.deep.equal(['milo-video', 'PICTURE', 'video-holder', 'figure-c2-embed', 'caption']);
    expect(!!el.querySelector('a picture')).to.be.false;
  });

  it('never wraps a video in an authored link, so its controls stay usable', () => {
    const el = makeBlock(`
      <div><div>
        <p><video controls></video></p>
        <p><a href="https://www.adobe.com/">https://www.adobe.com/</a></p>
      </div></div>`);
    init(el);

    const figure = el.querySelector('figure');
    expect(!!figure.querySelector(':scope > video')).to.be.true;
    expect(!!figure.querySelector('a video')).to.be.false;
    expect(figure.querySelector(':scope > p > a').textContent).to.equal('https://www.adobe.com/');
  });

  it('keeps the video transcript link instead of wrapping the video in it', () => {
    const el = makeBlock(`
      <div><div>
        <div class="video-container video-holder"><video></video><button class="play-pause-button"></button></div>
        <p><a class="modal link-block video-transcript-source" href="#transcript">Read transcript</a></p>
        <p><em>Video caption</em></p>
      </div></div>`);
    init(el);

    const figure = el.querySelector('figure');
    expect(figure.querySelector(':scope > .video-container > video')).to.exist;
    expect(figure.querySelector(':scope > p > .video-transcript-source').textContent).to.equal('Read transcript');
    expect(figure.lastElementChild.matches('figcaption')).to.be.true;
  });

  it('keeps text and links around the italic caption', () => {
    const el = makeBlock(`
      <div><div>
        <p>${picture('photo')}</p>
        <p><em>Photo:</em> <a href="https://www.adobe.com/">Jane Doe</a></p>
      </div></div>`);
    init(el);

    const caption = el.querySelector('figcaption');
    expect(caption.textContent).to.equal('Photo: Jane Doe');
    expect(caption.querySelector('a').textContent).to.equal('Jane Doe');
    expect(!!el.querySelector('a picture')).to.be.false;
  });

  [
    { where: 'inside a paragraph', wrap: (embed) => { const p = document.createElement('p'); p.append(embed); return p; } },
    { where: 'directly in the cell', wrap: (embed) => embed },
  ].forEach(({ where, wrap }) => {
    it(`keeps MPC embeds already built by their autoblock (${where})`, () => {
      const el = makeBlock('<div><div><p><em>MPC caption</em></p></div></div>');
      const embed = document.createElement('div');
      embed.className = 'milo-video';
      embed.innerHTML = '<iframe class="adobetv" src="https://video.tv.adobe.com/v/26535"></iframe>';
      el.querySelector(':scope > div > div').prepend(wrap(embed));
      init(el);

      const figure = el.querySelector('figure');
      expect(figure.firstElementChild === embed).to.be.true;
      expect(figure.querySelector('.milo-video > iframe.adobetv')).to.exist;
      expect(figure.lastElementChild.textContent).to.equal('MPC caption');
    });
  });

  [
    { width: 375, count: 1, caption: 'Mobile' },
    { width: 1440, count: 2, caption: 'Desktop' },
  ].forEach(({ width, count, caption }) => {
    it(`decorates each viewport section (${width}px)`, async () => {
      await setViewport({ width, height: 800 });
      const el = makeBlock(`
        <div><div>mobile-viewport</div></div>
        <div><div><p>${picture('mobile')}</p><p><em>Mobile</em></p></div></div>
        <div><div>desktop-viewport</div></div>
        <div>
          <div><p>${picture('desktop-1')}</p><p><em>Desktop</em></p></div>
          <div>${picture('desktop-2')}</div>
        </div>`);
      init(el);

      const figures = el.querySelectorAll(':scope > figure');
      expect(figures.length).to.equal(count);
      expect(figures[0].querySelector('figcaption.caption').textContent).to.equal(caption);
    });
  });

  it('skips empty cells', () => {
    const el = makeBlock(`<div><div>${picture('one')}</div><div></div><div> </div></div>`);
    init(el);
    expect(el.querySelectorAll(':scope > figure').length).to.equal(1);
  });

  it('renders nothing when no cells are authored', () => {
    const el = makeBlock('');
    init(el);
    expect(el.children.length).to.equal(0);
  });
});
