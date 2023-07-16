import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import {
  getLocale,
  setConfig,
  loadStyle,
} from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/quiz/quiz.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

// setConfig(config);

describe('Quiz', () => {
  it('init quiz', async () => {
    setConfig(config);
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const el = document.querySelector('.quiz');
    init(el);
  });

  it('Renders the quiz component', () => {
    console.log('lets see if this works');
    expect(document.querySelector('.quiz')).to.exist;
  });
});
