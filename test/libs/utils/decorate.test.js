/* eslint-disable no-unused-expressions */
/* global it */
import { expect } from '@esm-bundle/chai';
import { isHexColorDark } from '../../../libs/utils/decorate.js';

it('Verifies a hex color is dark', () => {
  expect(isHexColorDark('#fafafa')).to.be.false;
  expect(isHexColorDark('#323232')).to.be.true;
});
