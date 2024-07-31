import { render, html, useEffect, useState, useRef } from '../../deps/htm-preact.js';
import { getQuizEntryData, handleNext, handleSelections } from './utils.js';
import { mlField, getMLResults } from './mlField.js';
import { GetQuizOption } from './quizoption.js';
import { quizPopover, getSuggestions } from './quizPopover.js';

export const locationWrapper = {
  redirect: (url) => {
    window.location = url;
  },
};

const App = ({
  quizPath,
  maxQuestions,
  analyticsType = null,
  questionData = { questions: { data: [] } },
  stringsData = { questions: { data: [] } },
  resultsData = {},
  debug = false,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [quizState, setQuizState] = useState({ userFlow: [], userSelection: [], results: {} });
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
  const [showPopover, setShowPopover] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const QUIZ_INPUT = '#quiz-input';
  const QUIZ_INPUT_CLEAR = '#quiz-input-clear';
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

  const sendMLFieldAnalytics = (input, isFieldText = true) => {
    let val = '';

    if (isFieldText) {
      val = `Filters|${analyticsType}|${input}`;
    } else if (input.length > 0) {
      const fiCodes = input.map((result) => result.ficode);
      val = `Filters|${analyticsType}|${selectedQuestion?.questions}/interest-${fiCodes.join('-')}`;
    }

    const eventData = {
      xdm: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            linkClicks: { value: 1 },
            type: 'other',
            name: val,
          },
        },
      },
      data: {
        _adobe_corpnew: {
          digitalData: {
            search: isFieldText ? { searchInfo: { keyword: val } } : undefined,
            primaryEvent: !isFieldText ? { eventInfo: { eventName: val } } : undefined,
          },
        },
      },
    };

    // eslint-disable-next-line no-underscore-dangle
    window._satellite?.track('event', eventData);
  };

  useEffect(() => {
    (async () => {
      const qMap = {};
      const questionDataArray = questionData?.questions?.data || [];
      questionDataArray.forEach((question) => {
        qMap[question.questions] = question;
      });

      const strMap = {};
      const stringsDataArray = stringsData?.questions?.data || [];
      stringsDataArray.forEach((question) => {
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

      if (questionDataArray.length > 0) {
        setQuizState({
          userFlow: [questionDataArray[0].questions],
          userSelection: quizState.userSelection,
          results: resultsData,
        });
        setSelectedQuestion(qLists.questions[questionDataArray[0].questions]);
      }
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

    setBtnAnalytics(btnAnalyticsData);
  }, [selectedQuestion, selectedCards, analyticsType]);

  const continueQuiz = async () => {
    let selections = {};
    let userFlow = [];
    if (mlInputUsed) {
      const { mlDetails, mlValues } = mlData;
      const mlFieldText = document.querySelector(QUIZ_INPUT).value;
      const fiResults = await getMLResults(mlDetails.endpoint, mlDetails['api-key'], mlDetails.threshold || defaultThreshold, mlFieldText, fiCodeCount, mlValues);
      const { filtered } = fiResults;
      let fallback = [];
      let error = 'Cannot connect to the ML endpoint';

      if (mlDetails.fallback) fallback = mlDetails.fallback.split(',');
      if (filtered) {
        filtered.forEach((item) => {
          selections[item.ficode] = true;
        });

        sendMLFieldAnalytics(filtered, false);
      } else if (fiResults.errors || fiResults.error_code) {
        for (const ficode of fallback) {
          selections[ficode] = true;
        }
        if (fiResults.errors) error = fiResults.errors[0].title;
        if (fiResults.error_code) error = fiResults.message;
        window.lana.log(`ML results error - ${error}`, { tags: 'errorType=info,module=quiz-entry' });
        sendMLFieldAnalytics(fallback, false);
      }

      sendMLFieldAnalytics(mlFieldText, true);

      if (debug) {
        let fiCodes = [];
        if (!fiResults.errors && !fiResults.error_code) {
          // eslint-disable-next-line no-console
          console.log('all', fiResults.data);
          // eslint-disable-next-line no-console
          console.log('filtered', filtered);

          fiCodes = filtered.map((result) => result.ficode);
        } else {
          // eslint-disable-next-line no-console
          console.log('fallback codes used', fallback);
          fiCodes = fallback.map((result) => result.ficode);
        }
        // eslint-disable-next-line no-console
        console.log('sending ML field text to Adobe Analytics: ', `Filters|${analyticsType}|${mlFieldText}`);
        // eslint-disable-next-line no-console
        console.log('sending ML field fiCodes to Adobe Analytics: ', `Filters|${analyticsType}|${selectedQuestion?.questions}/interest-${fiCodes.join('-')}`);
      }
    }

    if (cardsUsed) {
      userFlow = quizState.userFlow;
      selections = selectedCards;
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
        results: resultsData,
      };
      localStorage.setItem('stored-quiz-state', JSON.stringify(currentQuizState));
      setQuizState(currentQuizState);

      // eslint-disable-next-line no-console
      if (debug) console.log(currentQuizState);
      if (questionCount.current === maxQuestions || currentQuizState.userFlow.length === 1) {
        if (!debug) {
          locationWrapper.redirect(quizPath);
        }
      } else {
        setSelectedCards({});
        setSelectedQuestion(null);
        setMLInputUsed(false);
      }
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

    document.querySelector(QUIZ_INPUT_CLEAR).classList.toggle('hidden', !inputValue.length);

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
    const input = document.querySelector(QUIZ_INPUT);
    input.value = suggestion.name;
    setSuggestions([]);
    setShowPopover(false);
    input.focus();
  };

  const onClearClick = () => {
    document.querySelector(QUIZ_INPUT).value = '';
    document.querySelector(QUIZ_INPUT_CLEAR).classList.add('hidden');
    setMLInputUsed(false);
    setSuggestions([]);
    setShowPopover(false);
  };

  if (selectedQuestion) {
    maxSelections = +selectedQuestion['max-selections'];
  }

  if (!dataLoaded || !selectedQuestion) return null;

  return html`<div class="quiz-container">
    <div class="quiz-heading-container">
      <div id="question" class="quiz-title">${quizLists.strings[selectedQuestion.questions].heading}</div>
      <div class="quiz-subtitle">${quizLists.strings[selectedQuestion.questions]['sub-head']}</div>
    </div>
    <div class="quiz-question-container">
      <div class="quiz-input-container">
        ${hasMLData && html`
        <${mlField} 
          cardsUsed="${cardsUsed}" 
          onMLInput="${onMLInput}"
          onMLEnter="${onMLEnter}" 
          onClearClick="${onClearClick}" 
          placeholderText="${getOptionsValue('fi_code', 'title')}"/>`}
        ${showPopover && html`<${quizPopover} 
          suggestions=${suggestions} 
          position="bottom" 
          onSuggestionClick=${onSuggestionClick}/>`}
      </div>
      <div class="quiz-directions">${quizLists.strings[selectedQuestion.questions].text}</div>
      ${selectedQuestion.questions && html`<${GetQuizOption} 
        maxSelections=${maxSelections} 
        options=${quizData.strings[selectedQuestion.questions]}
        background=${getStringValue('icon-background-color')}
        countSelectedCards=${Object.keys(selectedCards).length}
        selectedCards=${selectedCards}
        onOptionClick=${onOptionClick}
        getOptionsValue=${getOptionsValue}
        mlInputUsed=${mlInputUsed}/>`}
    </div>
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
export default async function init(
  el,
  config = {
    quizPath: null,
    maxQuestions: null,
    analyticsType: null,
    questionData: null,
    stringsData: null,
    resultsData: null,
    debug: false,
  },
) {
  let quizEntry;
  if (config.questionData && config.stringsData) {
    quizEntry = config;
  } else {
    try {
      quizEntry = await getQuizEntryData(el);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load quiz data:', error);
      quizEntry = {
        quizPath: '',
        maxQuestions: 0,
        analyticsType: '',
        questionData: { questions: { data: [] } },
        stringsData: { questions: { data: [] } },
        resultsData: {},
        debug: false,
      };
    }
  }

  const params = new URL(document.location).searchParams;
  const isDebug = params.get('debug') === 'quiz-entry';
  quizEntry.debug = isDebug;

  el.replaceChildren();
  render(html`<${App} 
    quizPath=${quizEntry.quizPath || ''}
    maxQuestions=${quizEntry.maxQuestions || 0}
    analyticsType=${quizEntry.analyticsType || ''}
    questionData=${quizEntry.questionData}
    stringsData=${quizEntry.stringsData}
    resultsData=${quizEntry.resultsData}
    debug=${quizEntry.debug || false}
  />`, el);
}
