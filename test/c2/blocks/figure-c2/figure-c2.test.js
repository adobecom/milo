import { expect } from '@esm-bundle/chai';
import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../../libs/utils/utils.js';
import init from '../../../../libs/c2/blocks/figure-c2/figure-c2.js';

setConfig({});

const picture = (alt = '') => `<picture><img src="" alt="${alt}"></picture>`;

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
    expect(caption.querySelector('em')).to.be.null;
    expect(figures[0].firstElementChild.tagName).to.equal('PICTURE');
    expect(figures[1].querySelector('figcaption')).to.be.null;
  });

  it('wraps the media in the authored link', () => {
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

  it('wraps media-less embed links in their own container', () => {
    const el = makeBlock(`
      <div><div>
        <p><a href="https://www.youtube.com/watch?v=7Uyip_54N5A">https://www.youtube.com/watch?v=7Uyip_54N5A</a></p>
        <p><em>Video caption</em></p>
      </div></div>`);
    init(el);

    const figure = el.querySelector('figure');
    expect(figure.firstElementChild.matches('.figure-c2-embed')).to.be.true;
    expect(figure.querySelector('.figure-c2-embed > a:only-child')).to.exist;
    expect(figure.lastElementChild.matches('figcaption')).to.be.true;
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
