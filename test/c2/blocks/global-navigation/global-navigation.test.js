import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { getFederalDomain } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { decorateAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';

const DEFAULT = 'https://main--federal--adobecom.aem.page/federal';

describe('c2 global-navigation getFederalDomain fedsbranch validation', () => {
  let getStub;
  const setFedsbranch = (value) => {
    getStub = stub(URLSearchParams.prototype, 'get').callThrough();
    getStub.withArgs('fedsbranch').returns(value);
  };

  afterEach(() => {
    getStub?.restore();
  });

  describe('C2 Assistant in authored navigation wrappers', () => {
    let meta;

    beforeEach(() => {
      meta = document.createElement('meta');
      meta.name = 'acom-assistant';
      meta.content = 'on';
      document.head.append(meta);
    });

    afterEach(() => {
      meta.remove();
      document.body.innerHTML = '';
    });

    it('does not create a wrapper when authoring has not provided one', () => {
      document.body.innerHTML = '<header><nav><div class="feds-utilities"></div></nav></header>';
      expect(decorateAcomAssistantGnav(document.querySelector('header'))).to.be.null;
      expect(document.querySelector('.feds-bc-wrapper')).to.be.null;
    });

    it('mounts once in the existing wrapper without changing its placement', () => {
      document.body.innerHTML = `
        <header><nav>
          <div class="feds-utilities"></div>
          <div class="feds-bc-wrapper"></div>
        </nav></header>`;
      const header = document.querySelector('header');
      const wrapper = header.querySelector('.feds-bc-wrapper');
      const previous = wrapper.previousElementSibling;
      const mount = decorateAcomAssistantGnav(header);

      expect(mount.parentElement).to.equal(wrapper);
      expect(decorateAcomAssistantGnav(header)).to.equal(mount);
      expect(wrapper.previousElementSibling).to.equal(previous);
      expect(header.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    });

    it('does not mount when Assistant is disabled', () => {
      meta.content = 'off';
      document.body.innerHTML = '<header><nav><div class="feds-bc-wrapper"></div></nav></header>';

      expect(decorateAcomAssistantGnav(document.querySelector('header'))).to.be.null;
      expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    });

    it('does not mount when Assistant metadata is absent', () => {
      meta.remove();
      document.body.innerHTML = '<header><nav><div class="feds-bc-wrapper"></div></nav></header>';

      expect(decorateAcomAssistantGnav(document.querySelector('header'))).to.be.null;
      expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    });
  });

  it('accepts a valid branch name', () => {
    setFedsbranch('my-branch');
    expect(getFederalDomain({})).to.equal('https://my-branch--federal--adobecom.aem.page/federal');
  });

  it('accepts the local sentinel', () => {
    setFedsbranch('local');
    expect(getFederalDomain({})).to.equal('http://localhost:3000/federal');
  });

  it('lowercases before validating', () => {
    setFedsbranch('My-Branch');
    expect(getFederalDomain({})).to.equal('https://my-branch--federal--adobecom.aem.page/federal');
  });

  it('rejects a value that would break out of the host authority', () => {
    setFedsbranch('hoodhmnd.github.io/poc/x#');
    const result = getFederalDomain({});
    expect(result).to.not.include('github');
    expect(result).to.equal(DEFAULT);
  });

  it('rejects a slash-injected value', () => {
    setFedsbranch('foo/bar');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('rejects an at-sign-injected value', () => {
    setFedsbranch('foo@evil.com');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('ignores an empty value', () => {
    setFedsbranch('   ');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('ignores fedsbranch entirely on prod', () => {
    setFedsbranch('my-branch');
    expect(getFederalDomain({ clientEnv: 'prod' })).to.equal('https://www.adobe.com/federal');
  });

  // Locks the regex against every delimiter the exploit could use to escape the
  // host, plus a literal '%' (a double-encode attempt where get() returns raw %).
  ['foo/bar', 'a#b', 'a?b', 'evil.com:8080', 'a\\b', 'evil.github.io', 'a%2fb', 'foo bar']
    .forEach((value) => {
      it(`rejects dangerous value ${JSON.stringify(value)}`, () => {
        setFedsbranch(value);
        expect(getFederalDomain({})).to.equal(DEFAULT);
      });
    });
});

// These exercise the real window.location -> URLSearchParams decode path (no stub),
// so they guarantee the value is decoded BEFORE the regex runs. This is the property
// the exploit depends on: %2f/%23 must be rejected after decoding, not passed through.
describe('c2 global-navigation getFederalDomain real decode pipeline', () => {
  let restore;
  const setSearch = (search) => {
    const { pathname } = window.location;
    const original = window.location.search;
    window.history.replaceState(null, '', pathname + search);
    restore = () => window.history.replaceState(null, '', pathname + original);
  };

  afterEach(() => {
    restore?.();
    restore = null;
  });

  it('rejects the encoded breakout payload after real decoding', () => {
    setSearch('?fedsbranch=evil.github.io%2Fpoc%2Fx%23');
    const result = getFederalDomain({});
    expect(result).to.not.include('github');
    expect(result).to.equal(DEFAULT);
  });

  it('accepts a plain branch through the real decode path', () => {
    setSearch('?fedsbranch=my-branch');
    expect(getFederalDomain({})).to.equal('https://my-branch--federal--adobecom.aem.page/federal');
  });
});
