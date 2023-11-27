import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import {
  addToAverage,
  isKeyboardNavigation,
  checkPostUrl,
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

  describe('CheckReviewPostUrl', () => {
    let mockUrl;
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './../mocks/body-stage.html' });
      mockUrl = document.querySelector('div a').innerText;
    });
    it('should not change post url on prod', () => {
      const modifiedUrl = checkPostUrl(mockUrl, { name: 'prod' });
      expect(modifiedUrl).to.be.eql(mockUrl);
    });
    it('should change post url in a non-prod env', () => {
      const modifiedUrl = checkPostUrl(mockUrl, { name: 'stage' });
      expect(modifiedUrl).to.be.eql('https://www.stage.adobe.com/reviews-api/dc/production/rotate-pdf');
    });
  });
});
