import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/twitter/twitter.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('twitter', () => {
  it('renders embed tweet for twitter link', async () => {
    const twitter = document.querySelector('a');

    init(twitter);

    const iframe = await waitForElement('iframe');
    const blockquote = document.querySelector('.twitter-tweet');
    const wrapper = document.querySelector('.embed-twitter');
    const script = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');

    expect(blockquote).to.not.be.null;
    expect(wrapper).to.not.be.null;
    expect(script).to.not.be.null;
    expect(iframe).to.be.exist;
  });
});
