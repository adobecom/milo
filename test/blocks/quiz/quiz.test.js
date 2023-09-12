import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { initConfigPathGlob, getQuizData } = await import('../../../libs/blocks/quiz/utils.js');
const { default: init, loadFragments } = await import('../../../libs/blocks/quiz/quiz.js');
const QUIZ_BASE_PATH = 'https://main--milo--adobecom.hlx.page/delta/app-recommender/';

let fetch; let quiz; let mockQuestionsData; let mockDataStrings;

async function mockQuizResourceCall(mockFilePath, resourceType) {
  const responseData = await readFile({ path: mockFilePath });
  fetch.withArgs(`${QUIZ_BASE_PATH}${resourceType}.json`).resolves({ ok: true, json: () => JSON.parse(responseData) });
}

describe('Quiz', () => {
  beforeEach(async () => {
    fetch = sinon.stub(window, 'fetch');
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizResourceCall('./mocks/questions.json', 'questions');
    await mockQuizResourceCall('./mocks/strings.json', 'strings');
    await mockQuizResourceCall('./mocks/results.json', 'results');
    const [questions, dataStrings] = await getQuizData(quiz);
    mockQuestionsData = questions;
    mockDataStrings = dataStrings;

    const initQuestion = {
      questionData: {
        questions: 'q-category',
        'max-selections': '3',
        'min-selections': '1',
      },
    };
    const el = document.querySelector('.quiz');
    await init(el, true, mockQuestionsData, mockDataStrings, initQuestion);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the initial "Loading" html when data is not loaded', async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-option')).to.exist;
  });

  it('should update the button when an option is selected', async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizOption = document.querySelector('.quiz-option');
    quizOption.click();
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-button').hasAttribute('disabled')).to.be.false;
  });

  it('should update the state when the next button is clicked', async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizOption = document.querySelector('.quiz-option');
    quizOption.click();
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizButton = document.querySelector('.quiz-button');
    quizButton.click();
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-step-container').children[1].classList.contains('current')).to.be.true;
  });

  it('Loads a fragment', async () => {
    const createFragmentStub = sinon.stub().resolves();
    const appendSpy = sinon.spy();
    const querySelectorStub = sinon.stub(document, 'querySelector').returns({ append: appendSpy });
    const fragmentUrl = 'https://main--milo--adobecom.hlx.page/delta/app-recommender/fragments/test.html';
    await loadFragments(fragmentUrl, createFragmentStub);
    expect(querySelectorStub.calledWith('.quiz-footer')).to.be.true;
    querySelectorStub.restore();
  });
});
