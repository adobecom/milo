import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

import { GetQuizOption } from './quizoption.js';
import { DecorateBlockBackground, DecorateBlockForeground } from './quizcontainer.js';
import { initConfigPathGlob, handleResultFlow, handleNext, transformToFlowData, getQuizData } from './utils.js';

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
    if (userFlow.length){
      const currentflow = userFlow.shift();
      if (!currentflow.length) {
        console.log("No next view so setting select question to empty");
      }
      setSelectedQuestion(questionList[currentflow] || []);
    }
  }, [userFlow, questionList]);

  useEffect(() => {
    if (userSelection.length){
      console.log('userSelection: ', userSelection);
    }
  }, [userSelection.length]);


  const handleOnNextClick = (selectedCards) => {
    const { nextQuizViews } = handleNext(questionData, selectedQuestion, selectedCards, userFlow);
    const nextQuizViewsLen = nextQuizViews.length;
    updateUserSelection((userSelection) => {
      return [ ...userSelection, ...[{ selectedQuestion, selectedCards }]]
    });

    setSelectedCards({});
    setCountOfSelectedCards(0);

    if (!nextQuizViewsLen) {
      handleResultFlow(transformToFlowData(userSelection));
    } else {
      setUserFlow(nextQuizViews);
    }
  }

  const onOptionClick = (option) => (e) => {
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
  }

  if (!isDataLoaded || !selectedQuestion) {
    return html `<div>Loading</div>`;
  }

  const getStringValue = propName => {
    const question = stringQuestionList[selectedQuestion.questions];
    return question ? question[propName] || '' : '';
  };
  const getOptionsIcons = (optionsType, prop) => {
    const optionItem = stringData[selectedQuestion.questions].data.find(item => item.options === optionsType);
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

  const minSelections = +selectedQuestion['min-selections'];
  const maxSelections = +selectedQuestion['max-selections'];

  return html `<div class="quiz-container">
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
              </div>`;
}


export default async function init(el) {
  console.log('hollla!')
  initConfigPathGlob(el);
  render(html `<${App} />`, el);
}
