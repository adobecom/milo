import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';
import { replaceText, replaceKey } from '../../../libs/features/placeholders.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

describe('Placeholders', () => {
  it('Fails on JSON', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('recommended for you');
  });

  it('Replaces text', async () => {
    config.locale.contentRoot = '/test/features/placeholders';
    const regex = /{{(.*?)}}/g;
    let text = 'Hello world {{recommended-for-you}}';
    text = await replaceText(config, regex, text);
    expect(text).to.equal('Hello world Recommended for you');
  });

  it('Replaces key', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('Recommended for you');
  });

  it('Gracefully falls back', async () => {
    const text = await replaceKey('this-wont-work', config);
    expect(text).to.equal('this wont work');
  });
});
