import { expect } from '@esm-bundle/chai';
import {
  addToAverage,
  isKeyboardNavigation,
} from '../../../../libs/blocks/review/utils/utils.js';

describe('Utils', () => {
  it('could add to average', () => {
    expect(addToAverage(4, 4, 4)).to.be.equal(4);
  });
  it('could identify mouse-enter event', () => {
    const input = new MouseEvent('mouseenter');
    expect(isKeyboardNavigation(input)).to.be.equal(true);
  });
  it('could identify keyboard event', () => {
    const input = new KeyboardEvent('keypress');
    expect(isKeyboardNavigation(input)).to.be.equal(undefined);
  });
});
