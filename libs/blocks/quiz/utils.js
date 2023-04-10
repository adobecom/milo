const QUESTIONS_EP_NAME = 'questions.json';
const STRINGS_EP_NAME = 'strings.json';
const RESULTS_EP_NAME = 'results.json';

let getConfigPath;

const initConfigPath = (roolElm) => {
  const link = roolElm.querySelector('.quiz > div > div > a');
  const quizConfigPath = link.text.toLowerCase();

  return filepath => `${quizConfigPath}${filepath}`;
}

async function fetchContentOfFile(path) {
  const response = await fetch(getConfigPath(path));
  return await response.json();
}

export const initConfigPathGlob = (rootElement) => {
  getConfigPath = initConfigPath(rootElement);
}

export const getQuizData = async () => {
  try {
    const [questions, datastrings] = await Promise.all([fetchContentOfFile(QUESTIONS_EP_NAME), fetchContentOfFile(STRINGS_EP_NAME)]);

    return [questions, datastrings]
  } catch (ex) {
    console.log('Error while fetching data : ', ex);
  }
}

/**
 * Handling the result flow from here. Will need to make sure we capture all the data so that we can come back.
 *
 */
export const handleResultFlow = async (answers = []) => {
  console.log('We are at the end of the flow! Route to result page');
  console.log('flow observed till now :: ', answers);

  const { primary: primaryProducts } = await parseResultData(answers);
  const resultData = await parseResultData(answers);
  let destinationPage = '',
   primaryProductCodes = [],
  secondaryProductCodes = [], 
  umbrellaProduct = '', 
  structureFragments = '',
  nestedFragments = '';

  if (resultData.matchedResults.length > 0) {
    destinationPage = resultData.matchedResults[0]['url']
    primaryProductCodes = resultData['primary']
    secondaryProductCodes = resultData['secondary']
    umbrellaProduct = resultData.matchedResults[0]['umbrella-result']
    secondaryProductCodes = resultData.matchedResults[0]['structure-fragments']
    nestedFragments = resultData.matchedResults[0]['nested-fragments']
  }

  const redirectUrl = getRedirectUrl(destinationPage, primaryProducts, answers);
  console.log("redirectUrl: ", redirectUrl);
  // window.location.href = redirectUrl;

};
const getRedirectUrl = (primaryProducts, answers) => {
  let redirectUrl = `https://main--milo--adobecom.hlx.page/drafts/sabya/quiz-2/photoshop-results' +
    '?products=${primaryProducts}&${buildQueryParam(answers)}`;

    return redirectUrl;
}

const buildQueryParam = (answers) => {
  return answers.reduce(function (str, [questionId, answersFromUser], i) {
    return str + (i > 0 ? '&' : '') + questionId + '=' + answersFromUser.join(',');
  }, '');
};

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
          resultMap['result-primary'].split(',')
        );
        resultObj.secondary = resultObj.secondary.concat(
          resultMap['result-secondary'].split(',')
        );
      }

      return resultObj;
    },
    {
      primary: [],
      secondary: [],
    }
  );

  filteredResults.primary = [...new Set(filteredResults.primary.filter(Boolean))];
  filteredResults.secondary = [...new Set(filteredResults.secondary.filter(Boolean))];

  // Find result destination page.
  const matchedResults = findMatchForSelections(
    results['result-destination'].data,
    filteredResults
  );
  console.log('matched results from Sanu bhai is:', matchedResults);
  console.log('filteredResults.primary :', filteredResults.primary);

  filteredResults.matchedResults = matchedResults;
  return filteredResults;


};

const getRecomandationResults = (selectedDestination, deafult) =>
  selectedDestination.length ? selectedDestination : deafult;

// TODO: needs refactoring - can split to smaller functions
const findMatchForSelections = (results, selections) => {
  const recommendations = [];
  const matchResults = [];
  const defaultResult = [];

  results.forEach((destination) => {
    if (destination.result.indexOf('&') == -1) {
      matchResults.push(destination.result);
    }
    if (destination.result == 'default') {
      defaultResult.push(destination);
    }
  });

  // direct match ac and express in results destination. Applying and condition
  const isProductsMatched = selections.primary.every((product) =>
    matchResults.includes(product)
  );

  if (isProductsMatched) {
    // lr, ai
    selections.primary.forEach((product) => {
      results.forEach((destination) => {
        if (destination.result == product) {
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
    if (destination.result.indexOf('&') != -1 && destination.result.split('&').length === userSelectionLen) {
      return destination;
    }
  });

  const productList = compundResults.result.split('&');
  const isCompoundProductsMatched = selections.primary.every((product, index) => {
    return productList[index].includes(product);
  });

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
    // for each elem in current selection, find its coresponding next element and push it to the next array.
    const nextItems = questionsData[selectedQuestion.questions].data;
    const getAllSelectedQuestionsRelatedOptions = nextItems.filter(nextItem => nextItem.options === selection)

    getAllSelectedQuestionsRelatedOptions.forEach(( { options, next }) => {
      if (options === selection) {
        let flowStepsList = next.split(',');


        // RESET the queue and add only the next question.
        if (flowStepsList.includes('RESET')) { // Reset to intial question
          console.log('flowStepsList : while reset is encountered : ', flowStepsList)
          nextQuizViews = []; // Resetting the nextQuizViews
          userFlow = [] // Resetting the userFlow as well
        }

        if (!hasResultTigger) {
          hasResultTigger = flowStepsList.includes('RESULT');
        }

        const filteredNextSteps = flowStepsList.filter((val) => (val != 'RESULT' && val != 'RESET'));

        nextQuizViews = [...nextQuizViews, ...filteredNextSteps];
      }
    });
  });

  return {
    nextQuizViews: [...new Set([...userFlow, ...nextQuizViews])]
  };
};

export const transformToFlowData = (userSelection) => {
  const flowData = userSelection.map(({ selectedCards, selectedQuestion}) => {
    return [selectedQuestion.questions, Object.keys(selectedCards)];
  });

  return flowData;
}
