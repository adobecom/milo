import { expect } from '@esm-bundle/chai';
import { setBackgroundFocus } from '../../libs/utils/decorate.js';

describe('setBackgroundFocus', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should set objectPosition from data-focal coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:25,75"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('25% 75%');
    expect(img.dataset.title).to.be.undefined;
  });

  it('should handle 0,0 coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:0,0"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('0% 0%');
  });

  it('should handle 100,100 coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:100,100"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('100% 100%');
  });

  it('should do nothing if pic is null', () => {
    expect(() => setBackgroundFocus(null)).to.not.throw();
  });

  it('should do nothing if pic is undefined', () => {
    expect(() => setBackgroundFocus(undefined)).to.not.throw();
  });

  it('should do nothing if no img inside picture', () => {
    container.innerHTML = '<picture></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    expect(pic.innerHTML).to.equal('');
  });

  it('should do nothing if img has no data-title', () => {
    container.innerHTML = '<picture><img></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('');
  });

  it('should do nothing if data-title does not include data-focal', () => {
    container.innerHTML = '<picture><img data-title="some-other-value"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('');
    expect(img.dataset.title).to.equal('some-other-value');
  });

  it('should remove data-title after processing', () => {
    container.innerHTML = '<picture><img data-title="data-focal:50,50"></picture>';
    const pic = container.querySelector('picture');
    const img = pic.querySelector('img');
    expect(img.dataset.title).to.equal('data-focal:50,50');
    setBackgroundFocus(pic);
    expect(img.dataset.title).to.be.undefined;
  });
});
