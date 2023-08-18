import { render, html, useEffect, useState, useLayoutEffect } from '../../deps/htm-preact.js';
import { getConfig, loadStyle, createTag } from '../../utils/utils.js';
import { GetQuizOption } from './quizoption.js';
import { DecorateBlockBackground, DecorateBlockForeground } from './quizcontainer.js';
import { initConfigPathGlob, handleResultFlow, handleNext, transformToFlowData, getQuizData, getAnalyticsDataForBtn, getUrlParams } from './utils.js';
import StepIndicator from './stepIndicator.js';

const { codeRoot } = getConfig();
loadStyle(`${codeRoot}/deps/caas-uar.css`);

async function loadFragments(fragmentURL) {
  const quizSections = document.querySelector('.quiz-footer');
  const a = createTag('a', { href: fragmentURL });
  quizSections.append(a);
  const { default: createFragment } = await import('../fragment/fragment.js');
  await createFragment(a);
}

const App = () => {
  const [questionData, setQuestionData] = useState({});
  const [stringData, setStringData] = useState({});
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionList, setQuestionList] = useState({});
  const [stringQuestionList, setStringQuestionList] = useState({});
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
  const VALID_QUESTIONS = [];
  const KNOWN_PARAMS = ['martech', 'milolibs', 'quiz-data'];

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

      const hasInValidParam = Object.keys(initialUrlParams)
        .some((key) => !VALID_QUESTIONS.includes(key) && !KNOWN_PARAMS.includes(key));

      const lastParamKey = Object.keys(initialUrlParams)[Object.keys(initialUrlParams).length - 1];
      const selectedCardOptions = {};
      if (hasInValidParam) {
        setUserFlow([questions.questions.data[0].questions]);
      } else {
        if (typeof initialUrlParams[lastParamKey] === 'object') {
          Object.keys(initialUrlParams[lastParamKey]).forEach((option) => {
            selectedCardOptions[initialUrlParams[lastParamKey][option]] = true;
          });
        }
        const paramCountSelectedCards = Object.keys(selectedCardOptions).length;
        if (lastParamKey) {
          setSelectedCards(selectedCardOptions);
          setCountOfSelectedCards(paramCountSelectedCards);
          setUserFlow([lastParamKey]);
        } else {
          setUserFlow([questions.questions.data[0].questions]);
        }
      }

      setStringData(dataStrings);
      setQuestionData(questions);
      setStringQuestionList(strMap);
      setQuestionList(qMap);

      // wait for data to load
      setDataLoaded(true);

      // add quiz class to page
      document.body.classList.add('quiz-page');
    })();
  }, [setQuestionData, setStringData, setStringQuestionList, setQuestionList]);

  useEffect(() => {
    function handlePopState(event) {
      setUrlParam(event.state);
      const params = getUrlParams();
      const lastParamKey = Object.keys(params)[Object.keys(params).length - 1];
      if (lastParamKey) {
        let optionValues = params[lastParamKey];
        if (typeof optionValues !== 'string') {
          optionValues = optionValues.toString(); // Convert to string if it's not
        }
        // optionValues = decodeURIComponent(optionValues); // Decode the URI component
        const selectedOptions = optionValues.split(',').reduce((acc, val) => {
          acc[val] = true;
          return acc;
        }, {});
        setCountOfSelectedCards(Object.keys(selectedOptions).length);
        setUserFlow([lastParamKey]);
        setSelectedCards(selectedOptions);
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (userFlow.length) {
      const currentFlow = userFlow.shift();
      if (!currentFlow.length) {
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
  }, [selectedQuestion, selectedCards, JSON.stringify(urlParam)]);

  /**
   * Updates the url when the url param is updated as part of the option click.
   */
  useLayoutEffect(() => {
    if (Object.keys(urlParam).length > 0 && btnClicked === true) {
      const urlParamList = Object.keys(urlParam).map((key) => {
        const paramList = [...urlParam[key]];
        if (paramList.length) {
          return `${key}=${paramList.join(',')}`;
        }
      }).filter((item) => !!item);
      window.history.pushState('', '', `?${urlParamList.join('&')}`);
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
    updateUserSelection((userSelection) => (
      [...userSelection, { selectedQuestion, selectedCards }]));
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
  };

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

  if (!isDataLoaded || !selectedQuestion) {
    return html`<div>Loading</div>`;
  }

  const getStringValue = (propName) => {
    const question = stringQuestionList[selectedQuestion.questions];
    return question ? question[propName] || '' : '';
  };
  const getOptionsIcons = (optionsType, prop) => {
    const optionItem = stringData[selectedQuestion.questions].data.find(
      (item) => item.options === optionsType,
    );
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

  const minSelections = +selectedQuestion['min-selections'];
  const maxSelections = +selectedQuestion['max-selections'];

  const fragmentURL = getStringValue('footerFragment');

  useEffect(() => {
    if (fragmentURL) {
      loadFragments(fragmentURL);
    }
  }, [fragmentURL]);

  return html`<div class="quiz-container">
                  <${StepIndicator} 
                    currentStep=${currentStep} 
                    totalSteps=${totalSteps} 
                    prevStepIndicator=${prevStepIndicator}
                  />  
                  <div class="background">
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

                  <div class="quiz-footer">
                  </div>

                  <${StepIndicator} 
                  currentStep=${currentStep} 
                  totalSteps=${totalSteps} 
                  prevStepIndicator=${prevStepIndicator} />
              </div>`;
};

export default async function init(el) {
  initConfigPathGlob(el);
  render(html`<${App} />`, el);
}
