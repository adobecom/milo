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

export async function loadFragments(fragmentURL) {
  const quizSections = document.querySelector('.quiz-footer');
  const a = createTag('a', { href: fragmentURL });
  quizSections.append(a);
  const { default: createFragment } = await import('../fragment/fragment.js');
  await createFragment(a);
}

const App = ({
  initialIsDataLoaded = false,
  preQuestions = {}, initialStrings = {},
}) => {
  const [btnAnalytics, setBtnAnalytics] = useState(null);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [countSelectedCards, setCountOfSelectedCards] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDataLoaded, setDataLoaded] = useState(initialIsDataLoaded);
  const [nextQuizViewsExist, setNextQuizViewsExist] = useState(true);
  const [prevStepIndicator, setPrevStepIndicator] = useState([]);
  const [questionData, setQuestionData] = useState(preQuestions.questionData || {});
  const [questionList, setQuestionList] = useState(preQuestions.questionList || {});
  const [selectedCards, setSelectedCards] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(preQuestions || null);
  const [stringData, setStringData] = useState(initialStrings || {});
  const [stringQList, setStringQList] = useState(preQuestions.stringQList || {});
  const [totalSteps, setTotalSteps] = useState(3);
  const initialUrlParams = getUrlParams();
  const [urlParam, setUrlParam] = useState(initialUrlParams);
  const [userSelection, updateUserSelection] = useState([]);
  const [userFlow, setUserFlow] = useState([]);
  const validQuestions = useMemo(() => [], []);
  const knownParams = useMemo(() => ['martech', 'milolibs', 'quiz-data'], []);

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

      setUserFlow([questions.questions.data[0].questions]);

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
    function handlePopState() {
      window.location.reload();
    }
    if (isDataLoaded) {
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
    return () => {};
  }, [knownParams, isDataLoaded]);

  useEffect(() => {
    if (userFlow && userFlow.length) {
      const currentFlow = userFlow.shift();
      if (currentFlow && currentFlow.length) {
        setSelectedQuestion(questionList[currentFlow] || []);
      }
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
    if (!selectedQuestion) return;
    const { questions } = selectedQuestion;
    const cardValues = Object.getOwnPropertyNames(selectedCards);
    setUrlParam((prevUrlParam) => {
      const newParam = { ...prevUrlParam };
      if (selectedQuestion && cardValues.length === 0) {
        delete newParam[questions];
      } else if (!urlParam[questions]) {
        newParam[questions] = new Set(
          [...(urlParam[questions] || []), ...cardValues],
        );
      } else {
        newParam[questions] = new Set(cardValues);
      }
      return newParam;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion, selectedCards, JSON.stringify(urlParam)]);

  /**
   * Updates the url when the url param is updated as part of the option click.
   */
  useLayoutEffect(() => {
    if (Object.keys(urlParam).length > 0 && isBtnClicked === true) {
      let urlParamList = Object.keys(urlParam).map((key) => {
        const paramList = [...urlParam[key]];
        if (paramList.length) {
          return `${key}=${paramList.join(',')}`;
        }
        return null; // Explicitly return null if the condition is not met
      }).filter((item) => !!item && !knownParams.includes(item.split('=')[0]));
      const knownParamsList = knownParams
        .filter((key) => key in urlParam)
        .map((key) => `${key}=${urlParam[key].join(',')}`);
      urlParamList = [...urlParamList, ...knownParamsList];
      if (knownParamsList.length === 1 && isBtnClicked === false) {
        const newURL = knownParamsList && knownParamsList.length > 0 ? `?${knownParamsList.join('&')}` : '';
        window.history.pushState('', '', newURL);
      } else {
        window.history.pushState('', '', `?${urlParamList.join('&')}`);
      }
      setIsBtnClicked(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setIsBtnClicked(true);
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
    setIsBtnClicked(true);
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
      return question?.[propName] || '';
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
    return question?.[propName] || '';
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
) {
  initConfigPathGlob(el);
  el.replaceChildren();
  render(html`<${App} 
    initialIsDataLoaded=${initialIsDataLoaded} 
    preQuestions=${preQuestions} 
    initialStrings=${initialStrings} 
  />`, el);
}
