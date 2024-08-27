import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig, loadBlock } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { init, createMartechMetadata } from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepSettings.js';
import placeholders from './mocks/placeholders.js';

document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

// Rest of the code...
const config = getConfig();
config.locale = { ietf: 'fr-fr' };
config.mep = {};

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('replace action', () => {
  it('testing create martech metadata output', async () => {
    // let { analyticLocalization } = getConfig().mep;
    // expect(getConfig().mep).to.deep.equal({});

    createMartechMetadata(placeholders, config, 'fr');

    console.log(getConfig().mep.analyticLocalization);

    expect(getConfig().mep.analyticLocalization).to.deep.equal({
      locale: { ietf: 'fr-fr' },
      mep: {
        analyticLocalization: {
          'value1 fr': 'value1 en us',
          'value2 fr': 'value2 en us',
          'bonjour fr': 'Hello en us',
          'buy now fr': 'buy now en us',
          'try now fr': 'try now en us',
        },
      },
    });
    // analyticLocalization = getConfig().mep.analyticLocalization;

    // let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    // manifestJson = JSON.parse(manifestJson);
    // setFetchResponse(manifestJson);

    // expect(document.querySelector('#features-of-milo-experimentation-platform')).to.not.be.null;
    // expect(document.querySelector('.how-to')).to.not.be.null;
    // const parentEl = document.querySelector('#features-of-milo-experimentation-platform')?.parentElement;

    // await init(mepSettings);
    // expect(document.querySelector('#features-of-milo-experimentation-platform')).to.be.null;
    // const el = parentEl.firstElementChild.firstElementChild;
    // expect(el.href)
    //   .to.equal('http://localhost:2000/test/features/personalization/mocks/fragments/milo-replace-content-chrome-howto-h2');
    // expect(getConfig().mep.commands[0].targetManifestId).to.equal(false);
    // // .how-to should not be changed as it is targeted to firefox
    // expect(document.querySelector('.how-to')).to.not.be.null;
  });
});
