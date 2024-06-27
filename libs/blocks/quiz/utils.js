/* eslint-disable no-use-before-define */
import { getMetadata } from '../section-metadata/section-metadata.js';
import { getConfig } from '../../utils/utils.js';

const QUESTIONS_EP_NAME = 'questions.json';
const STRINGS_EP_NAME = 'strings.json';
const RESULTS_EP_NAME = 'results.json';
const VALID_URL_RE = /^(http(s):\/\/.)[-a-z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_+.~#?&//=]*)/;

let configPath;
let quizKey;
let shortQuiz;
let analyticsType;
let analyticsQuiz;
let metaData;

const initConfigPath = (quizMetaData) => {
  const quizConfigPath = quizMetaData.data.text;
  const urlParams = new URLSearchParams(window.location.search);
  const stringsPath = urlParams.get('quiz-data');
  return (filepath) => `${stringsPath || getLocalizedURL(quizConfigPath)}${filepath}`;
};

async function fetchContentOfFile(path) {
  const response = await fetch(configPath(path));
  return response.json();
}

export const initConfigPathGlob = (rootElement) => {
  metaData = getNormalizedMetadata(rootElement);
  configPath = initConfigPath(metaData);
  shortQuiz = metaData.shortquiz?.text === 'true';
  quizKey = metaData.storage?.text.toLowerCase();
  analyticsType = metaData.analyticstype?.text;
  analyticsQuiz = metaData.analyticsquiz?.text;
  return { configPath, quizKey, analyticsType, analyticsQuiz, shortQuiz };
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

export const defaultRedirect = (url) => {
  window.location.href = url;
};

export const handleResultFlow = async (
  answers = [],
  quizEntryResults = {},
  redirectFunc = defaultRedirect,
) => {
  const { destinationPage } = await findAndStoreResultData(answers, quizEntryResults);
  const redirectUrl = getRedirectUrl(destinationPage);
  redirectFunc(redirectUrl);
};

/**
 * Handling the result flow from here. Will need to make sure we capture all
 * the data so that we can come back.
 */
export const findAndStoreResultData = async (answers = [], quizEntryResults = {}) => {
  const entireResultData = await parseResultData(answers, quizEntryResults);
  const resultData = entireResultData.filteredResults;
  const { resultResources } = entireResultData;
  let destinationPage = '';
  let primaryProductCodes = [];
  let secondaryProductCodes = [];
  let umbrellaProduct = '';

  if (resultData.matchedResults.length > 0) {
    destinationPage = getLocalizedURL(resultData.matchedResults[0].url);

    primaryProductCodes = resultData.primary;
    secondaryProductCodes = resultData.secondary;
    umbrellaProduct = resultData.matchedResults[0]['umbrella-result'];
    storeResultInLocalStorage(
      answers,
      resultData,
      resultResources,
      primaryProductCodes,
      secondaryProductCodes,
      umbrellaProduct,
    );
  } else {
    window.lana?.log(`ERROR: No results found for ${answers}`);
  }

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
  const nestedFragsPrimary = resultData?.matchedResults?.[0]?.['nested-fragments-primary'] || '';
  const nestedFragsSecondary = resultData?.matchedResults?.[0]?.['nested-fragments-secondary'] || '';
  const structureFrags = resultData?.matchedResults?.[0]?.['basic-fragments'] || '';

  const structureFragsArray = structureFrags?.split(',');
  const nestedFragsPrimaryArray = nestedFragsPrimary?.split(',');
  const nestedFragsSecondaryArray = nestedFragsSecondary?.split(',');
  const analyticsConfig = {
    answers,
    umbrellaProduct,
    primaryProducts,
    analyticsType,
    analyticsQuiz,
  };
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
    pageloadHash: getAnalyticsDataForLocalStorage(analyticsConfig),
  };

  const { locale } = getConfig();
  const quizLocalKey = locale?.ietf ? `${quizKey}-${locale.ietf}` : quizKey;

  localStorage.setItem(quizLocalKey, JSON.stringify(resultToDelegate));
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
          structureFragments.push(getLocalizedURL(row[fragment]));
        }
      } else if (primaryProducts?.length > 0 && primaryProducts.includes(row.product)
      && row[fragment]) {
        structureFragments.push(getLocalizedURL(row[fragment]));
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
          fragArray.push(getLocalizedURL(val.trim()));
        });
      }
    });
  });
  return fragArray;
};

/**
 * Normalizes the metadata keys in the metadata object,
 * cleaning them up and removing all but alphanumeric characters
 */
const normalizeKeys = (data) => {
  const keys = Object.keys(data);
  const cleanData = {};
  for (const key of keys) {
    const newKey = key.match(/[a-zA-Z0-9]/g).join('');
    if (key !== newKey) {
      cleanData[newKey] = data[key];
    } else {
      cleanData[key] = data[key];
    }
  }
  return cleanData;
};

export const getRedirectUrl = (destinationPage) => {
  const separator = destinationPage.includes('?') ? '&' : '?';
  return `${destinationPage}${separator}quizkey=${quizKey}`;
};

export const parseResultData = async (answers, quizEntryResults) => {
  // Initialize an empty object for the results
  const results = {};

  // Fetch the content of the file asynchronously
  const quizResultsData = await fetchContentOfFile(RESULTS_EP_NAME);

  // Destructure data from fetched content and the existing quizResultsData
  const { result: { data: quizResultsDataArray } } = quizResultsData;
  const { 'result-fragments': { data: quizFragmentsDataArray } } = quizResultsData;
  const { 'result-destination': { data: quizDestinationDataArray } } = quizResultsData;

  // Check if quizEntryResults is defined and extract data, otherwise use empty arrays
  const quizEntryResultsDataArray = quizEntryResults?.result?.data || [];
  const quizEntryFragmentsDataArray = quizEntryResults?.['result-fragments']?.data || [];
  const quizEntryDestinationDataArray = quizEntryResults?.['result-destination']?.data || [];

  // Merge the data arrays from both sources
  results.result = { data: [...quizResultsDataArray, ...quizEntryResultsDataArray] };
  results['result-fragments'] = { data: [...quizFragmentsDataArray, ...quizEntryFragmentsDataArray] };
  results['result-destination'] = { data: [...quizDestinationDataArray, ...quizEntryDestinationDataArray] };

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

  return { nextQuizViews: [...new Set([...userFlow, ...nextQuizViews])] };
};

export const transformToFlowData = (userSelection) => {
  const flowData = userSelection.map(({ selectedCards, selectedQuestion }) => [
    selectedQuestion.questions, Object.keys(selectedCards)]);
  if (userSelection[0].isML) { flowData.push('isML'); }
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

export const getAnalyticsDataForLocalStorage = (config) => {
  const {
    answers = [],
    umbrellaProduct = '',
    primaryProducts = [],
    // eslint-disable-next-line no-shadow
    analyticsType = '',
    // eslint-disable-next-line no-shadow
    analyticsQuiz = '',
  } = config;

  let formattedResultString = '';
  let formattedAnswerString = '';
  if (umbrellaProduct) {
    formattedResultString = umbrellaProduct;
  } else {
    primaryProducts?.forEach((product) => {
      formattedResultString = formattedResultString ? `${formattedResultString}|${product}` : product;
    });
  }

  for (let i = 0; i < answers.length - 1; i += 1) {
    const answer = answers[i];
    const eachAnswer = i === 0 && answers[answers.length - 1] === 'isML' ? `${answer[0]}/interest-${answer[1].join('-')}` : `${answer[0]}/${answer[1].join('/')}`;
    formattedAnswerString = formattedAnswerString ? `${formattedAnswerString}|${eachAnswer}` : eachAnswer;
  }

  if (answers[answers.length - 1] !== 'isML') {
    const answer = answers[answers.length - 1];
    const lastFormattedAnswer = `${answer[0]}/${answer[1].join('/')}`;
    formattedAnswerString = formattedAnswerString ? `${formattedAnswerString}|${lastFormattedAnswer}` : `${lastFormattedAnswer}`;
  }

  const analyticsHash = `type=${analyticsType}&quiz=${analyticsQuiz}&result=${formattedResultString}&selectedOptions=${formattedAnswerString}`;
  return analyticsHash;
};

export const isValidUrl = (url) => VALID_URL_RE.test(url);

export const getNormalizedMetadata = (el) => normalizeKeys(getMetadata(el));

export const getLocalizedURL = (originalURL) => {
  const { locale } = getConfig();
  const { prefix, ietf = 'en-US' } = locale || {};
  return ietf !== 'en-US' && !originalURL.startsWith(`${prefix}/`) ? `${prefix}${originalURL}` : originalURL;
};
