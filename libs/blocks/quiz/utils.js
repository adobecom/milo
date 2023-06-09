import { getMetadata } from '../section-metadata/section-metadata.js';
import { getConfig } from '../../utils/utils.js';

const QUESTIONS_EP_NAME = 'questions.json';
const STRINGS_EP_NAME = 'strings.json';
const RESULTS_EP_NAME = 'results.json';

let getConfigPath; let getQuizKey; let getAnalyticsType; let getAnalyticsQuiz; let metaData;
const { locale } = getConfig();

const initConfigPath = (roolElm) => {
  const link = roolElm.querySelector('.quiz > div > div > a');
  const quizConfigPath = link?.text.toLowerCase();
  return (filepath) => `${quizConfigPath}${filepath}`;
};

const initQuizKey = () => {
  getQuizKey = metaData.storagepath?.text;
  return locale.ietf ? `${getQuizKey}-${locale.ietf}` : getQuizKey;
};

const initAnalyticsType = () => metaData['analytics-type']?.text;

const initAnalyticsQuiz = () => metaData['analytics-quiz']?.text;

async function fetchContentOfFile(path) {
  const response = await fetch(getConfigPath(path));
  return response.json();
}

export const initConfigPathGlob = (rootElement) => {
  metaData = getMetadata(rootElement);
  getConfigPath = initConfigPath(rootElement);
  getQuizKey = initQuizKey(rootElement);
  getAnalyticsType = initAnalyticsType();
  getAnalyticsQuiz = initAnalyticsQuiz();
};

export const getQuizData = async () => {
  try {
    const [questions, datastrings] = await Promise.all(
      [fetchContentOfFile(QUESTIONS_EP_NAME), fetchContentOfFile(STRINGS_EP_NAME)],
    );
    return [questions, datastrings];
  } catch (ex) {
    console.log('Error while fetching data : ', ex);
  }
};

/**
 * Handling the result flow from here. Will need to make sure we capture all
 * the data so that we can come back.
 */
export const handleResultFlow = async (answers = []) => {
  const entireResultData = await parseResultData(answers);
  const resultData = entireResultData.filteredResults;
  const { resultResources } = entireResultData;
  let destinationPage = '';
  let primaryProductCodes = [];
  let secondaryProductCodes = [];
  let umbrellaProduct = '';

  if (resultData.matchedResults.length > 0) {
    destinationPage = resultData.matchedResults[0].url;
    primaryProductCodes = resultData.primary;
    secondaryProductCodes = resultData.secondary;
    umbrellaProduct = resultData.matchedResults[0]['umbrella-result'];
  }

  storeResultInLocalStorage(resultData, resultResources, primaryProductCodes, secondaryProductCodes, umbrellaProduct);

  window.location.href = getRedirectUrl(destinationPage, primaryProductCodes, answers);
};

const storeResultInLocalStorage = (resultData, resultResources, primaryProducts, secondaryProductCodes, umbrellaProduct) => {
  const nestedFrags = resultData.matchedResults[0]['nested-fragments'];
  const structureFrags = resultData.matchedResults[0]['basic-fragments'];

  const structureFragsArray = structureFrags?.split(',');
  const nestedFragsArray = nestedFrags?.split(',');

  const resultToDelegate = {
    primaryProducts,
    secondaryProducts: secondaryProductCodes,
    umbrellaProduct,
    basicFragments: structuredFragments(structureFragsArray, resultResources, primaryProducts, umbrellaProduct),
    nestedFragments: nestedFragments(nestedFragsArray, resultResources, primaryProducts, secondaryProductCodes, umbrellaProduct)
  };
  localStorage.setItem(getQuizKey, JSON.stringify(resultToDelegate));
};

const structuredFragments = (structureFragsArray, resultResources, primaryProducts, umbrellaProduct) => {
  let structureFragments = [];
  structureFragsArray.forEach((frag) => {
    frag = frag.trim();
    resultResources.data.forEach((row) => {
      if (umbrellaProduct) {
        if (umbrellaProduct && row.product === umbrellaProduct) {
          structureFragments.push(row[frag]);
        }
      } else if ((primaryProducts.length > 0 && primaryProducts.includes(row.product))) {
        if (row[frag]) {
          structureFragments.push(row[frag]);
        }
      }
    });
  });
  return structureFragments;
};

const nestedFragments = (nestedFragsArray, resultResources, primaryProducts, secondaryProductCodes, isUmbrella) => {
  const nestedObject = {};
  nestedFragsArray.forEach((frag) => {
    const fragKey = frag.trim();
    const fragArray = [];
    resultResources.data.forEach((row) => {
      if (isUmbrella) {
        // Get nested frags for all the primary products.
        if (primaryProducts.length > 0 && primaryProducts.includes(row.product)) {
          if (row[fragKey]) {
            fragArray.push(row[fragKey]);
          }
        }
      } else if (secondaryProductCodes.length > 0 && secondaryProductCodes.includes(row.product)) {
        // Get nested frags for all the secondary products.
        if (row[fragKey]) {
          fragArray.push(row[fragKey]);
        }
      }
    });
    nestedObject[fragKey] = fragArray;
  });

  return nestedObject;
};

const getRedirectUrl = (destinationPage, primaryProducts) => `${destinationPage}?primary=${primaryProducts}&quizKey=${getQuizKey}`;

const buildQueryParam = (answers) => answers.reduce((str, [questionId, answersFromUser], i) => `${str + (i > 0 ? '&' : '') + questionId}=${answersFromUser.join(',')}`, '');

const parseResultData = async (answers) => {
  const results  = await fetchContentOfFile(RESULTS_EP_NAME);
  const filteredResults = results.result.data.reduce(
    (resultObj, resultMap) => {
      let hasMatch = false;
      const resultRow = Object.entries(resultMap);

      for (let i = 0; i < resultRow.length; i++) {
        const key = resultRow[i][0];
        const val = resultRow[i][1];

        if (key.startsWith('q-') && val) {
          const answer = answers.find((a) => a[0] === key);
          if (answer && answer[1].includes(val)) {
            hasMatch = true;
          } else {
            // q-question value did not match any answers, entire row does not match
            return resultObj;
          }
        }
      }

      if (hasMatch) {
        resultObj.primary = resultObj.primary.concat(
          resultMap['result-primary'].split(','),
        );
        resultObj.secondary = resultObj.secondary.concat(
          resultMap['result-secondary'].split(','),
        );
      }

      return resultObj;
    },
    {
      primary: [],
      secondary: [],
    },
  );

  filteredResults.primary = [...new Set(filteredResults.primary.filter(Boolean))];
  filteredResults.secondary = [...new Set(filteredResults.secondary.filter(Boolean))];

  // Find result destination page.
  const matchedResults = findMatchForSelections(
    results['result-destination'].data,
    filteredResults,
  );

  filteredResults.matchedResults = matchedResults;

  const rObj = {};
  rObj.filteredResults = filteredResults;
  rObj.resultResources = results['result-fragments'];

  return rObj;
};

const getRecomandationResults = (selectedDestination, deafult) =>
  (selectedDestination.length ? selectedDestination : deafult);

// TODO: needs refactoring - can split to smaller functions
const findMatchForSelections = (results, selections) => {
  const recommendations = [];
  const matchResults = [];
  const defaultResult = [];

  results.forEach((destination) => {
    if (destination.result.indexOf('&') === -1) {
      matchResults.push(destination.result);
    }
    if (destination.result === 'default') {
      defaultResult.push(destination);
    }
  });

  // direct match ac and express in results destination. Applying and condition
  const isProductsMatched = selections.primary.every((product) => matchResults.includes(product));

  if (isProductsMatched) {
    // lr, ai
    selections.primary.forEach((product) => {
      results.forEach((destination) => {
        if (destination.result === product) {
          recommendations.push(destination);
        }
      });
    });

    return getRecomandationResults(recommendations, defaultResult);
  }

  const userSelectionLen = selections.primary.length; // 1 - lr

  if (userSelectionLen <= 1) {
    return defaultResult;
  }

  const compundResults = results.find((destination) => {
    if (destination.result.indexOf('&') !== -1 && destination.result.split('&').length === userSelectionLen) {
      return destination;
    }
  });

  const productList = compundResults.result.split('&');
  const isCompoundProductsMatched = selections.primary.every(
    (product, index) => productList[index].includes(product),
  );

  if (isCompoundProductsMatched) {
    recommendations.push(compundResults);

    return recommendations;
  }

  return defaultResult;
};

/**
 * Handles the behavior of the next button.
 */
export const handleNext = (questionsData, selectedQuestion, userInputSelections, userFlow) => {
  const allcards = Object.keys(userInputSelections);
  let nextQuizViews = [];
  let hasResultTigger = false;

  allcards.forEach((selection) => {
    // for each elem in current selection, find its coresponding
    // next element and push it to the next array.
    const nextItems = questionsData[selectedQuestion.questions].data;
    const getAllSelectedQuestionsRelatedOptions = nextItems.filter(
      (nextItem) => nextItem.options === selection,
    );

    getAllSelectedQuestionsRelatedOptions.forEach(( { options, next }) => {
      if (options === selection) {
        const flowStepsList = next.split(',');

        let regexStepsToSkip;
        flowStepsList.forEach((step) => {
          if (step.startsWith('NOT(')) regexStepsToSkip = step;
        });

        // regexStepsToSkip = 'NOT(q-rather)'
        if (regexStepsToSkip) {
          const stepsToSkip = regexStepsToSkip.substring(
            regexStepsToSkip.indexOf('(') + 1,
            regexStepsToSkip.lastIndexOf(')'),
          );

          // stepsToSkip = 'q-rather'
          const stepsToSkipArr = stepsToSkip.split(',');
          stepsToSkipArr.forEach((skip) => {
            nextQuizViews = nextQuizViews.filter((val) => val !== skip);
          });
        }

        // RESET the queue and add only the next question.
        if (flowStepsList.includes('RESET')) { // Reset to intial question
          nextQuizViews = []; // Resetting the nextQuizViews
          userFlow = []; // Resetting the userFlow as well
        }

        if (!hasResultTigger) {
          hasResultTigger = flowStepsList.includes('RESULT');
        }

        const filteredNextSteps = flowStepsList.filter((val) => (val !== 'RESULT' && val !== 'RESET' && !val.startsWith('NOT(')));

        nextQuizViews = [...nextQuizViews, ...filteredNextSteps];
      }
    });
  });

  return { nextQuizViews: [...new Set([...userFlow, ...nextQuizViews])] };
};

export const transformToFlowData = (userSelection) => {
  const flowData = userSelection.map(({ selectedCards, selectedQuestion}) => [selectedQuestion.questions, Object.keys(selectedCards)]);
  return flowData;
};
