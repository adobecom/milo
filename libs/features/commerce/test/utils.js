/* eslint-disable import/no-extraneous-dependencies */
// @ts-ignore
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { expect, use } from '@esm-bundle/chai';
import sinon from 'sinon';

import { equalsCI } from '../src/utils.js';

use(chaiAsPromised);

use((chai) => {
  function normalise(val) {
    return String(val).trim()
      .replace(/>\s*</g, '><')
      .replace(/>\s*/g, '>')
      .replace(/\s*</g, '<')
      .replace(/"\s*>/g, '">')
      .replace(/"\s*\/>/g, '/>')
      .replace(/\s+/g, ' ');
  }

  chai.Assertion.addMethod('html', function assertHtml(snapshot) {
    // eslint-disable-next-line no-underscore-dangle
    const normAct = normalise(this._obj);
    const normExp = normalise(snapshot);
    this.assert(
      equalsCI(normAct, normExp),
      'expected to match html snapshot',
      'expected not to match html snapshot',
      normAct,
      normExp,
    );
  });
});

const delay = (timeout = 1) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});

export { delay, expect, sinon };
