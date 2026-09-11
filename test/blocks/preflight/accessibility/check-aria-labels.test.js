import { expect } from '@esm-bundle/chai';
import checkAriaLabels from '../../../../libs/blocks/preflight/accessibility/check-aria-labels.js';

const CONFIG = { checks: ['aria-labels'] };

describe('preflight accessibility check-aria-labels', () => {
  const created = [];
  const add = (html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    document.body.append(el);
    created.push(el);
    return el;
  };

  afterEach(() => { while (created.length) created.pop().remove(); });

  it('returns [] when aria-labels check is not enabled', () => {
    const el = add('<button></button>');
    expect(checkAriaLabels([el], { checks: [] })).to.deep.equal([]);
  });

  it('flags a button with no aria-label and no text content', () => {
    const el = add('<button></button>');
    const res = checkAriaLabels([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].description).to.contain('missing the aria-label');
    expect(res[0].impact).to.equal('serious');
  });

  it('does not flag a button with visible text content', () => {
    const el = add('<button>Save</button>');
    expect(checkAriaLabels([el], CONFIG)).to.deep.equal([]);
  });

  it('flags an aria-label that does not start with the text content', () => {
    const el = add('<button aria-label="Close dialog">Open</button>');
    const res = checkAriaLabels([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].description).to.contain('does not start with element text content');
    expect(res[0].impact).to.equal('moderate');
  });

  it('accepts an aria-label prefixed by the text content', () => {
    const el = add('<button aria-label="Save changes">Save</button>');
    expect(checkAriaLabels([el], CONFIG)).to.deep.equal([]);
  });

  it('flags con-button anchors sharing an aria-label but linking to different URLs', () => {
    const a1 = add('<a class="con-button" aria-label="Learn more" href="https://a.example/">Learn more</a>');
    const a2 = add('<a class="con-button" aria-label="Learn more" href="https://b.example/">Learn more</a>');
    const res = checkAriaLabels([a1, a2], CONFIG);
    const shared = res.find((v) => v.description.includes('share the same aria-label'));
    expect(shared).to.exist;
    expect(shared.nodes).to.have.lengthOf(2);
  });

  it('does not flag shared aria-labels that resolve to the same URL', () => {
    const a1 = add('<a class="con-button" aria-label="Learn more" href="https://a.example/">Learn more</a>');
    const a2 = add('<a class="con-button" aria-label="Learn more" href="https://a.example/">Learn more</a>');
    const res = checkAriaLabels([a1, a2], CONFIG);
    expect(res.find((v) => v.description.includes('share the same aria-label'))).to.be.undefined;
  });
});
