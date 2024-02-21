/* eslint-disable no-promise-executor-return */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { handleResultFlow } from '../../../libs/blocks/quiz/utils.js';

const { initConfigPathGlob, getQuizData } = await import('../../../libs/blocks/quiz/utils.js');
const { default: init } = await import('../../../libs/blocks/quiz/quiz.js');
const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
const QUIZ_BASE_PATH = 'https://mockdata/path/to/quiz';

setConfig(conf);

let fetchStub; let quiz; let mockQuestionsData; let mockDataStrings;
const test = [
  [
    'q#1',
    [
      'photo',
    ],
  ],
  [
    'q#2',
    [
      'template',
    ],
  ],
  [
    'q#4',
    [
      'ste',
    ],
  ],
];
const userSelection = [
  {
    selectedQuestion: {
      questions: 'q#1',
      'max-selections': '3',
      'min-selections': '1',
    },
    selectedCards: { photo: true },
  },
  {
    selectedQuestion: {
      questions: 'q#2',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { template: true },
  },
  {
    selectedQuestion: {
      questions: 'q#4',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { ste: true },
  },
];
async function mockQuizResourceCall(mockFilePath, resourceName) {
  const responseData = await readFile({ path: mockFilePath });
  fetchStub.withArgs(`${QUIZ_BASE_PATH}${resourceName}`).resolves({ ok: true, json: () => JSON.parse(responseData) });
}

describe('Quiz Fragment Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="quiz-footer"></div>';
    fetchStub = sinon.stub(window, 'fetch').callsFake((url) => {
      if (url === 'https://example.com/fragment.plain.html') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Mocked Fragment Content'),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('should load a fragment into the quiz footer', async () => {
    const { loadFragments } = await import('../../../libs/blocks/quiz/quiz.js');
    const testFragmentURL = 'https://example.com/fragment';

    await loadFragments(testFragmentURL);

    const quizFooter = document.querySelector('.quiz-footer');
    const fragmentLink = quizFooter.querySelector('a[href="https://example.com/fragment"]');
    expect(fragmentLink).to.exist;
  });
});

describe('Quiz', () => {
  beforeEach(async () => {
    fetchStub = sinon.stub(window, 'fetch');
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
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-option')).to.exist;
  });

  it('should update the button when an option is selected', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizOption = document.querySelector('.quiz-option');
    quizOption.click();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-button').hasAttribute('disabled')).to.be.false;
  });

  it('should update the state when the next button is clicked', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizOption = document.querySelector('.quiz-option');
    quizOption.click();

    await new Promise((resolve) => setTimeout(resolve, 100));
    const quizButton = document.querySelector('.quiz-button');
    quizButton.click();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.querySelector('.quiz-step-container').children[1].classList.contains('current')).to.be.true;
  });
});

describe('Quiz URL Parameter Tests', () => {
  let replaceStateSpy;

  beforeEach(async () => {
    fetchStub = sinon.stub(window, 'fetch');
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizResourceCall('./mocks/questions.json', 'questions.json');
    await mockQuizResourceCall('./mocks/strings.json', 'strings.json');
    await mockQuizResourceCall('./mocks/results.json', 'results.json');
    const [questions, dataStrings] = await getQuizData(quiz);
    mockQuestionsData = questions;
    mockDataStrings = dataStrings;
    const testValue = '%5B%7B%22selectedQuestion%22%3A%7B%22questions%22%3A%22q-category%22%2C%22max-selections%22%3A%223%22%2C%22min-selections%22%3A%221%22%7D%2C%22selectedCards%22%3A%7B%22photo%22%3Atrue%7D%7D%2C%7B%22selectedQuestion%22%3A%7B%22questions%22%3A%22q-rather%22%2C%22max-selections%22%3A%221%22%2C%22min-selections%22%3A%221%22%7D%2C%22selectedCards%22%3A%7B%22template%22%3Atrue%7D%7D%2C%7B%22selectedQuestion%22%3A%7B%22questions%22%3A%22q-customer%22%2C%22max-selections%22%3A%221%22%2C%22min-selections%22%3A%221%22%7D%2C%22selectedCards%22%3A%7B%22educational%22%3Atrue%7D%7D%5D';
    const url = new URL(window.location);
    url.searchParams.set('debug-results', testValue);
    window.history.pushState({}, '', url);
    replaceStateSpy = sinon.spy(window.history, 'replaceState');
    const el = document.querySelector('.quiz');
    await init(el, true, true, mockQuestionsData, mockDataStrings, userSelection, false);
  });

  afterEach(() => {
    fetchStub.restore();
    replaceStateSpy.restore();
  });

  it('should redirect to results page with quizkey parameter', async () => {
    const redirectStub = sinon.stub();
    await handleResultFlow(test, redirectStub);
    const expectedUrl = '/path/to/result?quizkey=cc-quiz';
    sinon.assert.calledWith(redirectStub, expectedUrl);
  });
});
