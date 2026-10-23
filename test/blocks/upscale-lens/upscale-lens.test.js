import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/upscale-lens/upscale-lens.js');

const [twoImages, oneImage] = document.querySelectorAll('.upscale-lens');
init(twoImages);
init(oneImage);

const pointer = (type, opts = {}) => new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', ...opts });

describe('Upscale lens', () => {
  it('uses the authored before and after images', () => {
    expect(twoImages.querySelector('.before img').alt).to.equal('Before');
    expect(twoImages.querySelector('.after img').alt).to.equal('After');
    expect(twoImages.querySelector('.upscale-lens-copy h1')).to.exist;
    expect(twoImages.querySelector('.upscale-lens-stage').classList.contains('auto-blur')).to.be.false;
  });

  it('copies a single image and blurs the before layer', () => {
    const stage = oneImage.querySelector('.upscale-lens-stage');
    expect(stage.classList.contains('auto-blur')).to.be.true;
    expect(oneImage.classList.contains('no-copy')).to.be.true;
    expect(stage.querySelector('.after img').alt).to.equal('');
  });

  it('activates while the pointer is held and resets on release', () => {
    const stage = twoImages.querySelector('.upscale-lens-stage');
    const label = stage.querySelector('.upscale-lens-label');
    stage.dispatchEvent(pointer('pointerdown'));
    expect(stage.classList.contains('active')).to.be.true;
    expect(label.textContent).to.equal('Enhanced');
    stage.dispatchEvent(pointer('pointerup'));
    expect(stage.classList.contains('active')).to.be.false;
    expect(label.textContent).to.equal('Tap and hold');
  });

  it('ignores a touch outside the move button, so the page can scroll', () => {
    const stage = twoImages.querySelector('.upscale-lens-stage');
    stage.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', pointerId: 7 }));
    expect(stage.classList.contains('active')).to.be.false;
  });

  it('toggles with the keyboard', () => {
    const stage = twoImages.querySelector('.upscale-lens-stage');
    const button = stage.querySelector('.upscale-lens-move');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(button.getAttribute('aria-pressed')).to.equal('true');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(button.getAttribute('aria-pressed')).to.equal('false');
  });
});
