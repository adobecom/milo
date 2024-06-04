import { setViewport } from '@web/test-runner-commands';
import sinon from 'sinon';
import init from '../../../libs/features/webapp-prompt/webapp-prompt.js';
import { viewports, mockRes as importedMockRes } from '../../blocks/global-navigation/test-utilities.js';
import { getConfig, loadStyle, setConfig, updateConfig } from '../../../libs/utils/utils.js';

export const allSelectors = {
  fedsUtilities: '.feds-utilities',
  pepWrapper: '.appPrompt',
  closeIcon: '.appPrompt-close',
  promptIcon: '.appPrompt-icon',
  avatarImage: '.appPrompt-avatar-image',
  title: '.appPrompt-title',
  footer: '.appPrompt-footer',
  subtitle: '.appPrompt-text',
  cta: '.appPrompt-cta--close',
  progressWrapper: '.appPrompt-progressWrapper',
  progress: '.appPrompt-progress',
  appSwitcher: '#unav-app-switcher',
};

export const defaultConfig = {
  color: '#b30b00',
  loaderDuration: 7500,
  redirectUrl: 'https://www.adobe.com/?pep=true',
  productName: 'photoshop',
};

export const mockRes = importedMockRes;

export const initPep = async ({ entName = 'firefly-web-usage', isAnchorOpen = false, getAnchorStateMock = false }) => {
  setConfig({
    imsClientId: 'milo',
    codeRoot: '/libs',
    locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  });
  updateConfig({ ...getConfig(), entitlements: () => ['firefly-web-usage'] });
  await setViewport(viewports.desktop);
  await loadStyle('../../../libs/features/webapp-prompt/webapp-prompt.css');

  const pep = await init({
    promptPath: 'https://pep-mocks.test/pep-prompt-content.plain.html',
    getAnchorState: getAnchorStateMock || (async () => ({ id: 'unav-app-switcher', isOpen: isAnchorOpen })),
    entName,
    parent: document.querySelector('div.feds-utilities'),
  });

  sinon.stub(pep, 'initRedirect').callsFake(() => null);
  return pep;
};
