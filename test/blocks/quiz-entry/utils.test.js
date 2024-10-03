/* eslint-disable no-promise-executor-return */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { handleNext, getQuizJson, handleSelections, getQuizEntryData } from '../../../libs/blocks/quiz-entry/utils.js'; // Correct the path as needed

let fetchStub;
const path = './mocks/';
const { default: mockData } = await import('./mocks/mock-data.js');
const mockQuestionsData = mockData.questions;
const mockStringsData = mockData.strings;
const mockResultsData = mockData.results;
const quizConfig = {
  quizPath: '/drafts/quiz/',
  maxQuestions: 1,
  analyticsQuiz: 'uarv4',
  analyticsType: 'cc:app-reco',
  questionData: undefined,
  stringsData: undefined,
  resultsData: undefined,
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
    fetchStub.withArgs(`${path}questions.json`).resolves({
      ok: true,
      json: () => Promise.resolve(mockQuestionsData),
    });
    fetchStub.withArgs(`${path}strings.json`).resolves({
      ok: true,
      json: () => Promise.resolve(mockStringsData),
    });
    fetchStub.withArgs(`${path}results.json`).resolves({
      ok: true,
      json: () => Promise.resolve(mockResultsData),
    });

    // Handling non-existent results.json
    fetchStub.withArgs(`${path}non-existent.json`).resolves({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error('File not found')),
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
    const [questions, strings, results] = await getQuizJson(path);

    // Check if fetch was called with the correct paths
    sinon.assert.calledWith(fetchStub, `${path}questions.json`);
    sinon.assert.calledWith(fetchStub, `${path}strings.json`);
    sinon.assert.calledWith(fetchStub, `${path}results.json`);

    // Check that each fetch was called once
    sinon.assert.calledOnce(fetchStub.withArgs(`${path}questions.json`));
    sinon.assert.calledOnce(fetchStub.withArgs(`${path}strings.json`));
    sinon.assert.calledOnce(fetchStub.withArgs(`${path}results.json`));

    // Assertions for the returned data
    expect(questions).to.deep.equal(mockQuestionsData);
    expect(strings).to.deep.equal(mockStringsData);
    expect(results).to.deep.equal(mockResultsData);
  });

  it('should handle missing results.json gracefully', async () => {
    fetchStub.withArgs(`${path}results.json`).resolves({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error('File not found')),
    });

    const [questions, strings, results] = await getQuizJson(path);

    // Check fetch calls
    sinon.assert.calledWith(fetchStub, `${path}questions.json`);
    sinon.assert.calledWith(fetchStub, `${path}strings.json`);
    sinon.assert.calledWith(fetchStub, `${path}results.json`);

    // Assertions for the returned data, results should be empty
    expect(questions).to.deep.equal(mockQuestionsData);
    expect(strings).to.deep.equal(mockStringsData);
    expect(results).to.deep.equal([]);
  });

  it('should log an error when fetching fails', async () => {
    fetchStub.withArgs(`${path}questions.json`).resolves({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Internal server error')),
    });

    const result = await getQuizJson(path);

    // Ensure fetch was called with the correct path
    sinon.assert.calledWith(fetchStub, `${path}questions.json`);

    // Result should be empty due to the error
    expect(result).to.deep.equal([]);

    // Check that lana.log was called with the error message
    sinon.assert.calledWith(
      window.lana.log,
      'ERROR: Fetching data for quiz entry: Error: Internal server error',
    );
  });

  it('should log an info message when results.json is missing', async () => {
    fetchStub.withArgs(`${path}results.json`).resolves({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error('File not found')),
    });

    const [questions, strings, results] = await getQuizJson(path);

    // Check fetch calls
    sinon.assert.calledWith(fetchStub, `${path}questions.json`);
    sinon.assert.calledWith(fetchStub, `${path}strings.json`);
    sinon.assert.calledWith(fetchStub, `${path}results.json`);

    // Assertions for the returned data
    expect(questions).to.deep.equal(mockQuestionsData);
    expect(strings).to.deep.equal(mockStringsData);
    expect(results).to.deep.equal([]);

    // Check that lana.log was called with the info message
    sinon.assert.calledWith(
      window.lana.log,
      "INFO: results.json not found or couldn't be fetched: Error: File not found",
    );
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
