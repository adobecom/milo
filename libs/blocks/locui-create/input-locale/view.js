import { html } from '../../../deps/htm-preact.js';
import useInputLocale from './index.js';
import StepControls from '../components/stepControls.js';
import { PROJECT_TYPES, WORKFLOW } from '../utils/constant.js';
import Toast from '../components/toast.js';
import { userWorkflowType } from '../store.js';

export default function InputLocales() {
  const {
    selectedRegion,
    selectedLocale,
    activeLocales,
    localeRegionList,
    languagesList,
    project,
    errorPresent,
    handleNext,
    handleBack,
    resetSelection,
    toggleRegion,
    selectLanguage,
    toggleLocale,
    selectAll,
    apiError,
    setApiError,
    getActualLocale,
  } = useInputLocale();

  const RenderRegion = () => {
    if (WORKFLOW[userWorkflowType.value]?.languages) {
      return (html`
    <h5 class="section-header">Quick Select for Language/Locale</h5>
    <div class="additional-cta">
        <button class="reset-button" onClick=${selectAll}>
          Select All
        </button>
        <button class="reset-button" onClick=${resetSelection}>
            Reset All
          </button>
      </div>
    <div class="region-grid">
      <div class="region-buttons">
        ${localeRegionList.map(
          (region) => html`
            <button
              key=${region.key}
              class="region-button ${selectedRegion[region.key]
          ? 'active'
          : ''}"
              onClick=${() => toggleRegion(region)}
            >
              ${region.key}
            </button>
          `,
        )}
      </div>
    </div>
  `);
    } return null;
  };

  const RenderLanguage = () => {
    if (WORKFLOW[userWorkflowType.value]?.languages) {
      return (html`
    <div class="language-grid">
      <h5 class="section-header">Select the Language(s)</h5>
      <div class="language-buttons">
        ${languagesList.map(
          (language) => language.livecopies.length > 0
            && html`
              <button
                key=${language.languagecode}
                class="language-button ${language.livecopies
          .split(',')
          .some((locale) => selectedLocale.includes(`${language.languagecode}|${locale}`))
          ? 'active'
          : ''}"
                onClick=${() => selectLanguage(language)}
              >
                ${language.language}
              </button>
            `,
        )}
      </div>
    </div>
  `);
    }
    return null;
  };

  const RenderLocales = () => {
    const groupedLocales = selectedLocale.reduce((acc, localeKey) => {
      const [langCode, locale] = localeKey.includes('|') ? localeKey.split('|') : [null, localeKey];
      const language = languagesList.find((lang) => (langCode
        ? lang.languagecode === langCode
        : lang.livecopies.split(',').includes(locale)));
      if (language) {
        if (!acc[language.language]) {
          acc[language.language] = [];
        }
        acc[language.language].push(localeKey);
      }
      return acc;
    }, {});

    return Object.keys(groupedLocales).map((languageName) => {
      const localesInLanguage = groupedLocales[languageName];

      return html`
        <div class="locale-group">
          <p class="language-name"><strong>${languageName}</strong></p>
          <div class="locale-button-container">
            ${localesInLanguage.map(
    (localeKey) => html`
                <button
                  class="locale-button ${activeLocales[localeKey] ? 'active' : ''}"
                  onClick=${() => toggleLocale(localeKey)}
                >
                  ${getActualLocale(localeKey).toUpperCase()}
                </button>
              `,
  )}
          </div>
        </div>
      `;
    });
  };

  return html`
  <div class="locui-form-container">
    <div class="locui-input-form-area ">
    <div class="locui-form-body">
        <div>
          <h2 class="locui-project-type">${project.value.type === PROJECT_TYPES.translation ? 'Translate' : 'Rollout'}</h2>
          <p class="locui-project-name">Project Name: <strong>${project.value.name || 'n/a'}</strong></p>
        </div>
        <${RenderRegion} />
        <div class="language-locale-container">
          <${RenderLanguage} />
          ${project.value.type !== PROJECT_TYPES.translation && selectedLocale.length > 0
          && html`
            <div class="locale-grid">
              <h5 class="section-header">Selected Locales</h5>
              <div class="locale-container">${RenderLocales()}</div>
            </div>
          `}
        </div>
      </div>
    </div>
    ${apiError
      && html`<${Toast}
        message=${apiError}
        type="error"
        onClose=${() => setApiError('')}
      />`}
    <div>
      <${StepControls}
        backDisabled=${false}
        nextDisabled=${!errorPresent()}
        onNext=${handleNext}
        onBack=${handleBack}
      />
    </div>
  </div>
  `;
}
