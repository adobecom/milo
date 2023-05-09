import { expect } from '@esm-bundle/chai';
import { setConfig, loadArea, createTag } from '../../../libs/utils/utils.js';
import { replaceText } from '../../../libs/features/tooltips.js';
const { default: loadIcons } = await import('../../../libs/features/icons.js');

const config = { codeRoot: '/libs' };
setConfig(config);

describe('Tooltips', () => {
  it('no match', async () => {
    let text = 'This is a tooltip';

    const regex = /\[(.*?)\]\(## "(.*?)"(|\s([a-z,]+))\)/g;
    const acutal = await replaceText(text, config, regex);

    const expected = 'This is a tooltip';
    
    expect(acutal).to.equal(expected);
  });

  it('Replaces text', async () => {
    let text = '<p>Left [<span class="icon icon-info"></span>](## "Tooltip" left)</p>' +
      '<p>Right [Tooltip Text](## "Tooltip" right)</p>' +
      '<p>Top [Tooltip Text](## "Tooltip" top,info)</p>' +
      '<p>Bottom [Tooltip Text](## "Tooltip" bottom)</p>' +
      '<p>Default [Tooltip Text](## "Tooltip")</p>';

    const regex = /\[(.*?)\]\(## "(.*?)"(|\s([a-z,]+))\)/g;
    const acutal = await replaceText(text, config, regex);

    const expected = '<p>Left <span class="milo-tooltip left" data-tooltip="Tooltip"><span class="icon icon-info"></span></span></p>' + 
      '<p>Right <span class="milo-tooltip right" data-tooltip="Tooltip">Tooltip Text</span></p>' + 
      '<p>Top <span class="milo-tooltip top" data-tooltip="Tooltip">Tooltip Text</span></p>' + 
      '<p>Bottom <span class="milo-tooltip bottom" data-tooltip="Tooltip">Tooltip Text</span></p>' + 
      '<p>Default <span class="milo-tooltip" data-tooltip="Tooltip">Tooltip Text</span></p>';
    
    expect(acutal).to.equal(expected);
  });

  it('no text string', async () => {
    let text = [];

    const regex = /\[(.*?)\]\(## "(.*?)"(|\s([a-z,]+))\)/g;
    const acutal = await replaceText(text, config, regex);

    const expected = '';
    
    expect(acutal).to.equal(expected);
  });  

  it('show tooltips', async () => {
    document.body.innerHTML = '<main><div>' +
      '<p>Right [Tooltip Text](## "MyTooltip" right)</p>' +
      '<p>Left [<span class="icon icon-info"></span>](## "MyTooltip" left)</p>' +
      '<p>Top [Tooltip Text](## "MyTooltip" top,info)</p>' +
      '<p>Bottom [Tooltip Text](## "MyTooltip" bottom)</p>' +
      '<p>Default [Tooltip Text](## "MyTooltip")</p>' +
      '</div></main>';
    document.head.append(createTag('link', { rel: 'icon'}));
    document.head.append(createTag('link', { rel: 'stylesheet', href: '/libs/styles/styles.css'}));   
    await loadArea(document);    
    const tooltips = document.querySelectorAll('.milo-tooltip');
    for (let tt of tooltips) {
      const contentBefore = getComputedStyle(tt, ':before').content;
      expect(contentBefore).to.be.eql('"MyTooltip"');
    }
  });   
});
