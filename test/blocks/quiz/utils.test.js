import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

const {
  initConfigPathGlob, getQuizData, handleNext,
  getAnalyticsDataForBtn, structuredFragments, nestedFragments,
  getAnalyticsDataForLocalStorage, parseResultData,
  getRedirectUrl, transformToFlowData, storeResultInLocalStorage, findMatchForSelections,
  findAndStoreResultData,
} = await import('../../../libs/blocks/quiz/utils.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
const QUIZ_BASE_PATH = 'https://main--milo--adobecom.hlx.page/delta/app-recommender/';

setConfig(conf);

let fetch;

async function mockQuizCall(mockFilePath, resourceType) {
  const responseData = await readFile({ path: mockFilePath });
  fetch.withArgs(`${QUIZ_BASE_PATH}${resourceType}.json`).resolves({ ok: true, json: () => JSON.parse(responseData) });
}

describe('Quiz', () => {
  before(() => {
    fetch = sinon.stub(window, 'fetch');
  });

  after(() => {
    sinon.restore();
  });

  it('Checking config values from the quiz block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    const { configPath, quizKey, analyticsType, analyticsQuiz } = initConfigPathGlob(quiz);
    expect(configPath).to.be.a('function');
    expect(quizKey).to.be.a.string;
    expect(analyticsType).to.be.a.string;
    expect(analyticsQuiz).to.be.a.string;
  });
  it('Checking quiz data', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    const [questions, dataStrings] = await getQuizData(quiz);
    expect(questions).to.be.an('object');
    expect(dataStrings).to.be.an('object');
  });
  it('Checking general next button functionality', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    const [questions] = await getQuizData(quiz);

    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const userInputSelections = { photo: true };

    const { nextQuizViews } = handleNext(questions, selectedQuestion, userInputSelections, []);
    expect(nextQuizViews).to.be.an('array');
  });
  it('Checking next button functionality when selection has a (NOT)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    const [questions] = await getQuizData(quiz);

    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const userInputSelections = { photo: true, '3d': true };
    // questionsData, selectedQuestion, userInputSelections, userFlow
    const { nextQuizViews } = handleNext(questions, selectedQuestion, userInputSelections, []);
    expect(nextQuizViews).does.not.include('q-rather');
    expect(nextQuizViews).that.includes('q-photo');
    expect(nextQuizViews).to.be.an('array');
  });
  it('Checking next button functionality when selection has a (RESET)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    const [questions] = await getQuizData(quiz);

    const selectedQuestion = { questions: 'q-rather', 'max-selections': '1', 'min-selections': '1' };
    const userInputSelections = { template: true };
    const userFlow = ['q-photo'];
    const { nextQuizViews } = handleNext(
      questions,
      selectedQuestion,
      userInputSelections,
      userFlow,
    );
    expect(nextQuizViews).to.be.an('array').of.length(1);
    expect(nextQuizViews).does.not.include('q-photo');
    expect(nextQuizViews).that.includes('q-customer');
  });
  it('Checking next button analytics data', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await getQuizData(quiz);
    const analyticsDataForBtn = getAnalyticsDataForBtn(null, {});
    expect(analyticsDataForBtn).to.equal('');

    const selectedQuestion = { 'max-selections': '3', 'min-selections': '1', questions: 'q-category' };
    const selectedCards = { photo: true };
    const analyticsDataForBtnQCat = getAnalyticsDataForBtn(selectedQuestion, selectedCards);
    expect(analyticsDataForBtnQCat).to.equal('Filters|cc:app-reco|q-category/photo');
  });
  it('Checking analytics data for local storage', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await getQuizData(quiz);
    const answers = [
      ['q-category', ['photo', 'video']],
      ['q-rather', ['custom']],
      ['q-photo', ['organize']],
      ['q-video', ['social']],
      ['q-customer', ['individual']],
    ];
    const analyticsDataForBtnQCat = getAnalyticsDataForLocalStorage(answers);
    expect(analyticsDataForBtnQCat).to.be.not.empty;
    expect(analyticsDataForBtnQCat).to.equal('type=cc:app-reco&quiz=uarv3&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual');
  });
  it('Testing structured fragments', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const resultResources = await readFile({ path: './mocks/result-resources.json' });
    const primaryProducts = ['express'];
    const structureFragsArray = ['marquee', 'card-list'];
    const structuredFrags = structuredFragments(structureFragsArray, JSON.parse(resultResources), primaryProducts, '');
    expect(structuredFrags).to.be.an('array');
    expect(structuredFrags.length).to.be.equal(1);
  });
  it('Testing nested fragments', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
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
  });
  it('Testing redirect url', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await getQuizData(quiz);
    const primaryProducts = ['express'];
    const structuredFrags = getRedirectUrl('https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results', primaryProducts);
    expect(structuredFrags).to.be.an('string');
  });
  it('Testing result flow', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const userSelection = [
      {
        selectedQuestion: {
          questions: 'q-category',
          'max-selections': '3',
          'min-selections': '1',
        },
        selectedCards: {
          photo: true,
          video: true,
        },
      },
      {
        selectedQuestion: {
          questions: 'q-rather',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { custom: true },
      },
      {
        selectedQuestion: {
          questions: 'q-photo',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { organize: true },
      },
      {
        selectedQuestion: {
          questions: 'q-video',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { social: true },
      },
      {
        selectedQuestion: {
          questions: 'q-customer',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { individual: true },
      },
    ];
    const { destinationPage, primaryProductCodes } = await findAndStoreResultData(
      transformToFlowData(userSelection),
    );
    // debugger;
    console.log(destinationPage);
    expect(destinationPage).to.be.an('string');
    expect(primaryProductCodes).to.be.an('array');
  });
  it('Testing how the result data is parsed', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const answers = [
      ['q-category', ['photo', 'video']],
      ['q-rather', ['custom']],
      ['q-photo', ['organize']],
      ['q-video', ['social']],
      ['q-customer', ['individual']],
    ];
    const resultObject = await parseResultData(answers);
    // console.log(resultObject);
    expect(resultObject).to.be.an('object');
    expect(resultObject).to.have.ownProperty('filteredResults');
    // expect(resultObject).to.nested.include('{filteredResults.primary : ["express"]}');
  });
  it('Testing a direct product match and its recommendations', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const resultRules = [
      {
        result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
        'umbrella-result': 'cc',
        url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': '',
        'nested-fragments-secondary': 'marquee-product, commerce-card',
      },
      {
        result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
        'umbrella-result': '',
        url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': 'check-bullet,marquee-plan',
        'nested-fragments-secondary': 'commerce-card',
      },
      {
        result: '(3d,ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(3d,ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
        'umbrella-result': '3d-umbrella',
        url: 'recommend-3d.html',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': '',
        'nested-fragments-secondary': '',
      },
      {
        result: 'default',
        'umbrella-result': '',
        url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': '',
        'nested-fragments-secondary': 'commerce-card',
      },
      {
        result: 'express',
        'umbrella-result': '',
        url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/borges/uar-marquee-samples/animate-results',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': '',
        'nested-fragments-secondary': 'commerce-card',
      },
    ];

    const defaultResult = [
      {
        result: 'default',
        'umbrella-result': '',
        url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results',
        'basic-fragments': 'marquee, card-list',
        'nested-fragments-primary': '',
        'nested-fragments-secondary': 'commerce-card',
      },
    ];

    const matchingSelections = { primary: ['express'], secondary: [] };

    const matches = findMatchForSelections(resultRules, matchingSelections);
    const notMatched = findMatchForSelections(resultRules, { primary: ['whatever'], secondary: [] });
    // console.log(matches);
    // console.log(notMatched);
    expect(matches).to.be.an('array');
    expect(notMatched).to.be.an('array');
    // expect(notMatched).to.deep.include(defaultResult);
    // expect(notMatched[0]).to.deep.include(defaultResult);
    // expect(notMatched[0]).to.have.ownProperty('result');
    // expect(notMatched).to.have.members(defaultResult);
    // expect(resultObject).to.nested.include('{filteredResults.primary : ["express"]}');
  });
  it('Testing transformToFlowData', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const userSelection = [
      {
        selectedQuestion: {
          questions: 'q-category',
          'max-selections': '3',
          'min-selections': '1',
        },
        selectedCards: {
          photo: true,
          video: true,
        },
      },
      {
        selectedQuestion: {
          questions: 'q-rather',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { custom: true },
      },
      {
        selectedQuestion: {
          questions: 'q-photo',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { organize: true },
      },
      {
        selectedQuestion: {
          questions: 'q-video',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { social: true },
      },
      {
        selectedQuestion: {
          questions: 'q-customer',
          'max-selections': '1',
          'min-selections': '1',
        },
        selectedCards: { individual: true },
      },
    ];
    const flowData = transformToFlowData(userSelection);
    // [
    //   [ 'q-category', [ 'photo', 'video' ] ],
    //   [ 'q-rather', [ 'custom' ] ],
    //   [ 'q-photo', [ 'organize' ] ],
    //   [ 'q-video', [ 'social' ] ],
    //   [ 'q-customer', [ 'individual' ] ]
    // ]

    expect(flowData).to.be.an('array');
  });
  it('Testing storeResultInLocalStorage', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/index.html' });
    const quiz = document.querySelector('.quiz');
    initConfigPathGlob(quiz);
    await mockQuizCall('./mocks/questions.json', 'questions');
    await mockQuizCall('./mocks/strings.json', 'strings');
    await mockQuizCall('./mocks/results.json', 'results');
    await getQuizData(quiz);
    const answers = [
      [
        'q-category',
        [
          'photo',
          'video',
        ],
      ],
      [
        'q-rather',
        [
          'custom',
        ],
      ],
      [
        'q-photo',
        [
          'organize',
        ],
      ],
      [
        'q-video',
        [
          'social',
        ],
      ],
      [
        'q-customer',
        [
          'individual',
        ],
      ],
    ];

    const resultData = {
      primary: [
        'lr-ind',
        'pr-ind',
      ],
      secondary: [
        'ps-ind',
        'au-ind',
      ],
      matchedResults: [
        {
          result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
          'umbrella-result': 'cc',
          url: 'https://uar-integration--milo--adobecom.hlx.page/drafts/colloyd/uar-results-block/uar-results',
          'basic-fragments': 'marquee, card-list',
          'nested-fragments': 'marquee-product, commerce-card',
        },
      ],
    };
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
    // {
    //   primaryProducts: [ 'lr-ind', 'pr-ind' ],
    //   secondaryProducts: [ 'ps-ind', 'au-ind' ],
    //   umbrellaProduct: 'cc',
    //   basicFragments: [
    //     'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-marquee-cc',
    //     'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-card-list'
    //   ],
    //   nestedFragments: {
    //     'marquee-product': [
    //       'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-marquee-product-lr',
    //       'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-marquee-product-pr'
    //     ],
    //     'commerce-card': [
    //       'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-card-lr',
    //       'https://main--milo--adobecom.hlx.page/fragments/colloyd/sample-uar-fragments/uar-sample-card-pr'
    //     ]
    //   },
    //   pageloadHash: 'type=cc:app-reco&quiz=uarv3&selectedOptions=q-category/photo/video|q-rather/custom|q-photo/organize|q-video/social|q-customer/individual'
    // }

    // console.log(resultToDelegate);
    expect(resultToDelegate).to.be.an('object');
    // expect(resultObject).to.be.an('object');
  });
});
