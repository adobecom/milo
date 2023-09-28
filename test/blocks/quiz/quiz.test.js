import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

const { initConfigPathGlob, getQuizData } = await import('../../../libs/blocks/quiz/utils.js');
const { default: init } = await import('../../../libs/blocks/quiz/quiz.js');
const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
const QUIZ_BASE_PATH = 'https://mockdata/path/to/quiz';

setConfig(conf);

let fetch; let quiz; let mockQuestionsData; let mockDataStrings;

async function mockQuizResourceCall(mockFilePath, resourceName) {
  const responseData = await readFile({ path: mockFilePath });
  fetch.withArgs(`${QUIZ_BASE_PATH}${resourceName}`).resolves({ ok: true, json: () => JSON.parse(responseData) });
}

describe('Quiz', () => {
  beforeEach(async () => {
    fetch = sinon.stub(window, 'fetch');
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizResourceCall('./mocks/questions.json', 'questions.json');
    await mockQuizResourceCall('./mocks/strings.json', 'strings.json');
    await mockQuizResourceCall('./mocks/results.json', 'results.json');
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
});
