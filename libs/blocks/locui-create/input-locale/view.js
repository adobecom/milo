import { html } from '../../../deps/htm-preact.js';
import useInputLocale from './index.js';
import StepControls from '../components/stepControls.js';

export default function InputLocales() {
  const {
    selectedRegion,
    selectedLocale,
    activeLocales,
    localeRegion,
    locales,
    project,
    errorPresent,
    handleNext,
    handleBack,
    resetSelection,
    toggleRegion,
    selectLanguage,
    toggleLocale,
  } = useInputLocale();

  const RenderRegion = () => html`
    <div class="region-grid">
      <p>Quick Select for Language/Locale</p>
      <div class="region-buttons">
        ${localeRegion.value.map(
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
        <button class="reset-button" onClick=${resetSelection}>
          Reset All
        </button>
      </div>
    </div>
  `;

  const RenderLanguage = () => html`
    <div class="language-grid">
      <p>Select the Language(s)</p>
      <div class="language-buttons">
        ${locales.value.map(
    (language) => language.livecopies.length > 0
            && html`
              <button
                key=${language.languagecode}
                class="language-button ${language.livecopies
    .split(',')
    .some((locale) => selectedLocale.includes(locale))
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
  `;

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

    return Object.keys(groupedLocales).map((languageName) => {
      const localesInLanguage = groupedLocales[languageName];

      return html`
        <div class="locale-group">
          <p class="language-name"><strong>${languageName}</strong></p>
          <div class="locale-button-container">
            ${localesInLanguage.map(
    (locale) => html`
                <button
                  class="locale-button ${activeLocales[locale] ? 'active' : ''}"
                  onClick=${() => toggleLocale(locale)}
                >
                  ${locale.toUpperCase()}
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
        <p class="locui-project-name"><strong>Project Name:</strong> ${project.value.name || 'n/a'}</p>
      </div>
      <${RenderRegion} />
      <div class="language-locale-container">
        <${RenderLanguage} />
        ${selectedLocale.length > 0
        && html`
          <div class="locale-grid">
            <p>Selected Locales</p>
            <div class="locale-container">${RenderLocales()}</div>
          </div>
        `}
      </div>
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
