import { html } from '../../../deps/htm-preact.js';
import useInputLocale from './index.js';
import StepControls from '../components/stepControls.js';

export default function InputLocales() {
  const {
    selectedLocale,
    activeLocales,
    locales,
    project,
    projectType,
    errorPresent,
    handleNext,
    handleBack,
    selectLanguage,
    toggleLocale,
  } = useInputLocale();

  const RenderLanguage = () => {
    const isLanguageActive = (language) => language.livecopies
      .split(',')
      .some((locale) => selectedLocale.includes(locale));

    return html`
      <div class="language-grid">
        <p>Select the Language(s)</p>
        <div class="language-buttons">
          ${locales.value.map((language) => language.livecopies.length > 0
            && html`
              <button
                key=${language.languagecode}
                class="language-button ${isLanguageActive(language) ? 'active' : ''}"
                onClick=${() => selectLanguage(language)}>
                ${language.language}
              </button>`)}
        </div>
      </div>
    `;
  };
  const RenderLocales = () => {
    const groupedLocales = selectedLocale.reduce((acc, locale) => {
      const language = locales.value.find((lang) => lang.livecopies.split(',').includes(locale));
      if (language) {
        if (!acc[language.language]) {
          acc[language.language] = [];
        }
        acc[language.language].push(locale);
      }
      return acc;
    }, {});
    return html`
      ${Object.keys(groupedLocales).map((languageName) => {
    const localesInLanguage = groupedLocales[languageName];
    return html`
    <div class="locale-group">
      <p class="language-name"><strong>${languageName}</strong></p>
      <div class="locale-button-container">
        ${localesInLanguage.map((locale) => html`
        <button class="locale-button ${activeLocales[locale] ? 'active' : ''}" onClick=${() => toggleLocale(locale)}>
          ${locale.toUpperCase()} </button>`)}
            </div>
          </div>
        `;
  })}
    `;
  };
  return html`
    <div class="locui-form-container">
      <div class="locui-input-form-area">
        <div class="locui-form-body">
          <h2 class="action-label">${projectType.value}</h2>
          <p class="locui-project-name">
            <strong>Project Name:</strong> ${project.value.name || 'n/a'}
          </p>
          <div class="language-locale-container">
            <${RenderLanguage} />
          </div>
          ${projectType.value !== 'translate' && selectedLocale.length > 0
            && html`
            <div class="locale-grid">
              <p>Selected Locales</p>
              <div class="locale-container">${RenderLocales()}</div>
            </div>
          `}
        </div>
      </div>
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
