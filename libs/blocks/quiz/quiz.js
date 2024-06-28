import {
  render, html, useEffect, useMemo, useState, useLayoutEffect,
} from '../../deps/htm-preact.js';
import { createTag } from '../../utils/utils.js';
import { GetQuizOption } from './quizoption.js';
import { DecorateBlockBackground, DecorateBlockForeground } from './quizcontainer.js';
import {
  initConfigPathGlob, handleResultFlow, handleNext, transformToFlowData, getQuizData,
  getAnalyticsDataForBtn, getUrlParams, isValidUrl,
  getLocalizedURL,
} from './utils.js';
import StepIndicator from './stepIndicator.js';

export async function loadFragments(fragmentURL) {
  const quizSections = document.querySelector('.quiz-footer');
  const a = createTag('a', { href: fragmentURL });
  quizSections.append(a);
  const { default: createFragment } = await import('../fragment/fragment.js');
  await createFragment(a);
}

const App = ({
  initialIsDataLoaded = false,
  preQuestions = {}, initialStrings = {}, shortQuiz: isShortQuiz = false,
  preselections = [], nextQuizViewsExist: preNextQuizViewsExist = true, storedQuizState = true,
}) => {
  const [btnAnalytics, setBtnAnalytics] = useState(null);
  const [countSelectedCards, setCountOfSelectedCards] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDataLoaded, setDataLoaded] = useState(initialIsDataLoaded);
  const [nextQuizViewsExist, setNextQuizViewsExist] = useState(preNextQuizViewsExist);
  const [prevStepIndicator, setPrevStepIndicator] = useState([]);
  const [questionData, setQuestionData] = useState(preQuestions.questionData || {});
  const [questionList, setQuestionList] = useState(preQuestions.questionList || {});
  const [selectedCards, setSelectedCards] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(preQuestions || null);
  const [stringData, setStringData] = useState(initialStrings || {});
  const [stringQList, setStringQList] = useState(preQuestions.stringQList || {});
  const [totalSteps, setTotalSteps] = useState(isShortQuiz ? 2 : 3);
  const initialUrlParams = getUrlParams();
  const [userSelection, updateUserSelection] = useState(preselections);
  const [userFlow, setUserFlow] = useState([]);
  const validQuestions = useMemo(() => [], []);
  const [debugBuild, setDebugBuild] = useState(null);
  const [quizEntryData, setQuizEntryData] = useState({});

  useEffect(() => {
    (async () => {
      const [questions, dataStrings] = await getQuizData();
      const qMap = {};
      questions.questions.data.forEach((question) => {
        qMap[question.questions] = question;
        validQuestions.push(question.questions);
      });

      const strMap = {};
      dataStrings.questions.data.forEach((question) => {
        strMap[question.q] = question;
      });

      if (!!Object.keys(storedQuizState).length
        && !!storedQuizState?.userFlow.length
        && !!storedQuizState?.userSelection.length) {
        setUserFlow(storedQuizState.userFlow);
        updateUserSelection(storedQuizState.userSelection);
        setQuizEntryData(storedQuizState.results);
      } else {
        setUserFlow([questions.questions.data[0].questions]);
      }

      setStringData(dataStrings);
      setQuestionData(questions);
      setStringQList(strMap);
      setQuestionList(qMap);
      setDataLoaded(true);
      document.body.classList.add('quiz-page');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuestionData, setStringData, setStringQList, setQuestionList]);

  useEffect(() => {
    const quizDebugValue = initialUrlParams['debug-results'];
    const handleDebugResults = () => {
      if (quizDebugValue && quizDebugValue.length > 1) {
        const quizDebugValueDecodedJSON = JSON.parse(decodeURIComponent(quizDebugValue));
        if (userSelection.length > 0) {
          setNextQuizViewsExist(false);
        } else {
          updateUserSelection(quizDebugValueDecodedJSON);
        }
      }
    };
    if (isDataLoaded) {
      if (debugBuild === false) {
        handleDebugResults();
      }
    }
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, debugBuild, userSelection]);

  useEffect(() => {
    if (userFlow && userFlow.length) {
      const currentFlow = userFlow.shift();
      if (currentFlow && currentFlow.length) {
        setSelectedQuestion(questionList[currentFlow] || []);
      }

      const currentFlowData = questionData[currentFlow].data;
      let resultsNext = true;
      currentFlowData.forEach((item) => {
        if (item.next !== 'RESULT') {
          resultsNext = false;
        }
      });

      if (resultsNext) {
        setTotalSteps(totalSteps - 1);
      }
    }
  }, [userFlow, questionList, totalSteps, questionData]);

  /**
   * Updates the analytics data for the next button.
   * Happens with each option click/tap.
   * @returns {void}
   */
  useEffect(() => {
    setBtnAnalytics(getAnalyticsDataForBtn(selectedQuestion, selectedCards));
  }, [selectedQuestion, selectedCards]);

  /**
   * Handling the result flow when user has selected all the options.
   * nextQuizViewsExist is set to false when the next button is clicked
   * and there are no more views to show.
   */
  useEffect(() => {
    if (!nextQuizViewsExist && userSelection.length) {
      const debugParam = initialUrlParams['debug-results'];
      if (debugParam) {
        const userSelectionString = JSON.stringify(userSelection);
        const userSelectionStringEncoded = encodeURIComponent(userSelectionString);
        const cleanURL = window.location.href.split('?')[0];
        const debugURL = `${cleanURL}?debug-results=${userSelectionStringEncoded}`;
        window.history.replaceState('', '', debugURL);
        navigator.clipboard.writeText(debugURL).then(() => {
          // eslint-disable-next-line no-console
          console.log(debugURL);
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(`Error copying URL: ${err} URL: ${debugURL}`);
        });
      }
      handleResultFlow(transformToFlowData(userSelection), quizEntryData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelection, nextQuizViewsExist]);

  /**
   * Updates the url when the url param is updated as part of the option click.
   */
  useLayoutEffect(() => {
    const quizDebug = initialUrlParams['debug-results'];
    if (quizDebug && quizDebug.length < 1) {
      setDebugBuild(true);
    } else {
      setDebugBuild(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrlParams]);

  /**
   * Updates the prevStepIndicator when user selects the options.
   */
  useEffect(() => {
    if (userSelection.length) {
      setPrevStepIndicator(userSelection.map((_, index) => index));
    }
  }, [userSelection]);

  /**
   * Resets focus to the top of the quiz block for accessibility.
   * To ensure that the next keyboard tab will focus the first avaiable quiz option.
   */
  const resetFocus = () => {
    const quiz = document.querySelector('.quiz');
    const focuser = createTag('button', { tabindex: 0 });
    quiz.prepend(focuser);
    focuser.focus();
    quiz.removeChild(focuser);
  };

  /**
   * Handler of the next button click. Checks whether any next view exists or not.
   * Takes care of the user flow and updates the state accordingly.
   * @returns {void}
   */
  const handleOnNextClick = () => {
    const { nextQuizViews } = handleNext(
      questionData,
      selectedQuestion,
      selectedCards,
      userFlow,
    );
    const nextQuizViewsLen = nextQuizViews.length;
    const [firstQuizView] = nextQuizViews;

    localStorage.removeItem('stored-quiz-state');

    if (nextQuizViewsLen === 1 && isValidUrl(firstQuizView)) {
      window.location.href = firstQuizView;
      return;
    }

    setNextQuizViewsExist(!!nextQuizViewsLen);
    setCurrentStep(currentStep + 1);
    updateUserSelection((prevUserSelection) => (
      [...prevUserSelection, { selectedQuestion, selectedCards }]
    ));
    setSelectedCards({});
    setSelectedQuestion(null);
    setCountOfSelectedCards(0);

    if (nextQuizViewsLen) {
      setUserFlow(nextQuizViews);
      if (nextQuizViewsLen > 1) {
        setTotalSteps(totalSteps + 1);
      } else {
        setTotalSteps(totalSteps);
      }
    }
    resetFocus();
  };
  let minSelections = 0;
  let maxSelections = 10;

  if (selectedQuestion) {
    minSelections = +selectedQuestion['min-selections'];
    maxSelections = +selectedQuestion['max-selections'];
  }
  /**
   * Handler of the option click. Updates the selected cards and the count of selected cards.
   * @param {Object} option - Selected option
   *  @returns {void}
   * */
  const onOptionClick = (option) => () => {
    const newState = { ...selectedCards };

    if (Object.keys(newState).length >= maxSelections && !newState[option.options]) {
      return;
    }

    if (!newState[option.options]) {
      newState[option.options] = true;
    } else {
      delete newState[option.options];
    }

    setSelectedCards(newState);
    setCountOfSelectedCards(Object.keys(newState).length);
  };

  useEffect(() => {
    const getStringValue = (propName) => {
      if (!selectedQuestion?.questions) return '';
      const question = stringQList[selectedQuestion.questions];
      return question?.[propName] || '';
    };
    const fragmentURL = getStringValue('footerFragment');
    if (fragmentURL) {
      loadFragments(getLocalizedURL(fragmentURL));
    }
    const iconBg = getStringValue('icon-background-color');
    if (iconBg) {
      document.querySelector('.quiz-container').style.setProperty('--quiz-icon-bg', iconBg);
    }
  }, [selectedQuestion, stringQList]);

  if (!isDataLoaded || !selectedQuestion) {
    return null;
  }

  const getStringValue = (propName) => {
    if (!selectedQuestion?.questions) return '';
    const question = stringQList[selectedQuestion.questions];
    return question?.[propName] || '';
  };
  const getOptionsIcons = (optionsType, prop) => {
    const optionItem = stringData[selectedQuestion.questions].data.find(
      (item) => item.options === optionsType,
    );
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

  return html`<div class="quiz-container">
                  ${selectedQuestion.questions && html`<${StepIndicator}
                    currentStep=${currentStep} 
                    totalSteps=${totalSteps} 
                    prevStepIndicator=${prevStepIndicator}
                    top="${true}" />
                  `}

                  ${selectedQuestion.questions && getStringValue('background') !== '' && html`<div class="quiz-background">
                      ${DecorateBlockBackground(getStringValue)}
                  </div>`}

                  ${selectedQuestion.questions && html`<${DecorateBlockForeground} 
                      heading=${getStringValue('heading')} 
                      subhead=${getStringValue('sub-head')} 
                      btnText=${getStringValue('btn')} />`}
                      
                  ${selectedQuestion.questions && html`<${GetQuizOption} 
                    btnText=${getStringValue('btn')} 
                    minSelections=${minSelections} 
                    maxSelections=${maxSelections} 
                    options=${stringData[selectedQuestion.questions]}
                    background=${getStringValue('icon-background-color')}
                    countSelectedCards=${countSelectedCards}
                    selectedCards=${selectedCards}
                    onOptionClick=${onOptionClick}
                    getOptionsIcons=${getOptionsIcons}
                    handleOnNextClick=${handleOnNextClick}
                    btnAnalyticsData=${btnAnalytics}/>`}

                  ${selectedQuestion.questions && html`
                    <${StepIndicator} 
                      currentStep=${currentStep} 
                      totalSteps=${totalSteps} 
                      prevStepIndicator=${prevStepIndicator}
                      bottom="${true}" />
                  `}
                  <div class=quiz-footer />
              </div>`;
};

export default async function init(
  el,
  shortQuiz,
  initialIsDataLoaded = false,
  preQuestions = {},
  initialStrings = {},
  preselections = [],
  nextQuizViewsExist = true,
) {
  const configData = initConfigPathGlob(el);
  const updatedShortQuiz = shortQuiz || configData.shortQuiz;
  let storedQuizState = localStorage.getItem('stored-quiz-state') || {};

  try {
    storedQuizState = JSON.parse(storedQuizState);
  } catch (e) {
    storedQuizState = {};
  }

  el.replaceChildren();
  render(html`<${App} 
    initialIsDataLoaded=${initialIsDataLoaded} 
    preQuestions=${preQuestions} 
    initialStrings=${initialStrings}
    shortQuiz=${updatedShortQuiz}
    preselections=${preselections}
    nextQuizViewsExist=${nextQuizViewsExist}
    storedQuizState=${storedQuizState}
  />`, el);
}
