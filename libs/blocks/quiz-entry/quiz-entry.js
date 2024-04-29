import { render, html, useEffect, useState, useRef } from '../../deps/htm-preact.js';
import { getQuizEntryData, handleNext, handleSelections } from './utils.js';
import { mlField, getMLResults } from './mlField.js';
import { GetQuizOption } from './quizoption.js';
import { quizPopover, getSuggestions } from './quizPopover.js';

const App = ({
  quizPath = null,
  maxQuestions = null,
  // analyticsQuiz = null,
  analyticsType = null,
  questionData = {},
  stringsData = {},
  debug = false,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [quizState, setQuizState] = useState({ userFlow: [], userSelection: [] });
  const [quizLists, setQuizLists] = useState({});
  const [quizData, setQuizData] = useState({});
  const [hasMLData, setHasMLData] = useState(false);
  const [mlData, setMLData] = useState({});
  const [mlInputUsed, setMLInputUsed] = useState(false);
  const [cardsUsed, setCardsUsed] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCards, setSelectedCards] = useState({});
  const questionCount = useRef(0);
  const [btnAnalytics, setBtnAnalytics] = useState(null);
  const [fiCodeResults, setFiCodeResults] = useState({});
  const [showPopover, setShowPopover] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fiCodeCount = 3;
  const enterKeyCode = 13;
  const defaultThreshold = 0;

  let maxSelections = 10;

  const getStringValue = (propName) => {
    if (!selectedQuestion?.questions) return '';
    const question = quizLists.strings[selectedQuestion.questions];
    return question?.[propName] || '';
  };

  const getOptionsValue = (optionsType, prop) => {
    const optionItem = quizData.strings[selectedQuestion.questions].data.find(
      (item) => item.options === optionsType,
    );
    return optionItem && optionItem[prop] ? optionItem[prop] : '';
  };

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
        userSelection: quizState.userSelection,
      });

      setQuizData(qData);
      setQuizLists(qLists);
      setDataLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const selectedTotal = Object.keys(selectedCards).length;
      if (selectedTotal > 0) {
        setCardsUsed(true);
      } else {
        setCardsUsed(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCards]);

  useEffect(() => {
    (async () => {
      if (quizState.userFlow && quizState.userFlow.length) {
        const currentFlow = [...quizState.userFlow];
        if (currentFlow && currentFlow.length && questionCount.current < maxQuestions) {
          quizState.userFlow.shift();
          questionCount.current += 1;
          setSelectedQuestion(quizLists.questions[currentFlow.shift()] || []);
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState]);

  useEffect(() => {
    (async () => {
      if (selectedQuestion) {
        const mlmap = { mlDetails: {}, mlOptions: [], mlValues: [] };
        quizData.questions[selectedQuestion.questions].data.forEach((row) => {
          if (row.type === 'form') {
            mlmap.mlDetails = row;
          } else if (row.type === 'api_return_code') {
            mlmap.mlOptions.push(row);
            mlmap.mlValues.push(row.options);
          }
        });
        setMLData(mlmap);
        if (Object.keys(mlmap.mlDetails).length > 0) {
          setHasMLData(true);
        } else {
          setHasMLData(false);
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion]);

  useEffect(() => {
    let btnAnalyticsData = '';
    const selectedCardNames = Object.keys(selectedCards);
    if (selectedCardNames.length > 0) {
      btnAnalyticsData = `Filters|${analyticsType}|${selectedQuestion?.questions}/${selectedCardNames.join('/')}`;
    }

    if (fiCodeResults && fiCodeResults.length > 0) {
      const fiCodes = fiCodeResults.map((result) => result.ficode);
      btnAnalyticsData = `Filters|${analyticsType}|${selectedQuestion?.questions}/interest-${fiCodes.join('-')}`;
    }

    setBtnAnalytics(btnAnalyticsData);
  }, [selectedQuestion, selectedCards, fiCodeResults, analyticsType]);

  const continueQuiz = async () => {
    let selections = {};
    let userFlow = [];
    if (mlInputUsed) {
      const { mlDetails, mlValues } = mlData;
      const mlFieldText = document.querySelector('#ml-field-input').value;
      const fiResults = await getMLResults(mlDetails.endpoint, mlDetails['api-key'], mlDetails.threshold || defaultThreshold, mlFieldText, fiCodeCount, mlValues);
      const { filtered } = fiResults;

      setFiCodeResults(filtered);

      filtered.forEach((item) => {
        selections[item.ficode] = true;
      });

      if (debug) {
        // eslint-disable-next-line no-console
        console.log('all', fiResults.data);
        // eslint-disable-next-line no-console
        console.log('filtered', filtered);
      }
    }

    if (cardsUsed) {
      userFlow = quizState.userFlow;
      selections = selectedCards;
      if (questionCount.current < maxQuestions) {
        setSelectedCards({});
        setSelectedQuestion(null);
      }
    }

    if (Object.keys(selections).length > 0) {
      const { nextFlow } = handleNext(
        questionData,
        selectedQuestion,
        selections,
        userFlow,
      );
      const { nextSelections } = handleSelections(
        quizState.userSelection,
        selectedQuestion,
        selections,
      );

      if (mlInputUsed) { nextSelections[0].isML = true; }

      const currentQuizState = {
        userFlow: nextFlow,
        userSelection: nextSelections,
      };
      localStorage.setItem('stored-quiz-state', JSON.stringify(currentQuizState));
      setQuizState(currentQuizState);

      // eslint-disable-next-line no-console
      if (debug) console.log(currentQuizState);
      if (!debug) window.location = quizPath;
    }
  };

  const onOptionClick = (option) => () => {
    const selected = { ...selectedCards };
    const selectedTotal = Object.keys(selected).length;

    if (selectedTotal >= maxSelections && !selected[option.options]) {
      return;
    }

    if (!selected[option.options]) {
      selected[option.options] = true;
    } else {
      delete selected[option.options];
    }

    setSelectedCards(selected);
  };

  const onMLInput = async (event) => {
    const inputValue = event.target.value;
    setMLInputUsed(true);
    const { mlDetails } = mlData;
    const data = await getSuggestions(mlDetails['ac-endpoint'], mlDetails['ac-client-id'], inputValue, mlDetails['ac-scope']);
    if (data && data.suggested_completions && data.suggested_completions.length > 0) {
      setSuggestions(data.suggested_completions.slice(0, 5));
      setShowPopover(true);
    }

    document.querySelector('#ml-field-clear').classList.toggle('hidden', !inputValue.length);

    if (inputValue.length === 0) {
      setMLInputUsed(false);
      setSuggestions([]);
      setShowPopover(false);
    }
  };

  const onMLEnter = (event) => {
    if (event.keyCode === enterKeyCode) continueQuiz();
  };

  const onSuggestionClick = (suggestion) => () => {
    document.querySelector('#ml-field-input').value = suggestion.name;
    setSuggestions([]);
    setShowPopover(false);
    document.querySelector('#ml-field-input').focus();
  };

  const onClearClick = () => {
    document.querySelector('#ml-field-input').value = '';
    document.querySelector('#ml-field-clear').classList.add('hidden');
    setMLInputUsed(false);
    setSuggestions([]);
    setShowPopover(false);
  };

  if (selectedQuestion) {
    maxSelections = +selectedQuestion['max-selections'];
  }

  if (!dataLoaded || !selectedQuestion) return null;

  return html`<div class="quiz-entry-container">
    <div class="quiz-entry-title">${quizLists.strings[selectedQuestion.questions].heading}</div>
    <div class="quiz-entry-subtitle">${quizLists.strings[selectedQuestion.questions]['sub-head']}</div>
    ${hasMLData && html`<${mlField} 
      cardsUsed="${cardsUsed}" 
      onMLInput="${onMLInput}"
      onMLEnter="${onMLEnter}" 
      onClearClick="${onClearClick}" 
      placeholderText="${getOptionsValue('fi_code', 'title')}"/>`}
    ${showPopover && html`<${quizPopover} 
      suggestions=${suggestions} 
      position="bottom" 
      onSuggestionClick=${onSuggestionClick}/>`}
    <div class="quiz-entry-text">${quizLists.strings[selectedQuestion.questions].text}</div>
    ${selectedQuestion.questions && html`<${GetQuizOption} 
      maxSelections=${maxSelections} 
      options=${quizData.strings[selectedQuestion.questions]}
      background=${getStringValue('icon-background-color')}
      countSelectedCards=${selectedCards.length}
      selectedCards=${selectedCards}
      onOptionClick=${onOptionClick}
      getOptionsValue=${getOptionsValue}
      mlInputUsed=${mlInputUsed}/>`}
    <div class="quiz-button-container">
        <button 
          disabled="${!!(!mlInputUsed && !cardsUsed)}"
          aria-label="${quizLists.strings[selectedQuestion.questions].btn}" 
          class="quiz-button" 
          daa-ll="${btnAnalytics}" 
          onClick=${() => { continueQuiz(); }}>
            <span class="quiz-button-label">${quizLists.strings[selectedQuestion.questions].btn}</span>
        </button>
      </div>
  </div>`;
};

export default async function init(el, debug = null) {
  const quizEntry = await getQuizEntryData(el);
  const params = new URL(document.location).searchParams;
  // eslint-disable-next-line no-param-reassign
  debug ??= params.get('debug');
  el.replaceChildren();
  render(html`<${App} 
    quizPath="${quizEntry.quizPath}"
    maxQuestions=${quizEntry.maxQuestions}
    analyticsQuiz="${quizEntry.analyticsQuiz}"
    analyticsType="${quizEntry.analyticsType}"
    questionData="${quizEntry.questionData}"
    stringsData="${quizEntry.stringsData}"
    debug="${debug === 'quiz-entry'}"
  />`, el);
}
