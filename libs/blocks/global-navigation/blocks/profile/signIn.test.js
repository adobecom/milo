import { expect } from '@esm-bundle/chai';
import { toFragment } from '../../utilities.js';
import decorateSignIn from './signIn.js';

const signInDropdown = () => toFragment`
  <div>
    <div>
      <ul>
        <li><a href="https://business.adobe.com/products/workfront/login.html">Workfront</a></li>
        <li><a href="https://adobe.com?sign-in=true">Adobe Account</a></li>
      </ul>
    </div>
  </div>
`;

const blockEl = (dropdown) => toFragment`
<div class="profile">
  <div>
    <div>
      <h5 id="acrobat">Acrobat</h5>
      <ul>
        <li><a href="https://adobe.com/settings">Settings</a></li>
        <li><a href="https://adobe.com/my-plan">My plan</a></li>
        <li><a href="https://adobe.com/third-link">Some third link</a></li>
      </ul>
    </div>
  </div>
  ${dropdown}
</div>
`;

describe('Profile Sign In button:', () => {
  afterEach(() => {
    window.adobeIMS = undefined;
  });

  it('Creates a sign in button', async () => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    const signIn = await decorateSignIn({
      blockEl: blockEl(''),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    });
    expect(signIn.nodeName).to.equal('A');
    expect(signIn.getAttribute('href')).to.equal('#');
    expect(signIn.getAttribute('daa-ll')).to.equal('Sign in Mockholder');
    expect(signIn.getAttribute('role')).to.equal(null);
    expect(signIn.classList.contains('feds-signin')).to.equal(true);
    expect(signIn.innerText).to.equal('Sign in Mockholder');
  });

  it('Links IMS to the sign in button', (done) => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    decorateSignIn({
      blockEl: blockEl(''),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    }).then((signInEl) => {
      window.adobeIMS = { signIn: () => done() };
      signInEl.click();
    });
  });

  it('Creates a sign in dropdown', async () => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    const signIn = await decorateSignIn({
      blockEl: blockEl(signInDropdown()),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    });
    expect(signIn.nodeName).to.equal('A');
    expect(signIn.getAttribute('href')).to.equal('#');
    expect(signIn.getAttribute('daa-ll')).to.equal('Sign in Mockholder');
    expect(signIn.getAttribute('role')).to.equal('button');
    expect(signIn.getAttribute('aria-expanded')).to.equal('false');
    expect(signIn.getAttribute('aria-controls')).to.equal('navmenu-profile');
    expect(signIn.getAttribute('daa-lh')).to.equal('header|Close');
    expect(signIn.getAttribute('aria-haspopup')).to.equal('true');
    expect(signIn.classList.contains('feds-signin')).to.equal(true);
    expect(signIn.innerText).to.equal('Sign in Mockholder');
  });

  it('Disables sign in when there is a dropdown', (done) => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    decorateSignIn({
      blockEl: blockEl(signInDropdown()),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    }).then((signInEl) => {
      window.adobeIMS = {
        signIn: () => {
          throw new Error('This should not happen!');
        },
      };
      signInEl.click();
      done();
    });
  });

  it('Sign in a user, using the dropdown', (done) => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    decorateSignIn({
      blockEl: blockEl(signInDropdown()),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    }).then(() => {
      window.adobeIMS = { signIn: () => done() };
      decoratedEl.querySelector('[href="https://adobe.com?sign-in=true"]').click();
    });
  });

  it('Sign in dropdown button emits an event on click', (done) => {
    const decoratedEl = toFragment`<div class="feds-profile"></div>`;
    decorateSignIn({
      blockEl: blockEl(signInDropdown()),
      decoratedEl,
      toFragment,
      getPlaceholder: () => new Promise((resolve) => {
        resolve(({ value: 'Sign in Mockholder' }));
      }),
    }).then((signIn) => {
      window.addEventListener('feds:profileSignIn:clicked', () => done(), { once: true });
      signIn.click();
    });
  });
});
