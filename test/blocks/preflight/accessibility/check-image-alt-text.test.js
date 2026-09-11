import { expect } from '@esm-bundle/chai';
import checkImageAltText from '../../../../libs/blocks/preflight/accessibility/check-image-alt-text.js';

const CONFIG = { checks: ['altText'] };

function img(attrs = {}) {
  const el = document.createElement('img');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  document.body.append(el);
  return el;
}

describe('preflight accessibility check-image-alt-text', () => {
  const created = [];
  const make = (attrs) => { const el = img(attrs); created.push(el); return el; };

  afterEach(() => { while (created.length) created.pop().remove(); });

  it('returns [] when altText check is not enabled', () => {
    make({ });
    expect(checkImageAltText([document.querySelector('img')], { checks: [] })).to.deep.equal([]);
  });

  it('flags an image with no alt attribute', () => {
    const el = make({});
    const res = checkImageAltText([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('image-alt');
    expect(res[0].description).to.contain('missing an alt attribute');
  });

  it('flags numeric alt text', () => {
    const el = make({ alt: '123' });
    const res = checkImageAltText([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].description).to.contain('too short');
  });

  it('flags too-short alt text', () => {
    const el = make({ alt: 'ab' });
    expect(checkImageAltText([el], CONFIG)).to.have.lengthOf(1);
  });

  it('passes descriptive alt text', () => {
    const el = make({ alt: 'A cat sitting on a sofa' });
    expect(checkImageAltText([el], CONFIG)).to.deep.equal([]);
  });

  it('treats empty alt / role=presentation / aria-hidden as decorative', () => {
    const decorative = [
      make({ alt: '' }),
      make({ alt: 'ab', role: 'presentation' }),
      make({ alt: 'ab', 'aria-hidden': 'true' }),
    ];
    expect(checkImageAltText(decorative, CONFIG)).to.deep.equal([]);
  });

  it('skips hidden images', () => {
    const el = make({});
    el.style.display = 'none';
    expect(checkImageAltText([el], CONFIG)).to.deep.equal([]);
  });

  it('ignores non-image elements', () => {
    const div = document.createElement('div');
    document.body.append(div);
    created.push(div);
    expect(checkImageAltText([div], CONFIG)).to.deep.equal([]);
  });
});
