import { readFile, sendMouse, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();
  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/tabs/tabs.js');

describe('tabs', () => {
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
    const unSelectedBtn = allTabs[0].querySelector('div[role="tablist"] button[aria-selected="false"]');
    const { x, y } = getMiddleOfElement(unSelectedBtn);
    await sendMouse({ type: 'click', position: [x, y] });
    expect(unSelectedBtn.ariaSelected).to.equal('true');
  });

  it('focus on tabList button, ArrowRight key to next tab and Enter key to select aria', async () => {
    const unSelectedBtn = allTabs[0].querySelector('div[role="tablist"] button[aria-selected="false"]');
    const unSelectedBtn1 = allTabs[1].querySelector('div[role="tablist"] button[aria-selected="false"]');
    unSelectedBtn.focus();
    await sendKeys({ down: 'ArrowRight' });
    await sendKeys({ press: 'Enter' });
    expect(unSelectedBtn.ariaSelected).to.equal('true');

    unSelectedBtn1.focus();
    await sendKeys({ down: 'ArrowLeft' });
    await sendKeys({ press: 'Space' });
    expect(unSelectedBtn1.ariaSelected).to.equal('false');
  });
});
