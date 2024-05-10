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
    const {
      configPath,
      quizKey,
      analyticsType,
      analyticsQuiz,
      shortQuiz,
    } = initConfigPathGlob(quiz);
    expect(configPath).to.be.a('function');
    expect(quizKey).to.be.a.string;
    expect(analyticsType).to.be.a.string;
    expect(analyticsQuiz).to.be.a.string;
    expect(shortQuiz).to.be.a('boolean');
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

  it('Checking analytics data for local storage with null input', async () => {
    const analyticsConfig = {
      answers,
      umbrellaProduct: null,
      primaryProducts: null,
      analyticsType: 'cc:app-reco',
      analyticsQuiz: 'uarv3',
    };
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(analyticsConfig);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&result=&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
  });

  it('Checking analytics data for local storage', async () => {
    const analyticsConfig = {
      answers,
      umbrellaProduct: '',
      primaryProducts: [],
      analyticsType: 'cc:app-reco',
      analyticsQuiz: 'uarv3',
    };
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(analyticsConfig);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&result=&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
  });

  it('Checking analytics data for local storage with umbrella product', async () => {
    const analyticsConfig = {
      answers,
      umbrellaProduct: 'cc-ind',
      primaryProducts: [],
      analyticsType: 'cc:app-reco',
      analyticsQuiz: 'uarv3',
    };
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(analyticsConfig);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&result=cc-ind&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
  });

  it('Checking analytics data for local storage with other products', async () => {
    const analyticsConfig = {
      answers,
      umbrellaProduct: '',
      primaryProducts: ['ps-ind', 'ai-ind'],
      analyticsType: 'cc:app-reco',
      analyticsQuiz: 'uarv3',
    };
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(analyticsConfig);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&result=ps-ind|ai-ind&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
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
    const redirectUrl = getRedirectUrl('https://mockdata/path/to/quiz/uar-results');
    expect(redirectUrl).to.be.an('string');
    expect(redirectUrl).to.include('cc-quiz');
  });

  it('Testing result flow with invalid selections', async () => {
    const selectionData = await readFile({ path: './mocks/invalid-user-selection.json' });
    const selections = [];
    selections[0] = JSON.parse(selectionData);
    const { destinationPage, primaryProductCodes } = await findAndStoreResultData(
      transformToFlowData(selections),
    );
    expect(destinationPage).to.be.an('string');
    expect(primaryProductCodes).to.be.an('array').of.length(0);
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

  describe('Testing storeResultInLocalStorage with empty results as input', async () => {
    let resultToDelegate;
    const primaryProductCodes = [];
    const secondaryProductCodes = [];
    const umbrellaProductCode = '';
    const pageLoad = 'type=cc:app-reco&quiz=uarv3&result=&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual';
    before(async () => {
      const resultResourcesData = await readFile({ path: './mocks/result-resources.json' });
      const resultResources = JSON.parse(resultResourcesData);
      resultToDelegate = storeResultInLocalStorage(
        answers,
        resultData,
        resultResources,
        primaryProductCodes,
        secondaryProductCodes,
        umbrellaProductCode,
      );
    });
    it('should be an object', async () => {
      expect(resultToDelegate).to.be.an('object');
    });
    it('has property secondaryProducts and is an empty array', async () => {
      expect(resultToDelegate).to.haveOwnProperty('secondaryProducts').to.be.an('array').of.length(0);
    });
    it('has property umbrellaProduct and is equal to the empty string', async () => {
      expect(resultToDelegate).to.haveOwnProperty('umbrellaProduct').to.eq(umbrellaProductCode);
    });
    it(`has property pageloadHash and is equal to ${pageLoad}`, async () => {
      expect(resultToDelegate).to.haveOwnProperty('pageloadHash').to.eq(pageLoad);
    });
  });

  describe('Testing storeResultInLocalStorage', async () => {
    let resultToDelegate;
    const primaryProductCodes = [
      'lr-ind',
      'pr-ind',
    ];
    const secondaryProductCodes = [
      'ps-ind',
      'au-ind',
    ];
    const umbrellaProductCode = 'cc';
    const pageLoad = 'type=cc:app-reco&quiz=uarv3&result=cc&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual';
    before(async () => {
      const resultResourcesData = await readFile({ path: './mocks/result-resources.json' });
      const resultResources = JSON.parse(resultResourcesData);
      resultToDelegate = storeResultInLocalStorage(
        answers,
        resultData,
        resultResources,
        primaryProductCodes,
        secondaryProductCodes,
        umbrellaProductCode,
      );
    });
    console.log(resultToDelegate);
    it('should be an object', async () => {
      expect(resultToDelegate).to.be.an('object');
    });
    it(`has property primaryProducts which includes ${primaryProductCodes[0]}`, async () => {
      expect(resultToDelegate).to.haveOwnProperty('primaryProducts').include(primaryProductCodes[0]);
    });
    it(`has property secondaryProducts which includes ${secondaryProductCodes[0]}`, async () => {
      expect(resultToDelegate).to.haveOwnProperty('secondaryProducts').include(secondaryProductCodes[0]);
    });
    it(`has property umbrellaProduct and is equal to ${umbrellaProductCode}`, async () => {
      expect(resultToDelegate).to.haveOwnProperty('umbrellaProduct').to.eq(umbrellaProductCode);
    });
    it(`has property pageloadHash and is equal to ${pageLoad}`, async () => {
      expect(resultToDelegate).to.haveOwnProperty('pageloadHash').to.eq(pageLoad);
    });
  });
});
