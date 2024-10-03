import { getNormalizedMetadata } from '../quiz/utils.js';

export async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

export async function getQuizJson(path) {
  try {
    // Fetch required files
    const [questions, strings] = await Promise.all([
      fetchJson(`${path}questions.json`),
      fetchJson(`${path}strings.json`),
    ]);

    // Try to fetch optional file, results.json
    let results = [];
    try {
      results = await fetchJson(`${path}results.json`);
    } catch (ex) {
      window.lana?.log(`INFO: results.json not found or couldn't be fetched: ${ex}`, { tags: 'errorType=info,module=quiz-entry' });
    }

    return [questions, strings, results];
  } catch (ex) {
    window.lana?.log(`ERROR: Fetching data for quiz entry: ${ex}`, { tags: 'errorType=error,module=quiz-entry' });
    return [];
  }
}

export const handleNext = (questionsData, selectedQuestion, userInputSelections, userFlow) => {
  const allcards = Object.keys(userInputSelections);
  let nextFlow = [];
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
          nextFlow = []; // Resetting the nextQuizViews
          // eslint-disable-next-line no-param-reassign
          userFlow = []; // Resetting the userFlow as well
        }

        if (!hasResultTrigger) {
          hasResultTrigger = flowStepsList.includes('RESULT');
        }

        const filteredNextSteps = flowStepsList.filter((val) => (val !== 'RESULT' && val !== 'RESET'));

        nextFlow = [...nextFlow, ...filteredNextSteps];
      }
    });
  });

  // Stripping off the next steps that are negated using 'NOT()'.
  nextFlow.forEach((nextStep) => {
    if (nextStep?.startsWith('NOT(')) {
      const stepsToSkip = nextStep?.substring(
        nextStep.indexOf('(') + 1,
        nextStep.lastIndexOf(')'),
      );
      const stepsToSkipArr = stepsToSkip?.split(',');
      stepsToSkipArr?.forEach((skip) => {
        nextFlow = nextFlow.filter((view) => (view !== skip));
      });
    }
  });

  // Filtering out the NOT() from the nextQuizViews.
  nextFlow = nextFlow.filter((view) => view.startsWith('NOT(') === false);

  return { nextFlow: [...new Set([...userFlow, ...nextFlow])] };
};

export const handleSelections = (prevSelections, selectedQuestion, selections) => {
  const newSelections = { selectedQuestion, selectedCards: selections };
  let nextSelections = [];
  let isNewQuestion = true;
  // de-dup any existing data if they use the ml field and cards.
  if (prevSelections.length > 0) {
    prevSelections.forEach((selection) => {
      if (JSON.stringify(selection.selectedQuestion) === JSON.stringify(selectedQuestion)) {
        selection.selectedCards = selections;
        isNewQuestion = false;
      }
    });
    nextSelections = prevSelections;
  }

  if (isNewQuestion) nextSelections.push(newSelections);

  return { nextSelections };
};

export async function getQuizEntryData(el) {
  const blockData = getNormalizedMetadata(el);
  const dataPath = blockData.data.text;
  const quizPath = blockData.quiz.text;
  const maxQuestions = Number(blockData.maxquestions?.text) || 10;
  const analyticsType = blockData.analyticstype?.text;
  const analyticsQuiz = blockData.analyticsquiz?.text;
  const [questionData, stringsData, resultsData] = await getQuizJson(dataPath);
  return {
    quizPath,
    maxQuestions,
    analyticsQuiz,
    analyticsType,
    questionData,
    stringsData,
    resultsData,
  };
}
