import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

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
});
