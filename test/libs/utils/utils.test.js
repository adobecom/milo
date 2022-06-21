/* eslint-disable no-unused-expressions */
/* global it */
import { expect } from '@esm-bundle/chai';
import { cloneObj, isValidUuid, isHexColorDark } from '../../../libs/utils/utils.js';

it('Clones an object', () => {
  const o = {
    sortReservoirPool: 1000,
    source: ['hawks'],
    tagsUrl: 'www.adobe.com/chimera-api/tags',
    targetActivity: '',
    targetEnabled: false,
  };
  expect(cloneObj(o)).to.be.eql(o);
});

it('Verifies a UUID', () => {
  expect(isValidUuid('blah-blah')).to.be.false;
  expect(isValidUuid('4a8056aa-7f95-4809-bdad-b9439764e93c')).to.be.true;
});

it('Verifies a hex color is dark', () => {
  expect(isHexColorDark('#fafafa')).to.be.false;
  expect(isHexColorDark('#323232')).to.be.true;
});
