import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import { createTag } from '../../utils/utils.js';
import { getQuizEntryData, getQuizJson } from './utils.js';
import { mlField, getFiResults } from './mlField.js';
import { GetQuizOption } from './quizoption.js';

const App = ({
  quizPath = null,
  analyticsQuiz = null,
  analyticsType = null,
  dataPath = null,
}) => {
  const [btnAnalytics, setBtnAnalytics] = useState(null);
  const [countSelectedCards, setCountOfSelectedCards] = useState(0);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [questionData, setQuestionData] = useState({});
  const [questionList, setQuestionList] = useState({});
  const [selectedCards, setSelectedCards] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [stringData, setStringData] = useState({});
  const [stringQList, setStringQList] = useState({});
  const [userFlow, setUserFlow] = useState([]);
  const [quizState, setQuizState] = useState({ userFlow: [], userSelections: [] });
  const [hasMLData, setHasMLData] = useState(false);
  const [mlData, setMLData] = useState({});

  useEffect(() => {
    (async () => {
      const [questions, dataStrings] = await getQuizJson(dataPath);
      const qMap = {};
      questions.questions.data.forEach((question) => {
        qMap[question.questions] = question;
      });

      const strMap = {};
      dataStrings.questions.data.forEach((question) => {
        strMap[question.q] = question;
      });

      setQuizState({
        userFlow: [questions.questions.data[0].questions],
        userSelections: quizState.userSelections,
      });

      setUserFlow([questions.questions.data[0].questions]);

      setStringData(dataStrings);
      setQuestionData(questions);
      setStringQList(strMap);
      setQuestionList(qMap);
      setDataLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userFlow && userFlow.length) {
      const currentFlow = userFlow.shift();
      if (currentFlow && currentFlow.length) {
        setSelectedQuestion(questionList[currentFlow] || []);
      }
    }
  }, [userFlow, questionList]);

  useEffect(() => {
    (async () => {
      if (isDataLoaded) {
        const currentQuestion = quizState.userFlow[0];
        const mlmap = { mlDetails: {}, mlOptions: [], mlValues: [] };
        questionData[currentQuestion].data.forEach((row) => {
          if (row.type === 'form') {
            mlmap.mlDetails = row;
          } else if (row.type === 'api_return_code') {
            mlmap.mlOptions.push(row);
            mlmap.mlValues.push(row.options);
          }
        });
        setMLData(mlmap);
        console.log('quizState', quizState);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState]);

  useEffect(() => {
    (async () => {
      if (Object.keys(mlData).length !== 0) {
        setHasMLData(true);
        console.log('mlData', mlData);
      } else {
        setHasMLData(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mlData]);

  useEffect(() => {
    const mlFieldInput = document.querySelector('#ml-field-input');
    if (countSelectedCards === 0 && mlFieldInput && mlFieldInput.disabled) {
      mlFieldInput.disabled = false;
    }

    if (countSelectedCards > 0 && mlFieldInput && !mlFieldInput.disabled) {
      mlFieldInput.disabled = true;
    }
  }, [countSelectedCards]);

  let minSelections = 0;
  let maxSelections = 10;

  if (selectedQuestion) {
    minSelections = +selectedQuestion['min-selections'];
    maxSelections = +selectedQuestion['max-selections'];
  }

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

  const handleQuizButton = async () => {
    const { mlDetails, mlValues } = mlData;
    const mlFieldText = document.querySelector('#ml-field-input').value;
    const resultContainer = document.querySelector('.results-container');
    if (mlFieldText.length > 0) {
      const fiResults = await getFiResults(mlDetails.endpoint, mlDetails['api-key'], mlFieldText, 10, mlValues);
      const { data } = fiResults;
      resultContainer.replaceChildren();
      data.forEach((value) => {
        const fiCode = createTag('p', '', `ficode: ${value.ficode} | prob: ${value.prob}`);
        resultContainer.appendChild(fiCode);
      });
    } else {
      resultContainer.replaceChildren();
    }
  };

  return html`<div class="quiz-entry-container">
                <div class="quiz-entry-title">Not sure which apps are best for you?</div>
                <div class="quiz-entry-subtitle">Tell us what you’re interested in. We’ll help you figure it out.</div>
                ${hasMLData && html`<${mlField} placeholderText="Describe your interest here"/><div class="results-container"></div>`}
                <div class="quiz-entry-text">Or pick up to 3 below</div>
                ${selectedQuestion.questions && html`<${GetQuizOption} 
                                maxSelections=${maxSelections} 
                                options=${stringData[selectedQuestion.questions]}
                                background=${getStringValue('icon-background-color')}
                                countSelectedCards=${countSelectedCards}
                                selectedCards=${selectedCards}
                                onOptionClick=${onOptionClick}
                                getOptionsIcons=${getOptionsIcons}/>`}
                <div class="quiz-button-container">
                    <button 
                      aria-label="Continue" 
                      class="quiz-button" 
                      onClick=${() => { handleQuizButton(); }}>
                        <span class="quiz-button-label">Continue</span>
                    </button>
                  </div>
              </div>`;
};

export default async function init(el) {
  const quizEntry = getQuizEntryData(el);
  el.replaceChildren();
  render(html`<${App} 
    quizPath="${quizEntry.quizPath}"
    analyticsQuiz="${quizEntry.analyticsQuiz}"
    analyticsType="${quizEntry.analyticsType}"
    dataPath="${quizEntry.dataPath}"
  />`, el);
}
