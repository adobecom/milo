import {
  render, html, useEffect, useMemo, useState, useLayoutEffect,
} from '../../deps/htm-preact.js';
import { createTag } from '../../utils/utils.js';
import { GetQuizOption } from './quizoption.js';
import { DecorateBlockBackground, DecorateBlockForeground } from './quizcontainer.js';
import {
  initConfigPathGlob, handleResultFlow, handleNext, transformToFlowData, getQuizData,
  getAnalyticsDataForBtn, getUrlParams,
} from './utils.js';
import StepIndicator from './stepIndicator.js';

export async function loadFragments(fragmentURL, createFragment) {
  const quizSections = document.querySelector('.quiz-footer');
  const a = createTag('a', { href: fragmentURL });
  quizSections.append(a);
  await createFragment(a);
}

const App = ({ initialIsDataLoaded = false, preQuestions = {}, initialStrings = {}, initQuestion = {} }) => {
  const [questionData, setQuestionData] = useState(preQuestions.questionData || {});
  const [stringData, setStringData] = useState(initialStrings || {});
  const [isDataLoaded, setDataLoaded] = useState(initialIsDataLoaded);
  const [selectedQuestion, setSelectedQuestion] = useState(preQuestions || null);
  const [questionList, setQuestionList] = useState(preQuestions.questionList || {});
  const [stringQList, setStringQList] = useState(preQuestions.stringQList || {});
  const [userSelection, updateUserSelection] = useState([]);
  const [userFlow, setUserFlow] = useState([]);
  const [selectedCards, setSelectedCards] = useState({});
  const [countSelectedCards, setCountOfSelectedCards] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(3);
  const [prevStepIndicator, setPrevStepIndicator] = useState([]);
  const [nextQuizViewsExist, setNextQuizViewsExist] = useState(true);
  const [btnAnalytics, setBtnAnalytics] = useState(null);
  const [btnClicked, setBtnClicked] = useState(false);
  const initialUrlParams = getUrlParams();
  const [urlParam, setUrlParam] = useState(initialUrlParams);
  const VALID_QUESTIONS = useMemo(() => [], []);
  const KNOWN_PARAMS = useMemo(() => ['martech', 'milolibs', 'quiz-data'], []);

  useEffect(() => {
    (async () => {
      const [questions, dataStrings] = await getQuizData();
      const qMap = {};
      questions.questions.data.forEach((question) => {
        qMap[question.questions] = question;
        VALID_QUESTIONS.push(question.questions);
      });

      const strMap = {};
      dataStrings.questions.data.forEach((question) => {
        strMap[question.q] = question;
      });

      setUserFlow([questions.questions.data[0].questions]);

      setStringData(dataStrings);
      setQuestionData(questions);
      setStringQList(strMap);
      setQuestionList(qMap);

      // wait for data to load
      setDataLoaded(true);

      // add quiz class to page
      document.body.classList.add('quiz-page');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQuestionData, setStringData, setStringQList, setQuestionList]);

  useEffect(() => {
    function handlePopState() {
      const currentURL = window.location.href;
      window.location.href = currentURL;
    }
    if (isDataLoaded) {
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
    return () => {};
  }, [KNOWN_PARAMS, isDataLoaded]);

  useEffect(() => {
    if (userFlow.length) {
      const currentFlow = userFlow.shift();
      if (!currentFlow?.length) {
        return;
      }
      setSelectedQuestion(questionList[currentFlow] || []);
    }
  }, [userFlow, questionList]);

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
      handleResultFlow(transformToFlowData(userSelection));
    }
  }, [userSelection, nextQuizViewsExist]);

  /**
   *  Updates the url param when user selects the options.
   *  Happens with each option click/tap.
   */
  useEffect(() => {
    const cardValues = Object.getOwnPropertyNames(selectedCards);
    if (selectedQuestion) {
      setUrlParam((prevUrlParam) => {
        const newParam = { ...prevUrlParam };
        if (selectedQuestion && cardValues.length === 0) {
          delete newParam[selectedQuestion.questions];
        } else if (!urlParam[selectedQuestion.questions]) {
          newParam[selectedQuestion.questions] = new Set(
            [...(urlParam[selectedQuestion.questions] || []), ...cardValues],
          );
        } else {
          newParam[selectedQuestion.questions] = new Set(cardValues);
        }
        return newParam;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion, selectedCards, JSON.stringify(urlParam)]);

  /**
   * Updates the url when the url param is updated as part of the option click.
   */
  useLayoutEffect(() => {
    if (Object.keys(urlParam).length > 0 && btnClicked === true) {
      let urlParamList = Object.keys(urlParam).map((key) => {
        const paramList = [...urlParam[key]];
        if (paramList.length) {
          return `${key}=${paramList.join(',')}`;
        }
        return null; // Explicitly return null if the condition is not met
      }).filter((item) => !!item && !KNOWN_PARAMS.includes(item.split('=')[0]));
      const knownParamsList = KNOWN_PARAMS.filter((key) => key in urlParam).map((key) => `${key}=${urlParam[key].join(',')}`);
      urlParamList = [...urlParamList, ...knownParamsList];
      const validParams = KNOWN_PARAMS.filter((key) => key in urlParam).map((key) => `${key}=${urlParam[key].join(',')}`);
      if (validParams.length === 1 && btnClicked === false) {
        const newURL = knownParamsList && knownParamsList.length > 0 ? `?${knownParamsList.join('&')}` : '';
        window.history.pushState('', '', newURL);
      } else {
        window.history.pushState('', '', `?${urlParamList.join('&')}`);
      }
      setBtnClicked(false);
    }
  }, [urlParam]);

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
   * @param {Object} selCards - Selected cards
   * @returns {void}
   */
  const handleOnNextClick = (selCards) => {
    setBtnClicked(true);
    const { nextQuizViews, lastStopValue } = handleNext(
      questionData,
      selectedQuestion,
      selCards,
      userFlow,
    );
    const nextQuizViewsLen = nextQuizViews.length;

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
    if (lastStopValue && lastStopValue === 'RESET') {
      setTotalSteps(totalSteps - 1);
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
    setBtnClicked(true);
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
      if (!selectedQuestion) return '';
      const question = stringQList[selectedQuestion.questions];
      return question ? question[propName] || '' : '';
    };
    const fragmentURL = getStringValue('footerFragment');
    if (fragmentURL) {
      loadFragments(fragmentURL);
    }
  }, [selectedQuestion, stringQList]);

  if (!isDataLoaded || !selectedQuestion) {
    return html`<div class="quiz-load">Loading</div>`;
  }
  const getStringValue = (propName) => {
    const question = stringQList[selectedQuestion.questions];
    return question ? question[propName] || '' : '';
  };
  const getOptionsIcons = (optionsType, prop) => {
    const optionItem = stringData[selectedQuestion.questions].data.find(
      (item) => item.options === optionsType,
    );
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

  return html`<div class="quiz-container">
                  <${StepIndicator} 
                    currentStep=${currentStep} 
                    totalSteps=${totalSteps} 
                    prevStepIndicator=${prevStepIndicator}
                    top="${true}" />

                  <div class="quiz-background">
                      ${DecorateBlockBackground(getStringValue)}
                  </div>

                  <${DecorateBlockForeground} 
                      heading=${getStringValue('heading')} 
                      subhead=${getStringValue('sub-head')} 
                      btnText=${getStringValue('btn')} />
                      
                  <${GetQuizOption} 
                      btnText=${getStringValue('btn')} 
                      minSelections=${minSelections} 
                      maxSelections=${maxSelections} 
                      options=${stringData[selectedQuestion.questions]} 
                      countSelectedCards=${countSelectedCards}
                      selectedCards=${selectedCards}
                      onOptionClick=${onOptionClick}
                      getOptionsIcons=${getOptionsIcons}
                      handleOnNextClick=${handleOnNextClick}
                      btnAnalyticsData=${btnAnalytics}/>

                  <${StepIndicator} 
                  currentStep=${currentStep} 
                  totalSteps=${totalSteps} 
                  prevStepIndicator=${prevStepIndicator}
                  bottom="${true}" />

                  <div class="quiz-footer">
                  </div>
              </div>`;
};

export default async function init(
  el,
  initialIsDataLoaded = false,
  preQuestions = {},
  initialStrings = {},
  initQuestion = {},
) {
  initConfigPathGlob(el);
  el.replaceChildren();
  render(html`<${App} 
    initialIsDataLoaded=${initialIsDataLoaded} 
    preQuestions=${preQuestions} 
    initialStrings=${initialStrings} 
    initQuestion=${initQuestion} 
  />`, el);
}
