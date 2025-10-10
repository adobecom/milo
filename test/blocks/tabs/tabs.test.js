import { readFile, sendKeys, setViewport } from '@web/test-runner-commands';
import { expect } from 'chai';
import { delay } from '../../helpers/waitfor.js';
import { loadStyle, setConfig } from '../../../libs/utils/utils.js';

const DESKTOP_WIDTH = 1200;
const MOBILE_WIDTH = 375;
const HEIGHT = 1500;

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, getRedirectionUrl, assignLinkedTabs, configTabs } = await import('../../../libs/blocks/tabs/tabs.js');
loadStyle('../../../libs/blocks/tabs/tabs.css');

describe('tabs', () => {
  sessionStorage.setItem('//demo3-tab-state', '2');
  const allTabs = document.querySelectorAll('.tabs');
  allTabs.forEach((tabs) => {
    init(tabs);
  });
  describe('default tabs', () => {
    it('has a tabList', () => {
      const tablist = allTabs[0].querySelector('div[role="tablist"]');
      expect(tablist).to.exist;
    });
  });

  it('clicks on a tabList button', async () => {
    const selectedButton = allTabs[0].querySelector('div[role="tablist"] button[aria-selected="true"]');
    const unselectedButton = allTabs[0].querySelectorAll('div[role="tablist"] button[aria-selected="false"]');
    unselectedButton[0].click();
    expect(unselectedButton[0].ariaSelected).to.equal('true');
    expect(selectedButton.ariaSelected).to.equal('false');
    expect(unselectedButton[1].ariaSelected).to.equal('false');
  });

  it('Focus on previously active tab with index saved in sessionStorage', async () => {
    let lsActiveTab = JSON.parse(sessionStorage.getItem('//demo3-tab-state'));
    expect(lsActiveTab).to.equal(2);
    expect(allTabs[6].querySelector('#tab-demo3-1').ariaSelected).to.equal('false');
    expect(allTabs[6].querySelector('#tab-demo3-2').ariaSelected).to.equal('true');
    allTabs[6].querySelector('#tab-demo3-1').click();
    expect(allTabs[6].querySelector('#tab-demo3-1').ariaSelected).to.equal('true');
    expect(allTabs[6].querySelector('#tab-demo3-2').ariaSelected).to.equal('false');
    lsActiveTab = JSON.parse(sessionStorage.getItem('//demo3-tab-state'));
    expect(lsActiveTab).to.equal(1);
  });

  it('focus on tabList button, ArrowRight key to next tab and Enter key to select aria', async () => {
    const unSelectedBtn1 = allTabs[1].querySelector('div[role="tablist"] button[aria-selected="false"]');
    const unSelectedBtn2 = allTabs[2].querySelector('div[role="tablist"] button[aria-selected="false"]');
    unSelectedBtn1.focus();
    await sendKeys({ down: 'ArrowRight' });
    await sendKeys({ press: 'Enter' });
    expect(unSelectedBtn1.ariaSelected).to.equal('true');

    unSelectedBtn2.focus();
    await sendKeys({ down: 'ArrowLeft' });
    await sendKeys({ press: 'Space' });
    expect(unSelectedBtn2.ariaSelected).to.equal('false');
  });

  it('disables paddles when tabList is not scrollable', async () => {
    setViewport({ width: DESKTOP_WIDTH, height: HEIGHT });
    window.dispatchEvent(new Event('resize'));
    await delay(200);
    const leftPaddle = allTabs[0].querySelector('.paddle-left');
    const rightPaddle = allTabs[0].querySelector('.paddle-right');

    expect(leftPaddle.getAttribute('disabled')).to.equal('');
    expect(rightPaddle.getAttribute('disabled')).to.equal('');
  });

  it('right paddle is visible when tabList is scrollable', async () => {
    setViewport({ width: MOBILE_WIDTH, height: HEIGHT });
    window.dispatchEvent(new Event('resize'));
    const rightPaddle = allTabs[0].querySelector('.paddle-right');

    expect(rightPaddle.getAttribute('disabled')).to.equal('');
  });

  it('right paddle scrolls tabList', async () => {
    setViewport({ width: MOBILE_WIDTH, height: HEIGHT });
    window.innerWidth = MOBILE_WIDTH;
    window.dispatchEvent(new Event('resize'));
    const tabList = allTabs[3].querySelector('[role="tablist"]');
    const rightPaddle = allTabs[3].querySelector('.paddle-right');
    tabList.scrollLeft = 0;
    await delay(200);

    expect(tabList.scrollLeft).to.equal(0);
    expect(rightPaddle.getAttribute('disabled')).to.equal(null);
    rightPaddle.click();
    await delay(300);

    expect(tabList.scrollLeft).to.not.equal(0);
  });

  it('left paddle scrolls tabList', async () => {
    setViewport({ width: MOBILE_WIDTH, height: HEIGHT });
    window.innerWidth = MOBILE_WIDTH;
    window.dispatchEvent(new Event('resize'));
    const tabList = allTabs[3].querySelector('[role="tablist"]');
    const leftPaddle = allTabs[3].querySelector('.paddle-left');
    await delay(200);

    expect(tabList.scrollLeft).to.not.equal(0);
    expect(leftPaddle.getAttribute('disabled')).to.equal(null);
    leftPaddle.click();
    await delay(300);

    expect(tabList.scrollLeft).to.equal(0);
  });

  describe('stacked mobile variant', () => {
    it('scrolls the window to the selected tab content', async () => {
      setViewport({ width: MOBILE_WIDTH, height: HEIGHT });
      window.dispatchEvent(new Event('resize'));
      const oldPosition = window.scrollY;
      document.querySelector('#stacked-mobile .tabList button').click();
      await delay(50);
      const newPosition = window.scrollY;
      expect(newPosition).to.be.above(oldPosition);
    });
  });

  describe('tabs with background color', () => {
    it('sets the background color of the active tab', async () => {
      const coloredTabs = document.querySelector('#colored');
      const tabs = coloredTabs.querySelectorAll('button[role="tab"]');
      expect(coloredTabs).to.exist;
      expect(tabs[0].style.backgroundColor).to.equal('rgb(255, 0, 0)');
      expect(tabs[1].style.backgroundColor).to.equal('');
      expect(tabs[2].style.backgroundColor).to.equal('');
      tabs[1].click();
      expect(tabs[0].style.backgroundColor).to.equal('');
      expect(tabs[1].style.backgroundColor).to.equal('rgb(255, 255, 0)');
      expect(tabs[2].style.backgroundColor).to.equal('');
      tabs[2].click();
      expect(tabs[0].style.backgroundColor).to.equal('');
      expect(tabs[1].style.backgroundColor).to.equal('');
      expect(tabs[2].style.backgroundColor).to.equal('rgb(255, 165, 0)');
    });

    it('sets tab panel IDs and data-nested-lh attributes', () => {
      const tabPanels = document.querySelectorAll('#colored div[role="tabpanel"]');
      tabPanels.forEach((panel, index) => {
        expect(panel.id).to.equal(`tab-panel-colored-${index + 1}`);
      });
      expect(tabPanels[0].getAttribute('data-nested-lh')).to.equal('t1Ind');
      expect(tabPanels[1].getAttribute('data-nested-lh')).to.equal('t2Bus');
      expect(tabPanels[2].getAttribute('data-nested-lh')).to.equal('t3Stu');
    });
  });

  describe('Tabs linked to pages', () => {
    it('returns an empty string when targetId or linked page are not valid', () => {
      expect(getRedirectionUrl({ 'tab-1': '/testpage-1' }, '')).to.equal('');
      expect(getRedirectionUrl({ 'tab-1': '/testpage-1' }, 'id-without-linked-page')).to.equal('');
    });

    it('replaces window.location.pathname with the linked page url', () => {
      const url = getRedirectionUrl({ 'tab-1': '/testpage-1' }, 'tab-1');
      expect(url.pathname).to.equal('/testpage-1');
    });

    it('does not save any data to linkedTabs object if invalid input', () => {
      const linkedTabsList = {};
      assignLinkedTabs(linkedTabsList, {}, '', '');
      expect(linkedTabsList).to.deep.equal({});
      assignLinkedTabs(linkedTabsList, { link: '/testpage' }, '', '');
      expect(linkedTabsList).to.deep.equal({});
      assignLinkedTabs(linkedTabsList, { link: '/testpage' }, 'id', '');
      expect(linkedTabsList).to.deep.equal({});
      assignLinkedTabs(linkedTabsList, { link: 'invalid link' }, 'id', 'val');
      expect(linkedTabsList).to.deep.equal({});
    });

    it('saves tab id and tab link into linkedTabs object with relative links', () => {
      const linkedTabsList = {};
      const metaSettings = { link: '/testpage-1' };
      const id = '1';
      const val = 'demo';
      assignLinkedTabs(linkedTabsList, metaSettings, id, val);
      expect(linkedTabsList).to.deep.equal({ 'tab-1-demo': '/testpage-1' });
    });

    it('saves tab id and tab link into linkedTabs object with fully qualified URLs', () => {
      const linkedTabsList = {};
      assignLinkedTabs(linkedTabsList, { link: 'https://example.com/testpage-1' }, '1', 'demo');
      expect(linkedTabsList['tab-1-demo']).to.exist;
      expect(linkedTabsList['tab-1-demo']).to.be.a('string');
      expect(linkedTabsList['tab-1-demo']).to.include('/testpage-1');

      setConfig({
        locales: { uk: { ietf: 'en-GB', tk: 'hah7vzn.css' } },
        pathname: '/uk/',
      });

      const linkedTabsListUK = {};
      assignLinkedTabs(linkedTabsListUK, { link: 'https://example.com/testpage-uk' }, '2', 'uk-demo');
      expect(linkedTabsListUK['tab-2-uk-demo']).to.exist;
      expect(linkedTabsListUK['tab-2-uk-demo']).to.be.a('string');
      expect(linkedTabsListUK['tab-2-uk-demo']).to.equal('/uk/testpage-uk');
    });

    it('tab buttons should have the attribute daa-state="true" and a daa-ll attribute', () => {
      const tablist = allTabs[0].querySelector('div[role="tablist"]');
      const buttonList = tablist.querySelectorAll('button');
      buttonList.forEach((button) => {
        expect(button.getAttribute('daa-state')).to.equal('true');
        expect(button.getAttribute('daa-ll')).to.exist;
      });
      expect(document.querySelector('#tab-2-tab-b').getAttribute('daa-ll')).to.equal('tab-2-tab-b');
    });
  });

  describe('Tabs with custom deeplink', () => {
    it('sets deeplink attribute to tab buttons', () => {
      const tabs = document.querySelector('#tabs-demo');
      expect(tabs.querySelector('button[id="tab-demo-1"]')?.dataset.deeplink).to.equal('custom-deeplink-1');
      expect(tabs.querySelector('button[id="tab-demo-2"]')?.dataset.deeplink).to.equal('custom-deeplink-2');
    });
  });
});

describe('Tabs preselected with query parameter or session storage state', () => {
  it('tab deeplinked', () => {
    const originalSearch = window.location.search;
    window.history.replaceState({}, null, `${window.location.pathname}?demo3=demo3_2`);

    const config = {
      'active-tab': '1',
      id: 'demo3',
      remember: 'on',
      'tab-id': 'demo3',
    };
    const tabsDemo3 = document.querySelector('#demo3 .tabs.pill');
    const btn = document.createElement('button');
    btn.setAttribute('data-deeplink', 'demo3_2');
    tabsDemo3.append(btn);
    configTabs(config, document, tabsDemo3);
    expect(tabsDemo3.getAttribute('daa-lh')).to.equal('deeplinked|tabs');

    btn.remove();
    window.history.replaceState({}, null, `${window.location.pathname}${originalSearch}`);
  });

  it('tab memorized', () => {
    sessionStorage.setItem('//demo3-tab-state', '1');
    const config = {
      'active-tab': '1',
      id: 'demo3',
      remember: 'on',
      'tab-id': 'demo3',
    };
    const tabsDemo3 = document.querySelector('#demo3 .tabs.pill');
    const tab = document.createElement('div');
    tab.setAttribute('id', 'tab-demo3-1');
    tabsDemo3.append(tab);
    configTabs(config, document, tabsDemo3);
    expect(tabsDemo3.getAttribute('daa-lh')).to.equal('memorized|tabs');
    tab.remove();
  });

  it('tab preselected', () => {
    const config = {
      'active-tab': '1',
      id: 'demo3',
      'tab-id': 'demo3',
    };
    const tabsDemo3 = document.querySelector('#demo3 .tabs.pill');
    const tab = document.createElement('div');
    tab.setAttribute('id', 'tab-demo3-1');
    tabsDemo3.append(tab);
    configTabs(config, document, tabsDemo3);
    expect(tabsDemo3.getAttribute('daa-lh')).to.equal('preselected|tabs');
    tab.remove();
  });
});
