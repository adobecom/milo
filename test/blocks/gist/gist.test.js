import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/gist/gist.js');

describe('adobetv autoblock', () => {
  let createElementStub;
  let originalCreateElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;

    createElementStub = sinon.stub(document, 'createElement').callsFake((tagName) => {
      if (tagName === 'script') {
        const scriptMock = originalCreateElement.call(document, 'script');
        Object.defineProperty(scriptMock, 'src', {
          set(url) {
            const callbackMatch = url.match(/callback=([^&]+)/);
            if (callbackMatch) {
              const callbackName = callbackMatch[1];
              Promise.resolve().then(() => {
                if (window[callbackName]) {
                  window[callbackName]({ div: '<div class="gist-data">Mock Gist Content</div>' });
                }
              }, 0);
            }
          },
        });
        return scriptMock;
      }
      return originalCreateElement.call(document, tagName);
    });
  });

  afterEach(() => {
    createElementStub.restore();
  });

  it('creates gist block with mocked data', async () => {
    const gistLink = document.body.querySelector('a');
    init(gistLink);
    const div = await waitForElement('div.gist-data');
    expect(div).to.exist;
    expect(div.innerHTML).to.contain('Mock Gist Content');
  });
});
