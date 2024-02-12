import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { delay } from '../../helpers/waitfor.js';

window.lana = { log: stub() };
localStorage.clear();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, LOADING_ERROR } = await import('../../../libs/blocks/quiz-results/quiz-results.js');
const { default: mockData } = await import('./mocks/quiz-results.mock-data.js');

describe('Quiz Results', () => {
  it('Doesnt load data without local storage', async () => {
    const el = document.body.querySelector('.basic');
    localStorage.clear();

    await init(el, 'quiz-results', 'quiz-result-test');

    expect(window.lana.log.args[0][0]).to.equal(`${LOADING_ERROR} local storage missing`);
  });
  it('Doesnt load data without basicFragments in local storage', async () => {
    const el = document.body.querySelector('.basic-one');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockOne));

    await init(el, 'quiz-results', 'quiz-result-test');

    expect(window.lana.log.args[1][0]).to.equal(`${LOADING_ERROR} Basic fragments are missing`);
  });
  it('Loads basic fragments', async () => {
    const el = document.body.querySelector('.basic-one');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockTwo));

    await init(el, 'quiz-results', 'quiz-result-test');

    await delay(700);
    expect(el.querySelector('h1')).to.be.exist;
  });
  it('Loads nested fragments', async () => {
    const el = document.body.querySelector('.nested-one');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockTwo));
    await init(el, 'quiz-results', 'quiz-result-test');

    await delay(700);
    expect(el.querySelector('h2')).to.be.exist;
  });
  it('Sets style values', async () => {
    const el = document.body.querySelector('.nested-two');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockTwo));

    await init(el, 'quiz-results', 'quiz-result-test');

    await delay(700);
    expect(el.classList.contains('section')).to.be.true;
    expect(el.classList.contains('m-spacing')).to.be.true;
  });
  it('Sets analytics customHash', async () => {
    const el = document.body.querySelector('.basic-two');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockThree));

    await init(el, 'quiz-results', 'quiz-result-test');

    /* eslint-disable no-underscore-dangle */
    expect(window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.customHash).to.equal('test analytics value');
  });
  it('Sets section, block and link analytics attributes', async () => {
    const el = document.body.querySelector('.basic-three');
    localStorage.setItem('quiz-result-test', JSON.stringify(mockData.mockTwo));

    await init(el, 'quiz-results', 'quiz-result-test');

    await delay(700);
    expect(document.querySelector('main > div').getAttribute('daa-lh')).to.equal(null);
    expect(el.getAttribute('daa-lh')).to.equal(null);
    expect(el.querySelector('.fragment > .section').getAttribute('daa-lh')).to.equal('s3');
    expect(el.querySelector('.fragment > .section > .content').getAttribute('daa-lh')).to.equal('b1|content');
    expect(el.querySelector('a').getAttribute('daa-ll')).to.equal('Fragment link-1--This is a basic frag');
  });
});
