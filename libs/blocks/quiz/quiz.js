import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';
import { GetQuizOption } from './quizoption.js';
import { DecorateBlockBackground, DecorateBlockForeground } from './quizcontainer.js';
import { initConfigPathGlob, handleResultFlow, handleNext, transformToFlowData, getQuizData } from './utils.js';
import StepIndicator from './stepIndicator.js';

const { codeRoot } = getConfig();
loadStyle(`${codeRoot}/deps/caas.css`);

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

  useEffect(() => {
    (async () => {
      const [questions, datastrings] = await getQuizData();
      const qMap = {};
      questions.questions.data.forEach((question) => {
        qMap[question.questions] = question;
      });

      const strMap = {};
      datastrings.questions.data.forEach((question) => {
        strMap[question.q] = question;
      });

      // initial quesiton to load - picking 1st one
      setUserFlow([questions.questions.data[0].questions]);

      setStringData(datastrings);
      setQuestionData(questions);
      setStringQuestionList(strMap);
      setQuestionList(qMap);

      // wait for data to load
      setDataLoaded(true);
    })();
  }, [setQuestionData, setStringData, setStringQuestionList, setQuestionList]);

  useEffect(() => {
    if (userFlow.length) {
      const currentflow = userFlow.shift();
      if (!currentflow.length) {
        console.log('No next view so setting select question to empty');
      }
      setSelectedQuestion(questionList[currentflow] || []);
    }
  }, [userFlow, questionList]);

  useEffect(() => {
    if (userSelection.length) {
      window.history.pushState('', '', buildQParam(userSelection));
    }
  }, [userSelection.length]);

  const buildQParam = (selection) => {
    let params = '';
    selection.forEach((sel) => {
      if (params) {
        params = `${params}&${sel.selectedQuestion.questions}=${Object.getOwnPropertyNames(sel.selectedCards)}`;
      } else {
        params = `?${sel.selectedQuestion.questions}=${Object.getOwnPropertyNames(sel.selectedCards)}`;
      }
    });
    return params;
  };

  const handleOnNextClick = (selCards) => {
    const { nextQuizViews } = handleNext(questionData, selectedQuestion, selCards, userFlow);
    const nextQuizViewsLen = nextQuizViews.length;
    setCurrentStep(currentStep + 1);
    updateUserSelection((userSelection) => {
      const updatedUserSelection = [...userSelection, { selectedQuestion, selectedCards }];
      setPrevStepIndicator(updatedUserSelection.map((_, index) => index));
      return updatedUserSelection;
    });

    setSelectedCards({});
    setCountOfSelectedCards(0);

    if (!nextQuizViewsLen) {
      handleResultFlow(transformToFlowData(userSelection));
    } else {
      setUserFlow(nextQuizViews);
      if (nextQuizViewsLen > 1) {
        setTotalSteps(totalSteps + 1);
      } else {
        setTotalSteps(totalSteps);
      }
    }
  };

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
                      handleOnNextClick=${handleOnNextClick} />
                      <${StepIndicator} 
                      currentStep=${currentStep} 
                      totalSteps=${totalSteps} 
                      prevStepIndicator=${prevStepIndicator}
                    />  
              </div>`;
};

export default async function init(el) {
  initConfigPathGlob(el);
  render(html`<${App} />`, el);
}
