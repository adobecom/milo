import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import { createTag } from '../../utils/utils.js';
import { getQuizEntryData } from './utils.js';
import { mlField, getFiResults } from './mlField.js';
import { GetQuizOption } from './quizoption.js';

const App = ({
  // quizPath = null,
  // analyticsQuiz = null,
  // analyticsType = null,
  questionData = {},
  stringsData = {},
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [quizState, setQuizState] = useState({ userFlow: [], userSelections: [] });
  const [quizLists, setQuizLists] = useState({});
  const [quizData, setQuizData] = useState({});
  const [hasMLData, setHasMLData] = useState(false);
  const [mlData, setMLData] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCards, setSelectedCards] = useState({});
  const [countSelectedCards, setCountOfSelectedCards] = useState(0);

  useEffect(() => {
    (async () => {
      const qMap = {};
      questionData.questions.data.forEach((question) => {
        qMap[question.questions] = question;
      });

      const strMap = {};
      stringsData.questions.data.forEach((question) => {
        strMap[question.q] = question;
      });

      const qLists = {
        questions: qMap,
        strings: strMap,
      };

      const qData = {
        questions: questionData,
        strings: stringsData,
      };

      setQuizState({
        userFlow: [questionData.questions.data[0].questions],
        userSelections: quizState.userSelections,
      });

      setQuizData(qData);
      setQuizLists(qLists);
      setDataLoaded(true);
      // console.log('qData', qData);
      // console.log('qLists', qLists);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDataLoaded]);

  useEffect(() => {
    (async () => {
      if (dataLoaded) {
        const currentQuestion = quizState.userFlow[0];
        const mlmap = { mlDetails: {}, mlOptions: [], mlValues: [] };
        quizData.questions[currentQuestion].data.forEach((row) => {
          if (row.type === 'form') {
            mlmap.mlDetails = row;
          } else if (row.type === 'api_return_code') {
            mlmap.mlOptions.push(row);
            mlmap.mlValues.push(row.options);
          }
        });
        setMLData(mlmap);
        // console.log('quizState', quizState);
      }

      if (quizState.userFlow && quizState.userFlow.length) {
        const currentFlow = quizState.userFlow.shift();
        if (currentFlow && currentFlow.length) {
          setSelectedQuestion(quizLists.questions[currentFlow] || []);
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState, quizLists]);

  useEffect(() => {
    (async () => {
      if (Object.keys(mlData).length !== 0) {
        setHasMLData(true);
        // console.log('mlData', mlData);
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

  // let minSelections = 0;
  let maxSelections = 10;

  if (selectedQuestion) {
    // minSelections = +selectedQuestion['min-selections'];
    maxSelections = +selectedQuestion['max-selections'];
  }

  const getStringValue = (propName) => {
    if (!selectedQuestion?.questions) return '';
    const question = quizLists.strings[selectedQuestion.questions];
    return question?.[propName] || '';
  };

  const getOptionsIcons = (optionsType, prop) => {
    const optionItem = quizData.strings[selectedQuestion.questions].data.find(
      (item) => item.options === optionsType,
    );
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

  const onQuizButton = async () => {
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

  if (!dataLoaded || !selectedQuestion) return null;
  return html`<div class="quiz-entry-container">
    <div class="quiz-entry-title">${quizLists.strings[selectedQuestion.questions].heading}</div>
    <div class="quiz-entry-subtitle">${quizLists.strings[selectedQuestion.questions]['sub-head']}</div>
    ${hasMLData && html`<${mlField} placeholderText="${quizData.strings[selectedQuestion.questions].data.find((option) => option.options === 'fi_code').title}"/><div class="results-container"></div>`}
    <div class="quiz-entry-text">${quizLists.strings[selectedQuestion.questions].text}</div>
    ${selectedQuestion.questions && html`<${GetQuizOption} 
      maxSelections=${maxSelections} 
      options=${quizData.strings[selectedQuestion.questions]}
      background=${getStringValue('icon-background-color')}
      countSelectedCards=${countSelectedCards}
      selectedCards=${selectedCards}
      onOptionClick=${onOptionClick}
      getOptionsIcons=${getOptionsIcons}/>`}
    <div class="quiz-button-container">
        <button 
          aria-label="${quizLists.strings[selectedQuestion.questions].btn}" 
          class="quiz-button" 
          onClick=${() => { onQuizButton(); }}>
            <span class="quiz-button-label">${quizLists.strings[selectedQuestion.questions].btn}</span>
        </button>
      </div>
  </div>`;
};

export default async function init(el) {
  const quizEntry = await getQuizEntryData(el);
  el.replaceChildren();
  render(html`<${App} 
    quizPath="${quizEntry.quizPath}"
    analyticsQuiz="${quizEntry.analyticsQuiz}"
    analyticsType="${quizEntry.analyticsType}"
    questionData="${quizEntry.questionData}"
    stringsData="${quizEntry.stringsData}"
  />`, el);
}
