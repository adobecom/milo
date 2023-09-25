/* eslint-disable no-use-before-define */
import { getMetadata } from '../section-metadata/section-metadata.js';
import { getConfig } from '../../utils/utils.js';

const QUESTIONS_EP_NAME = 'questions.json';
const STRINGS_EP_NAME = 'strings.json';
const RESULTS_EP_NAME = 'results.json';

let configPath; let quizKey; let analyticsType; let analyticsQuiz; let metaData;

const initConfigPath = (quizMetaData) => {
  const quizConfigPath = quizMetaData.quizurl.text.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const stringsPath = urlParams.get('quiz-data');
  return (filepath) => `${stringsPath || quizConfigPath}${filepath}`;
};

const initQuizKey = () => {
  const { locale } = getConfig();
  quizKey = metaData.storagepath?.text;
  return locale?.ietf ? `${quizKey}-${locale.ietf}` : quizKey;
};

const initAnalyticsType = () => metaData['analytics-type']?.text;

const initAnalyticsQuiz = () => metaData['analytics-quiz']?.text;

async function fetchContentOfFile(path) {
  const response = await fetch(configPath(path));
  return response.json();
}

export const initConfigPathGlob = (rootElement) => {
  metaData = getMetadata(rootElement);
  configPath = initConfigPath(metaData);
  quizKey = initQuizKey(rootElement);
  analyticsType = initAnalyticsType();
  analyticsQuiz = initAnalyticsQuiz();
  return { configPath, quizKey, analyticsType, analyticsQuiz };
};

export const getQuizData = async () => {
  try {
    const [questions, dataStrings] = await Promise.all(
      [fetchContentOfFile(QUESTIONS_EP_NAME), fetchContentOfFile(STRINGS_EP_NAME)],
    );
    return [questions, dataStrings];
  } catch (ex) {
    window.lana?.log(`ERROR: Fetching data for quiz flow ${ex}`);
  }
  return [];
};

export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  urlParams.forEach((value, key) => {
    params[key] = value?.split(',');
  });
  return params;
};

export const handleResultFlow = async (answers = []) => {
  const { destinationPage, primaryProductCodes } = await findAndStoreResultData(answers);
  window.location.href = getRedirectUrl(destinationPage, primaryProductCodes, answers);
};

/**
 * Handling the result flow from here. Will need to make sure we capture all
 * the data so that we can come back.
 */
export const findAndStoreResultData = async (answers = []) => {
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

  storeResultInLocalStorage(
    answers,
    resultData,
    resultResources,
    primaryProductCodes,
    secondaryProductCodes,
    umbrellaProduct,
  );
  return {
    destinationPage,
    primaryProductCodes,
  };
};

export const storeResultInLocalStorage = (
  answers,
  resultData,
  resultResources,
  primaryProducts,
  secondaryProductCodes,
  umbrellaProduct,
) => {
  const nestedFragsPrimary = resultData.matchedResults[0]['nested-fragments-primary'];
  const nestedFragsSecondary = resultData.matchedResults[0]['nested-fragments-secondary'];
  const structureFrags = resultData.matchedResults[0]['basic-fragments'];

  const structureFragsArray = structureFrags?.split(',');
  const nestedFragsPrimaryArray = nestedFragsPrimary?.split(',');
  const nestedFragsSecondaryArray = nestedFragsSecondary?.split(',');
  const resultToDelegate = {
    primaryProducts,
    secondaryProducts: secondaryProductCodes,
    umbrellaProduct,
    basicFragments: structuredFragments(
      structureFragsArray,
      resultResources,
      primaryProducts,
      umbrellaProduct,
    ),
    nestedFragments: nestedFragments(
      nestedFragsPrimaryArray,
      nestedFragsSecondaryArray,
      resultResources,
      primaryProducts,
      secondaryProductCodes,
      umbrellaProduct,
    ),
    pageloadHash: getAnalyticsDataForLocalStorage(answers),
  };
  localStorage.setItem(quizKey, JSON.stringify(resultToDelegate));
  return resultToDelegate;
};

export const structuredFragments = (
  structureFragsArray,
  resultResources,
  primaryProducts,
  umbrellaProduct,
) => {
  const structureFragments = [];
  structureFragsArray.forEach((frag) => {
    const fragment = frag.trim();
    resultResources?.data?.forEach((row) => {
      if (umbrellaProduct) {
        if (umbrellaProduct && row.product === umbrellaProduct) {
          structureFragments.push(row[fragment]);
        }
      } else if (primaryProducts.length > 0 && primaryProducts.includes(row.product)
      && row[fragment]) {
        structureFragments.push(row[fragment]);
      }
    });
  });
  return structureFragments;
};

/**
 * Nested fragments are picked from primary and secondary products.
 * If umbrella product is present, then umbrella product becomes the primary product
 * and primary products becomes secondary products.
 */
export const nestedFragments = (
  nestedFragsPrimaryArray,
  nestedFragsSecondaryArray,
  resultResources,
  primaryProducts,
  secondaryProducts,
  umbrellaProduct,
) => {
  let primaryProductCodes = primaryProducts;
  let secondaryProductCodes = secondaryProducts;
  if (umbrellaProduct) {
    secondaryProductCodes = primaryProductCodes;
    primaryProductCodes = [umbrellaProduct];
  }
  const nestedObject = {};
  nestedFragsPrimaryArray?.forEach((frag) => {
    if (!frag) return;
    const fragKey = frag.trim();
    nestedObject[fragKey] = getNestedFragments(
      resultResources,
      primaryProductCodes,
      fragKey,
    );
  });

  nestedFragsSecondaryArray?.forEach((frag) => {
    if (!frag) return;
    const fragKey = frag.trim();
    if (!nestedObject[fragKey]) nestedObject[fragKey] = [];
    nestedObject[fragKey].push(...getNestedFragments(
      resultResources,
      secondaryProductCodes,
      fragKey,
    ));
  });

  return nestedObject;
};

const getNestedFragments = (resultResources, productCodes, fragKey) => {
  const fragArray = [];
  productCodes?.forEach((product) => {
    resultResources?.data?.forEach((row) => {
      if (product && product === row?.product) {
        insertFragment();
      }

      function insertFragment() {
        row[fragKey]?.split(',').forEach((val) => {
          fragArray.push(val.trim());
        });
      }
    });
  });
  return fragArray;
};

export const getRedirectUrl = (destinationPage, primaryProducts) => {
  const separator = destinationPage.includes('?') ? '&' : '?';
  return `${destinationPage}${separator}primary=${primaryProducts}&quizKey=${quizKey}`;
};

export const parseResultData = async (answers) => {
  const results = await fetchContentOfFile(RESULTS_EP_NAME);
  const filteredResults = results.result.data.reduce(
    (resultObj, resultMap) => {
      let hasMatch = false;
      const resultRow = Object.entries(resultMap);

      for (let i = 0; i < resultRow.length; i += 1) {
        const key = resultRow[i][0];
        const val = resultRow[i][1];

        if (!key.startsWith('result-') && val) {
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

const getRecommendedResults = (selectedDestination, defaultValue) => (selectedDestination.length
  ? selectedDestination : defaultValue);

export const findMatchForSelections = (results, selections) => {
  const recommendations = [];
  const matchResults = [];
  const defaultResult = [];

  results.forEach((destination) => {
    if (!destination.result.includes('(')) {
      matchResults.push(destination.result);
    }
    if (destination.result === 'default') {
      defaultResult.push(destination);
    }
  });

  // direct match ac and express in results destination. Applying and condition
  const isProductsMatched = selections.primary.every((product) => matchResults.includes(product));

  if (isProductsMatched) {
    selections.primary.forEach((product) => {
      results.forEach((destination) => {
        if (destination.result === product) {
          recommendations.push(destination);
        }
      });
    });

    return getRecommendedResults(recommendations, defaultResult);
  }

  const userSelectionLen = selections.primary.length; // 1 - lr

  // Case 1 - when no user selection is matched default result is returned.
  if (userSelectionLen < 1) {
    return defaultResult;
  }
  // Case 2 - when you have clauses grouped with parenthesis.
  const probableMatches = results.reduce((match, rule) => {
    if (rule.result.includes('(') && rule.result.split('&').length === userSelectionLen) {
      match.push(rule);
    }
    return match;
  }, []);

  probableMatches.forEach((rule) => {
    const productList = rule ? rule.result.split('&') : [];
    if (productList.length) {
      const isCompoundProductsMatched = selections.primary.every(
        (product, index) => productList[index].includes(product),
      );
      if (isCompoundProductsMatched) {
        recommendations.push(rule);
      }
    }
  });

  if (recommendations.length) {
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
  let hasResultTrigger = false;
  let lastStopValue;

  allcards.forEach((selection) => {
    // for each elem in current selection, find its coresponding
    // next element and push it to the next array.
    const nextItems = questionsData[selectedQuestion.questions].data;
    const getAllSelectedQuestionsRelatedOptions = nextItems.filter(
      (nextItem) => nextItem.options === selection,
    );

    getAllSelectedQuestionsRelatedOptions.forEach(({ options, next }) => {
      if (options === selection) {
        const flowStepsList = next.split(',');
        // RESET the queue and add only the next question.
        if (flowStepsList.includes('RESET')) { // Reset to intial question
          nextQuizViews = []; // Resetting the nextQuizViews
          // eslint-disable-next-line no-param-reassign
          userFlow = []; // Resetting the userFlow as well
          lastStopValue = 'RESET';
        }

        if (!hasResultTrigger) {
          hasResultTrigger = flowStepsList.includes('RESULT');
        }

        const filteredNextSteps = flowStepsList.filter((val) => (val !== 'RESULT' && val !== 'RESET'));

        nextQuizViews = [...nextQuizViews, ...filteredNextSteps];
      }
    });
  });

  // Stripping off the next steps that are negated using 'NOT()'.
  nextQuizViews.forEach((nextStep) => {
    if (nextStep?.startsWith('NOT(')) {
      const stepsToSkip = nextStep?.substring(
        nextStep.indexOf('(') + 1,
        nextStep.lastIndexOf(')'),
      );
      const stepsToSkipArr = stepsToSkip?.split(',');
      stepsToSkipArr?.forEach((skip) => {
        nextQuizViews = nextQuizViews.filter((view) => (view !== skip));
      });
    }
  });

  // Filtering out the NOT() from the nextQuizViews.
  nextQuizViews = nextQuizViews.filter((view) => view.startsWith('NOT(') === false);

  return { nextQuizViews: [...new Set([...userFlow, ...nextQuizViews])], lastStopValue };
};

export const transformToFlowData = (userSelection) => {
  const flowData = userSelection.map(({ selectedCards, selectedQuestion }) => [
    selectedQuestion.questions, Object.keys(selectedCards)]);
  return flowData;
};

export const getAnalyticsDataForBtn = (selectedQuestion, selectedCards) => {
  const selectedCardNames = Object.keys(selectedCards);
  if (selectedCardNames.length > 0) {
    const btnAnalytics = `Filters|${analyticsType}|${selectedQuestion?.questions}/${selectedCardNames.join('/')}`;
    return btnAnalytics;
  }
  return '';
};

export const getAnalyticsDataForLocalStorage = (answers) => {
  let formattedAnswerString = '';
  answers.forEach((answer) => {
    const eachAnswer = `${answer[0]}/${answer[1].join('/')}`;
    formattedAnswerString = formattedAnswerString === '' ? eachAnswer : formattedAnswerString.concat('|', eachAnswer);
  });
  const analyticsHash = `type=${analyticsType}&quiz=${analyticsQuiz}&selectedOptions=${formattedAnswerString}`;
  return analyticsHash;
};
