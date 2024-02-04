import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import Sync from '../../../../libs/blocks/floodgateui/sync/view.js';

describe('Sync Component', () => {
  before(async () => {
    const review = html`<${Sync} />`;
    render(review, document.body);
  });

  it('should render Sync component', async () => {
    const container = await waitForElement('.fgui-sync-badge-container');
    expect(container).to.exist;
  });

});