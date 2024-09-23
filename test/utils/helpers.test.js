import { expect } from '@esm-bundle/chai';
import { overrideUrlOrigin } from '../../libs/utils/helpers.js';

describe('overrideUrlOrigin', () => {
  it('Change origin to http://localhost:2000', async () => {
    const link = overrideUrlOrigin('http://www.qa.adobe.com/some/page.html?a=b#hash');
    expect(link).to.equal('http://localhost:2000/some/page.html?a=b#hash');
  });

  it('Ignore relative URLs', async () => {
    const link = overrideUrlOrigin('/some/page.html?a=b#hash');
    expect(link).to.equal('/some/page.html?a=b#hash');
  });
});
