import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import { createTag } from '../../utils/utils.js';
import { getQuizEntryData } from './utils.js';
import { mlField, getFiResults } from './mlField.js';

const App = ({
  quizPath = null,
  analyticsQuiz = null,
  analyticsType = null,
  questionData = {},
  stringsData = {},
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [quizState, setQuizState] = useState({ userFlow: [], userSelections: [] });
  const [quizData, setQuizData] = useState({});
  const [hasMLData, setHasMLData] = useState(false);
  const [mlData, setMLData] = useState({});

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

      const qData = {
        questionList: qMap,
        questionStrings: strMap,
      };

      setQuizState({
        userFlow: [questionData.questions.data[0].questions],
        userSelections: quizState.userSelections,
      });

      setQuizData(qData);
      setDataLoaded(true);
      console.log('qData', qData);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDataLoaded]);

  useEffect(() => {
    (async () => {
      if (dataLoaded) {
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

  if (!dataLoaded) return null;
  return html`<div class="quiz-entry-container">
    <h1>Quiz Entry | ML Field</h1>
    ${hasMLData && html`<${mlField} placeholderText="Describe your interest here"/><div class="results-container"></div>`}
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
