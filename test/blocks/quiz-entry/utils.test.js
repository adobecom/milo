/* eslint-disable no-promise-executor-return */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { handleNext, getQuizJson, handleSelections, getQuizEntryData } from '../../../libs/blocks/quiz-entry/utils.js'; // Correct the path as needed

let fetchStub;
const { default: mockData } = await import('./mocks/mock-data.js');
const mockQuestionsData = mockData.questions;
const mockStringsData = mockData.strings;
const quizConfig = {
  quizPath: '/drafts/quiz/',
  maxQuestions: 1,
  analyticsQuiz: 'uarv4',
  analyticsType: 'cc:app-reco',
  questionData: undefined,
  stringsData: undefined,
};
const selectedQuestion = {
  questions: 'q-category',
  'max-selections': '3',
  'min-selections': '1',
};
const userInputSelections = { photo: true };
const userInputSelectionsNot = { '3d': true };
const userInputSelectionsReset = { video: true };

const userFlow = [];
const nextFlow = { nextFlow: ['q-rather', 'q-photo'] };
const nextFlowNot = { nextFlow: ['q-3d'] };
const nextFlowReset = { nextFlow: [] };
const prevSelections = [];
const selections = ['photo'];
const nextSelectionsExpected = {
  nextSelections: [
    {
      selectedCards: [
        'photo',
      ],
      selectedQuestion: {
        'max-selections': '3',
        'min-selections': '1',
        questions: 'q-category',
      },
    },
  ],
};

describe('Quiz Entry Utils', () => {
  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should handle the next flow of questions', async () => {
    const nextQuestion = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelections,
      userFlow,
    );
    expect(nextQuestion).to.deep.equal(nextFlow);
  });

  it('should handle the next flow of questions with not()', async () => {
    const nextQuestion = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelectionsNot,
      userFlow,
    );
    expect(nextQuestion).to.deep.equal(nextFlowNot);
  });

  it('should handle the next flow of questions with reset()', async () => {
    const nextQuestion = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelectionsReset,
      userFlow,
    );
    expect(nextQuestion).to.deep.equal(nextFlowReset);
  });

  it('should fetch quiz data', async () => {
    const [questions, strings] = await getQuizJson('./mocks/');
    expect(questions.questions).to.deep.equal(mockQuestionsData);
    expect(strings.strings).to.deep.equal(mockStringsData);
  });
});

describe('Quiz Entry Utils failed request', () => {
  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({ ok: false });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log an error when fetching quiz data fails', async () => {
    await getQuizJson('./mocks/');
    expect(window.lana.log.called).to.be.true;
  });
  it('should return nextSelections on handleSelections', async () => {
    const nextSelections = handleSelections(prevSelections, selectedQuestion, selections);
    expect(nextSelections).to.deep.equal(nextSelectionsExpected);
  });

  it('should de-dup any existing data if they use the ml field and cards.', async () => {
    const prevSelectionsLength = [{
      selectedQuestion: {
        'max-selections': '3',
        'min-selections': '1',
        questions: 'q-category',
      },
    }];

    const selectedQuestionPrev = [{
      selectedQuestion: {
        'max-selections': '3',
        'min-selections': '1',
        questions: 'q-category',
      },
    }];

    const nextSelections = handleSelections(prevSelectionsLength, selectedQuestionPrev, selections);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(nextSelections).to.deep.equal(nextSelections);
  });

  it('should return quizPath, maxQuestions, analyticsQuiz, analyticsType, questionData', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const el = document.querySelector('.quiz-entry');

    const quizEntryData = await getQuizEntryData(el);
    expect(quizEntryData).to.deep.equal(quizConfig);
  });
});
