import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { initConfigPath } = await import('../../../libs/blocks/quiz/utils.js');
const { default: init } = await import('../../../libs/blocks/quiz/quiz.js');

describe('Quiz', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/quiz.html' });
    init();
  });

  it('Renders the quiz component', () => {
    expect(document.querySelector('.quiz')).to.exist;
  });

  it('Renders the dot indicators', () => {
    expect(document.querySelector('.dot-indicators')).to.exist;
  });

  it('Renders the quiz options', () => {
    expect(document.querySelectorAll('.quiz-option').length).to.exist;
  });

  it('Renders the Next button', () => {
    expect(document.querySelector('.quiz-btn')).to.exist;
  });

  it('Disables the Next button initially', () => {
    expect(document.querySelector('.quiz-btn').hasAttribute('disabled')).to.be.true;
  });

  it('Selecting a quiz option enables the Next button', () => {
    const quizOption = document.querySelector('.quiz-option');
    const nextButton = document.querySelector('.quiz-btn');

    quizOption.click();

    expect(nextButton.hasAttribute('disabled')).to.be.false;
  });

  it('Clicking Next button moves to the next step', async () => {
    const quizOption = document.querySelector('.quiz-option');
    const nextButton = document.querySelector('.quiz-btn');

    quizOption.click();
    nextButton.click();

    await new Promise((resolve) => setTimeout(resolve, 100)); // Allow time for the transition

    expect(document.querySelectorAll('.dot')[1].classList.contains('current')).to.be.true;
  });

  it('returns a function that concatenates quizConfigPath and filepath', () => {
    const result = initConfigPath({ quizurl: { text: 'https://adobe.com.com/' } });
    const innerResult = result('questions.json');
    expect(innerResult).to.equal('https://adobe.com.com/questions.json');
  });

  it('returns a function that concatenates stringsPath and filepath if stringsPath is present', () => {
    const urlSearchParams = sinon.stub(URLSearchParams.prototype, 'get');
    urlSearchParams.returns('alternate-data');
    const getConfigPath = initConfigPath({ quizurl: { text: 'https://adobe.com/' } });
    expect(getConfigPath('config.json')).to.equal('alternate-data/config.json');
    urlSearchParams.restore();
  });
});
