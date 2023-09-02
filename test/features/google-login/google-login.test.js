import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import initGoogleLogin from '../../../libs/features/google-login.js';

describe('Google Login', () => {
  let initializeSpy;
  let promptSpy;
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/google-login.html' });
    window.google = window.google || {
      accounts: {
        id: {
          initialize: () => {},
          prompt: () => {},
        },
      },
    };
    initializeSpy = sinon.spy(window.google.accounts.id, 'initialize');
    promptSpy = sinon.spy(window.google.accounts.id, 'prompt');
    window.adobeid = {
      client_id: 'milo',
      scope: 'gnav',
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    initializeSpy.restore();
    promptSpy.restore();
    delete window.adobeid;
    delete window.google;
  });

  it('should create a placeholder to inject DOM markup', async () => {
    await initGoogleLogin(sinon.stub(), sinon.stub(), sinon.stub());
    expect(document.getElementById('feds-googleLogin')).to.exist;
  });

  it('should initialize and render the login element', async () => {
    await initGoogleLogin(sinon.stub(), sinon.stub(), sinon.stub());
    expect(initializeSpy.called).to.be.true;
    expect(promptSpy.called).to.be.true;
    expect(initializeSpy.getCall(0).args[0].prompt_parent_id).to.equal('feds-googleLogin');
  });

  it('should exchange tokens with adobeIMS after login', async () => {
    window.adobeIMS = window.adobeIMS || {
      socialHeadlessSignIn: () => {},
      isSignedInUser: () => false,
      signInWithSocialProvider: () => {},
    };

    // No account
    const socialHeadlessSignInStub = sinon.stub(window.adobeIMS, 'socialHeadlessSignIn')
      .returns(new Promise((resolve, reject) => { reject(); }));
    const signInWithSocialProviderSpy = sinon.spy(window.adobeIMS, 'signInWithSocialProvider');
    await initGoogleLogin(sinon.stub(), sinon.stub(), sinon.stub());
    let onToken = initializeSpy.getCall(0).args[0].callback;
    await onToken(sinon.stub(), sinon.stub());
    expect(signInWithSocialProviderSpy.called).to.be.true;

    // Existing account
    socialHeadlessSignInStub.returns(new Promise((resolve) => { resolve(); }));
    await initGoogleLogin(sinon.stub(), sinon.stub(), sinon.stub());
    onToken = initializeSpy.getCall(0).args[0].callback;
    window.DISABLE_PAGE_RELOAD = true;
    signInWithSocialProviderSpy.resetHistory();
    await onToken(sinon.stub(), sinon.stub());
    expect(signInWithSocialProviderSpy.called).not.to.be.true;
    expect(document.getElementById('feds-googleLogin')).to.exist;
    signInWithSocialProviderSpy.restore();
    socialHeadlessSignInStub.restore();
    delete window.DISABLE_PAGE_RELOAD;
  });

  it('should not initialize if IMS is not ready or user is already logged-in', async () => {
    window.adobeIMS = window.adobeIMS || { isSignedInUser: () => {} };
    const loggedInStub = sinon.stub(window.adobeIMS, 'isSignedInUser').returns(() => true);
    await initGoogleLogin(sinon.stub(), sinon.stub(), sinon.stub());
    expect(document.getElementById('feds-googleLogin')).not.to.exist;
    await initGoogleLogin(Promise.reject, sinon.stub(), sinon.stub());
    expect(document.getElementById('feds-googleLogin')).not.to.exist;
    loggedInStub.restore();
  });
});
