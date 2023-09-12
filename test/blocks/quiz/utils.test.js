import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { userSelection, answers, resultRules, resultData } from './mocks/mock-states.js';

const {
  initConfigPathGlob, getQuizData, handleNext,
  getAnalyticsDataForBtn, structuredFragments, nestedFragments,
  getAnalyticsDataForLocalStorage, parseResultData,
  getRedirectUrl, transformToFlowData, storeResultInLocalStorage, findMatchForSelections,
  findAndStoreResultData,
} = await import('../../../libs/blocks/quiz/utils.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
const QUIZ_BASE_PATH = 'https://mockdata/path/to/quiz';

setConfig(conf);

let fetch; let quiz; let mockQuestionsData; let mockDataStrings;

async function mockQuizResourceCall(mockFilePath, resourceType) {
  const responseData = await readFile({ path: mockFilePath });
  fetch.withArgs(`${QUIZ_BASE_PATH}${resourceType}.json`).resolves({ ok: true, json: () => JSON.parse(responseData) });
}

describe('Quiz', () => {
  before(async () => {
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
  });

  after(() => {
    sinon.restore();
  });

  it('Checking config values from the quiz block', async () => {
    const { configPath, quizKey, analyticsType, analyticsQuiz } = initConfigPathGlob(quiz);
    expect(configPath).to.be.a('function');
    expect(quizKey).to.be.a.string;
    expect(analyticsType).to.be.a.string;
    expect(analyticsQuiz).to.be.a.string;
  });

  it('Checking quiz data', async () => {
    expect(mockQuestionsData).to.be.an('object');
    expect(mockDataStrings).to.be.an('object');
  });

  it('Checking general next button functionality', async () => {
    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const userInputSelections = { photo: true };

    const { nextQuizViews } = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelections,
      [],
    );
    expect(nextQuizViews).to.be.an('array').of.length(2);
    expect(nextQuizViews).to.include('q-photo');
    expect(nextQuizViews).to.include('q-rather');
  });

  it('Checking next button functionality when selection has a (NOT)', async () => {
    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const userInputSelections = { photo: true, '3d': true };
    const { nextQuizViews } = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelections,
      [],
    );
    expect(nextQuizViews).to.be.an('array').of.length(2);
    expect(nextQuizViews).does.not.include('q-rather');
    expect(nextQuizViews).that.includes('q-photo');
  });

  it('Checking next button functionality when selection has a (RESET)', async () => {
    const selectedQuestion = { questions: 'q-rather', 'max-selections': '1', 'min-selections': '1' };
    const userInputSelections = { template: true };
    const userFlow = ['q-photo'];
    const { nextQuizViews } = handleNext(
      mockQuestionsData,
      selectedQuestion,
      userInputSelections,
      userFlow,
    );
    expect(nextQuizViews).to.be.an('array').of.length(1);
    expect(nextQuizViews).does.not.include('q-photo');
    expect(nextQuizViews).that.includes('q-customer');
  });

  it('Checking next button analytics data', async () => {
    const analyticsDataForBtn = getAnalyticsDataForBtn(null, {});
    expect(analyticsDataForBtn).to.equal('');

    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const selectedCards = { photo: true };
    const analyticsDataForBtnQCat = getAnalyticsDataForBtn(selectedQuestion, selectedCards);
    expect(analyticsDataForBtnQCat).to.equal('Filters|cc:app-reco|q-category/photo');
  });

  it('Checking analytics data for local storage', async () => {
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(answers);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
  });

  it('Testing structured fragments', async () => {
    const resultResources = await readFile({ path: './mocks/result-resources.json' });
    const primaryProducts = ['express'];
    const structureFragsArray = ['marquee', 'card-list'];
    const structuredFrags = structuredFragments(structureFragsArray, JSON.parse(resultResources), primaryProducts, '');
    expect(structuredFrags).to.be.an('array');
    expect(structuredFrags.length).to.be.equal(1);
  });

  it('Testing nested fragments', async () => {
    const resultResources = await readFile({ path: './mocks/result-resources.json' });
    const nestedFragsPrimaryArray = ['check-bullet', 'marquee-plan'];
    const nestedFragsSecondaryArray = ['commerce-card'];
    const primaryProducts = ['lr-edu'];
    const secondaryProducts = ['ps-edu'];
    const umbrellaProduct = '';
    const nestedFrags = nestedFragments(
      nestedFragsPrimaryArray,
      nestedFragsSecondaryArray,
      JSON.parse(resultResources),
      primaryProducts,
      secondaryProducts,
      umbrellaProduct,
    );
    expect(nestedFrags).to.be.an('object');
    expect(nestedFrags).to.include.keys('commerce-card');
  });

  it('Testing redirect url', async () => {
    const primaryProducts = ['express'];
    const structuredFrags = getRedirectUrl('https://mockdata/path/to/quiz/uar-results', primaryProducts);
    expect(structuredFrags).to.be.an('string');
    expect(structuredFrags).to.include('express');
  });

  it('Testing result flow', async () => {
    const { destinationPage, primaryProductCodes } = await findAndStoreResultData(
      transformToFlowData(userSelection),
    );
    expect(destinationPage).to.be.an('string');
    expect(primaryProductCodes).to.be.an('array').of.length(2);
    expect(primaryProductCodes).to.include('lr-ind');
    expect(primaryProductCodes).to.include('pr-ind');
  });

  it('Testing how the result data is parsed', async () => {
    const resultObject = await parseResultData(answers);
    expect(resultObject).to.be.an('object');
    expect(resultObject).to.have.ownProperty('filteredResults');
  });

  it('Testing a direct product match and its recommendations', async () => {
    const matchingSelections = { primary: ['express'], secondary: [] };
    const matches = findMatchForSelections(resultRules, matchingSelections);
    const notMatched = findMatchForSelections(resultRules, { primary: ['whatever'], secondary: [] });
    expect(matches[0]).to.haveOwnProperty('umbrella-result').eq('');
    expect(matches).to.be.an('array').of.length(1);
    expect(notMatched).to.be.an('array');
    expect(notMatched[0]).to.haveOwnProperty('result').eq('default');
  });

  it('Testing transformToFlowData', async () => {
    const flowData = transformToFlowData(userSelection);
    expect(flowData).to.be.an('array').of.length(5);
  });

  it('Testing storeResultInLocalStorage', async () => {
    const resultResources = await readFile({ path: './mocks/result-resources.json' });
    const primaryProducts = [
      'lr-ind',
      'pr-ind',
    ];
    const secondaryProductCodes = [
      'ps-ind',
      'au-ind',
    ];
    const resultToDelegate = storeResultInLocalStorage(answers, resultData, JSON.parse(resultResources), primaryProducts, secondaryProductCodes, 'cc');
    expect(resultToDelegate).to.be.an('object');
    expect(resultToDelegate).to.haveOwnProperty('umbrellaProduct').eq('cc');
    expect(resultToDelegate).to.haveOwnProperty('primaryProducts').include('lr-ind');
    expect(resultToDelegate).to.haveOwnProperty('secondaryProducts').include('ps-ind');
  });
});
