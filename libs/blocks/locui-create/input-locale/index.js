import { useState } from '../../../deps/htm-preact.js';
import {
  nextStep,
  prevStep,
  locales,
  project,
  locSelected,
  setProject,
  setLocale,
  projectType,
} from '../store.js';

export default function useInputLocale() {
  const [selectedLocale, setSelectedLocale] = useState(
    locSelected.value?.selectedLocale || [],
  );
  const [activeLocales, setActiveLocales] = useState(
    locSelected.value?.activeLocales || {},
  );

  const findLanguageForLocale = (locale) => locales.value.find((lang) => lang.livecopies.split(',').includes(locale));

  const transformActiveLocales = () => {
    const groupedLocales = {};
    const languageCodes = {};
    Object.entries(activeLocales).forEach(([locale, language]) => {
      const langObj = findLanguageForLocale(locale);
      if (!langObj) return;

      if (!groupedLocales[language]) {
        groupedLocales[language] = [];
        languageCodes[language] = langObj.languagecode;
      }
      groupedLocales[language].push(locale);
    });
    return Object.entries(groupedLocales).map(([language, localeList]) => ({
      language,
      locales: projectType.value === 'rollout' ? localeList : [],
      action: projectType.value,
      languagecode: languageCodes[language],
      workflow: '',
    }));
  };

  const updateActiveLocales = (localesToUpdate, isDeselecting = false) => {
    setActiveLocales((prev) => localesToUpdate.reduce((updated, locale) => {
      if (isDeselecting) {
        delete updated[locale];
      } else {
        const language = findLanguageForLocale(locale);
        if (language) updated[locale] = language.language;
      }
      return updated;
    }, { ...prev }));
  };

  const errorPresent = () => !!Object.keys(activeLocales).length;

  const handleNext = () => {
    if (!errorPresent()) return;
    setProject({ languages: transformActiveLocales() });
    setLocale({ selectedLocale, activeLocales });
    nextStep();
  };

  const handleBack = () => {
    setLocale({ selectedLocale, activeLocales });
    prevStep();
  };

  const selectLanguage = (lang) => {
    const languageCodes = lang.livecopies.split(',');
    const isDeselecting = languageCodes.some((code) => selectedLocale.includes(code));
    setSelectedLocale((prev) => {
      if (isDeselecting) {
        return prev.filter((locale) => !languageCodes.includes(locale));
      }
      return [...prev, ...languageCodes];
    });
    updateActiveLocales(languageCodes, isDeselecting);
  };

  const toggleLocale = (locale) => {
    setActiveLocales((prev) => {
      const updated = { ...prev };
      if (updated[locale]) {
        delete updated[locale];
      } else {
        const language = findLanguageForLocale(locale);
        if (language) updated[locale] = language.language;
      }
      return updated;
    });
  };

  return {
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
  };
}
