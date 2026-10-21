import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getConfig, setConfig, createTag, loadDeferred } from '../../../libs/utils/utils.js';
import status, { tooltipInfo, ACTIVE, INACTIVE, ENABLED, RESET } from '../../../libs/features/dynamic-navigation/status.js';
import { resetCookieAvailability } from '../../../libs/features/dynamic-navigation/dynamic-navigation.js';

const COOKIE = 'dynamicNav';
const GNAV_SOURCE = 'https://main--milo--adobecom.aem.live/some-source-string';

const clearCookie = () => { document.cookie = `${COOKIE}=; Max-Age=0; Path=/`; };
const seedCookie = (value) => {
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/`;
};
const setGroupMeta = (group) => {
  document.querySelector('meta[name="dynamic-nav-group"]')?.remove();
  if (group === null) return;
  const meta = createTag('meta', { name: 'dynamic-nav-group', content: group });
  document.head.appendChild(meta);
};

const statusText = (parentElement) => ({
  additionalInfo: parentElement.querySelector('.additional-info span').innerText,
  status: parentElement.querySelector('.details .status span').innerText,
  setting: parentElement.querySelector('.details .setting span').innerText,
  cookies: parentElement.querySelector('.details .cookies-available span').innerText,
  match: parentElement.querySelector('.nav-source-info p:nth-child(1) span').innerText,
  authoredSource: parentElement.querySelector('.nav-source-info p:nth-child(2) span').innerText,
  storedSource: parentElement.querySelector('.nav-source-info p:nth-child(3) span').innerText,
});

describe('Dynamic Nav Status', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/status.html' });
    document.head.innerHTML = '<meta name="dynamic-nav" content=""><meta name="gnav-source" content="">';
    clearCookie();
    document.cookie = 'OptanonConsent=groups=C0003%3A1; Path=/';
    resetCookieAvailability();
    setConfig({ dynamicNavKey: 'bacom' });
  });

  afterEach(() => {
    clearCookie();
    document.cookie = 'OptanonConsent=; Max-Age=0; Path=/';
  });

  it('does not load the widget on production', async () => {
    const conf = getConfig();
    conf.env.name = 'prod';

    await loadDeferred(document, [], conf, () => {});

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget).to.be.null;
  });

  it('does load the widget on a lower env', async () => {
    const conf = getConfig();
    conf.env.name = 'local';

    await loadDeferred(document, [], conf, () => {});

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget).to.exist;
  });

  it('does not load the widget when gnav v2 is not present', () => {
    const globalNav = document.querySelector('.global-navigation');
    globalNav.classList.remove('global-navigation');
    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget).to.be.null;
    globalNav.classList.add('global-navigation');
  });

  it('loads the status widget', () => {
    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget).to.not.be.null;
  });

  it('loads the status widget in an active state', () => {
    document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
    seedCookie({ s: GNAV_SOURCE });

    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget.classList.contains(ACTIVE)).to.be.true;
  });

  it('loads the status widget in an enabled state', () => {
    document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');

    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget.classList.contains(ENABLED)).to.be.true;
  });

  it('loads the status widget in a reset state', () => {
    document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'reset');

    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget.classList.contains(RESET)).to.be.true;
  });

  it('loads the status widget in an inactive state', () => {
    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusWidget.classList.contains(INACTIVE)).to.be.true;
  });

  it('reports cookies as available', () => {
    document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    expect(statusText(statusWidget).cookies).to.equal('Yes');
  });

  ['entry', 'on', 'reset'].forEach((setting) => {
    it(`reports ${setting} as inactive when functional consent is denied`, () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', setting);
      seedCookie({ s: GNAV_SOURCE });
      document.cookie = 'OptanonConsent=groups=C0003%3A0; Path=/';
      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      expect(statusWidget.classList.contains(INACTIVE)).to.be.true;
      expect(statusWidget.querySelector('.functional-consent span').innerText)
        .to.equal('No (using authored navigation)');
    });
  });

  it('reports the cookie scope for the current environment', () => {
    document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
    status();

    const statusWidget = document.querySelector('.dynamic-nav-status');
    // The test runner serves from localhost, so the scope is host-only (local).
    expect(statusWidget.querySelector('.cookie-scope span').innerText).to.equal('Host-only (local)');
  });

  describe('content validation', () => {
    it('displays the correct information to the user for the active state "entry"', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'entry');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', GNAV_SOURCE);

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[ACTIVE]);
      expect(info.status).to.equal(ACTIVE);
      expect(info.setting).to.equal('entry');
      expect(info.match).to.equal('true');
      expect(info.authoredSource).to.equal('/some-source-string');
      expect(info.storedSource).to.equal('/some-source-string');
    });

    it('displays the correct information to the user for the active state "on"', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[ACTIVE]);
      expect(info.status).to.equal(ACTIVE);
      expect(info.setting).to.equal('on');
      expect(info.match).to.equal('false');
      expect(info.authoredSource).to.equal('/test');
      expect(info.storedSource).to.equal('/some-source-string');
    });

    it('displays the correct information to the user for the active state "off"', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', '');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[INACTIVE]);
      expect(info.status).to.equal(INACTIVE);
      expect(info.setting).to.equal('');
      expect(info.match).to.equal('true');
      expect(info.authoredSource).to.equal('/test');
      expect(info.storedSource).to.equal('/test');
    });

    it('displays the correct information to the user for the enabled state "on"', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[ENABLED]);
      expect(info.status).to.equal(ENABLED);
      expect(info.setting).to.equal('on');
      expect(info.match).to.equal('true');
      expect(info.authoredSource).to.equal('/test');
      expect(info.storedSource).to.equal('/test');
    });

    it('displays the correct information to the user for the enabled state "reset"', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'reset');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[RESET]);
      expect(info.status).to.equal(RESET);
      expect(info.setting).to.equal('reset');
      expect(info.match).to.equal('true');
      expect(info.authoredSource).to.equal('/test');
      expect(info.storedSource).to.equal('/test');
    });

    it('displays the correct information for a group match', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      setGroupMeta('test');
      seedCookie({ s: GNAV_SOURCE, g: 'test' });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const group = statusWidget.querySelector('.group span');
      const groupMatch = statusWidget.querySelector('.group-match span');

      expect(group.innerText).to.equal('test');
      expect(groupMatch.innerText).to.equal('Yes');
      expect(statusWidget.classList.contains(ACTIVE)).to.be.true;
    });

    it('displays the correct information for a group mismatch', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      setGroupMeta('test');
      seedCookie({ s: GNAV_SOURCE, g: 'no-test' });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const group = statusWidget.querySelector('.group span');
      const groupMatch = statusWidget.querySelector('.group-match span');

      expect(group.innerText).to.equal('test');
      expect(groupMatch.innerText).to.equal('No');
      expect(statusWidget.classList.contains(INACTIVE)).to.be.true;
    });

    it('displays the correct information for no group being set', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      setGroupMeta(null);
      seedCookie({ s: GNAV_SOURCE, g: 'no-test' });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const group = statusWidget.querySelector('.group span');
      const groupMatch = statusWidget.querySelector('.group-match span');

      expect(group.innerText).to.equal('Group not set');
      expect(groupMatch.innerText).to.equal('No');
      expect(statusWidget.classList.contains(INACTIVE)).to.be.true;
    });

    it('is active for an ungrouped page following an ungrouped stored nav', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      setGroupMeta(null);
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      expect(statusWidget.classList.contains(ACTIVE)).to.be.true;
    });
  });

  describe('cookies unavailable', () => {
    let descriptor;
    beforeEach(() => {
      descriptor = Object.getOwnPropertyDescriptor(window.navigator, 'cookieEnabled')
        || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window.navigator), 'cookieEnabled');
      Object.defineProperty(window.navigator, 'cookieEnabled', { configurable: true, get: () => false });
    });
    afterEach(() => {
      // eslint-disable-next-line compat/compat
      delete window.navigator.cookieEnabled;
      if (descriptor && descriptor.configurable && descriptor.get) {
        Object.defineProperty(window.navigator, 'cookieEnabled', descriptor);
      }
    });

    it('reports cookies as unavailable and keeps the authored navigation', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.cookies).to.equal('No (using authored navigation)');
      expect(info.storedSource).to.equal('/test');
    });
  });

  describe('disabled values', () => {
    it('loads the status widget in an inactive state when disable values are present', () => {
      const disableTag = createTag('meta', { name: 'dynamic-nav-disable', content: 'PrimaryProductName;Commerce Cloud' });
      const ppn = createTag('meta', { name: 'primaryproductname', content: 'Commerce Cloud' });
      document.querySelector('head').append(disableTag, ppn);
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[INACTIVE]);
      expect(info.status).to.equal(INACTIVE);
    });

    it('loads the status widget in an active state when disabled values present but not correct', () => {
      const disableTag = createTag('meta', { name: 'dynamic-nav-disable', content: 'PrimaryProductName;Digital Media' });
      const ppn = createTag('meta', { name: 'primaryproductname', content: 'Commerce Cloud' });
      document.querySelector('head').append(disableTag, ppn);
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      expect(info.additionalInfo).to.equal(tooltipInfo[ACTIVE]);
      expect(info.status).to.equal(ACTIVE);
    });

    it('shows the correct disable values that are active in a table', () => {
      const disableTag = createTag('meta', { name: 'dynamic-nav-disable', content: 'PrimaryProductName;Commerce Cloud' });
      const ppn = createTag('meta', { name: 'primaryproductname', content: 'Commerce Cloud' });
      document.querySelector('head').append(disableTag, ppn);
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');
      document.querySelector('meta[name="gnav-source"]').setAttribute('content', 'https://main--milo--adobecom.aem.live/test');
      seedCookie({ s: GNAV_SOURCE });

      status();

      const statusWidget = document.querySelector('.dynamic-nav-status');
      const info = statusText(statusWidget);
      const disableValuesTable = statusWidget.querySelector('.disable-values');
      expect(info.additionalInfo).to.equal(tooltipInfo[INACTIVE]);
      expect(info.status).to.equal(INACTIVE);
      expect(disableValuesTable.querySelector('caption')).to.exist;
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(1)')).to.exist;
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(1)').innerText).to.equal('PrimaryProductName');
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(2)')).to.exist;
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(2)').innerText).to.equal('Commerce Cloud');
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(3)')).to.exist;
      expect(disableValuesTable.querySelector('tbody tr td:nth-child(3)').innerText).to.equal('yes');
    });
  });

  describe('Event listeners', () => {
    it('toggles the details', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');

      status();

      const dynamicNavStatus = document.querySelector('.dynamic-nav-status');
      const details = dynamicNavStatus.querySelector('.details');

      expect(details.classList.contains('hidden')).to.be.true;
      dynamicNavStatus.click();
      expect(details.classList.contains('hidden')).to.be.false;
    });

    it('removes the whole status when close is clicked', () => {
      document.querySelector('meta[name="dynamic-nav"]').setAttribute('content', 'on');

      status();

      let dynamicNavStatus = document.querySelector('.dynamic-nav-status');
      const details = dynamicNavStatus.querySelector('.details');
      dynamicNavStatus.click();
      const closeButton = details.querySelector('.dns-close');
      closeButton.click();
      dynamicNavStatus = document.querySelector('.dynamic-nav-status');
      expect(dynamicNavStatus).to.be.null;
    });
  });
});
