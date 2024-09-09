import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/action-item/action-item.js');
const variants = ['default', 'float-icon', 'float-button', 'static-links', 'no-link-text'];

const actionItems = document.querySelectorAll('.action-item');
actionItems.forEach((actionItem) => {
  init(actionItem);
});
describe('action item', () => {
  it(`${variants[0]} has an image`, () => {
    const image = actionItems[0].querySelector('.main-image');
    expect(image).to.exist;
  });

  it(`${variants[1]} has floated icon`, () => {
    const icon = actionItems[1].querySelector('.floated-icon');
    expect(icon).to.exist;
  });

  it(`${variants[2]} has floated button`, () => {
    const button = actionItems[2].querySelector('.con-button');
    expect(button).to.exist;
  });

  it(`${variants[3]} has static links`, () => {
    const link = actionItems[3].querySelector('a.static');
    expect(link).to.exist;
  });
});
