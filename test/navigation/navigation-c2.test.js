/* eslint import/no-relative-packages: 0 */
import { expect } from '@esm-bundle/chai';
import loadNavigationC2 from '../../libs/navigation/navigation-c2.js';

describe('Navigation C2 entrypoint', () => {
  it('exposes a dedicated browser global', () => {
    expect(window.loadNavigationC2).to.equal(loadNavigationC2);
  });
});
