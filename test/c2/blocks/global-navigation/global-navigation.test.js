import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { decorateModalLinks, getFederalDomain, localizeGnavLinks } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { decorateAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';
import { getConfig, setConfig, notifyTargetReady } from '../../../../libs/utils/utils.js';

const DEFAULT = 'https://main--federal--adobecom.aem.page/federal';

describe('c2 global-navigation modal links', () => {
  let originalConfig;
  let root;
  let meta;

  beforeEach(() => {
    originalConfig = getConfig();
    setConfig({ codeRoot: '/libs', miloLibs: '/libs' });
    meta = document.createElement('meta');
    meta.name = 'foundation';
    meta.content = 'c2';
    document.head.append(meta);
    root = document.createElement('header');
    document.body.append(root);
  });

  afterEach(() => {
    root.remove();
    meta.remove();
    setConfig(originalConfig);
  });

  it('initializes duplicate modal CTAs and preserves navigation attributes', async () => {
    root.innerHTML = `
      <a class="feds-primary-cta" daa-ll="Eligibility" aria-label="Check eligibility"
        href="/in/edu-shared/fragments/check-eligibility#check-eligibility-nav">Check eligibility</a>
      <a class="feds-secondary-cta"
        href="/in/edu-shared/fragments/check-eligibility#check-eligibility-nav">Check again</a>`;
    await decorateModalLinks(root);
    await decorateModalLinks(root);
    root.querySelectorAll('a').forEach((link) => {
      expect(link.getAttribute('href')).to.equal('#check-eligibility-nav');
      expect(link.dataset.modalPath).to.equal('/in/edu-shared/fragments/check-eligibility');
      expect(link.dataset.modalHash).to.equal('#check-eligibility-nav');
      expect(link.dataset.blockStatus).to.equal('loaded');
      expect(link.classList.contains('modal')).to.be.true;
    });
    const link = root.querySelector('a');
    expect(link.classList.contains('feds-primary-cta')).to.be.true;
    expect(link.getAttribute('daa-ll')).to.equal('Eligibility');
    expect(link.getAttribute('aria-label')).to.equal('Check eligibility');
  });

  it('does not mutate other link types or special fragment markers', async () => {
    const hrefs = [
      '#section',
      '/page#section',
      '/fragments/content',
      '/fragments/content#_inline',
      '/fragments/content#_replacecell',
      '/fragments/content#_dnb',
      '/fragments/icon.svg',
      '/fragments/media_video.mp4#video',
      'https://example.com/fragments/modal#modal',
      'https://commerce.adobe.com/store/segmentation',
      'https://mas.adobe.com/studio.html#field=price',
    ];
    hrefs.forEach((href) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = href;
      root.append(link);
    });
    const html = root.innerHTML;
    await decorateModalLinks(root);
    expect(root.innerHTML).to.equal(html);
  });

  it('respects disabled autoblocks and checkout-owned links', async () => {
    root.innerHTML = '<a href="/fragments/modal#modal" data-wcs-osi="offer">Open</a>';
    const link = root.querySelector('a');
    await decorateModalLinks(root);
    expect(link.hasAttribute('data-modal-path')).to.be.false;
    link.removeAttribute('data-wcs-osi');
    getConfig().autoBlocks = [];
    await decorateModalLinks(root);
    expect(link.hasAttribute('data-modal-path')).to.be.false;
    expect(link.getAttribute('href')).to.equal('/fragments/modal#modal');
  });

  it('opens a modal deep link and allows reopening from the CTA', async () => {
    const path = '/in/edu-shared/fragments/check-eligibility';
    root.innerHTML = `<a href="${path}#nav-modal-deep-link">Check eligibility</a>`;
    const originalUrl = window.location.href;
    const realFetch = window.fetch.bind(window);
    const fetchStub = stub(window, 'fetch').callsFake((resource, options) => (
      String(resource).includes(`${path}.plain.html`)
        ? Promise.resolve(new Response('<div><h2>Check eligibility</h2></div>'))
        : realFetch(resource, options)
    ));
    window.history.replaceState(null, '', '#nav-modal-deep-link');
    notifyTargetReady();
    try {
      await decorateModalLinks(root);
      const { closeModal } = await import('../../../../libs/c2/blocks/modal/modal.js');
      const modal = document.querySelector('#nav-modal-deep-link.dialog-modal');
      expect(modal).to.exist;
      await closeModal(modal);
      const loaded = new Promise((resolve) => {
        window.addEventListener('milo:modal:loaded', resolve, { once: true });
      });
      const link = root.querySelector('a');
      link.focus();
      link.click();
      await loaded;
      expect(document.querySelector('#nav-modal-deep-link.dialog-modal')).to.exist;
      expect(window.location.pathname).to.equal(new URL(originalUrl).pathname);
    } finally {
      const { closeModal } = await import('../../../../libs/c2/blocks/modal/modal.js');
      const modal = document.querySelector('#nav-modal-deep-link.dialog-modal');
      if (modal) await closeModal(modal);
      window.history.replaceState(null, '', originalUrl);
      fetchStub.restore();
    }
  });
});

describe('c2 global-navigation decorateBody (localizeGnavLinks)', () => {
  let originalConfig;

  before(() => {
    originalConfig = getConfig();
    setConfig({
      locales: {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        fr: { ietf: 'fr-FR', tk: 'hah7vzn.css' },
      },
      pathname: '/fr/education/higher-ed.html',
      prodDomains: ['www.adobe.com'],
    });
  });

  after(() => setConfig(originalConfig));

  it('localizes regular links and leaves #_dnt links untouched', async () => {
    const { origin } = window.location;
    const body = document.createElement('div');
    body.innerHTML = `
      <a id="regular" href="${origin}/education/students.html">Students</a>
      <a id="dnt" href="${origin}/acrobat/student-spaces.html#_dnt">Student Spaces</a>`;

    await localizeGnavLinks(body);

    expect(body.querySelector('#regular').getAttribute('href'))
      .to.equal('/fr/education/students.html');
    expect(body.querySelector('#dnt').getAttribute('href'))
      .to.equal(`${origin}/acrobat/student-spaces.html#_dnt`);
  });
});

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
