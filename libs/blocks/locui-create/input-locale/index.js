import { useState, useEffect } from '../../../deps/htm-preact.js';
import {
  nextStep,
  prevStep,
  locales,
  localeRegion,
  project,
  locSelected,
  setProject,
  setLocale,
} from '../store.js';

export function inputLocale() {
  const [selectedRegion, setSelectedRegion] = useState(
    locSelected.value?.selectedRegion || {}
  );
  const [selectedLocale, setSelectedLocale] = useState(
    locSelected.value?.selectedLocale || []
  );
  const [activeLocales, setActiveLocales] = useState(
    locSelected.value?.activeLocales || {}
  );

  const updateRegionStates = (localeList) => {
    const updatedRegionStates = {};
    localeRegion.value.forEach((region) => {
      const regionLocales = region.value.split(',');
      const isRegionActive = regionLocales.every((locale) =>
        localeList.includes(locale)
      );
      updatedRegionStates[region.key] = isRegionActive;
    });
    return updatedRegionStates;
  };

  useEffect(() => {
    setSelectedRegion((prevState) => ({
      ...prevState,
      ...updateRegionStates(selectedLocale),
    }));
  }, [selectedLocale]);

  const errorPresent = () => Object.keys(activeLocales).length > 0;

  const handleNext = () => {
    if (!errorPresent()) return;
    setProject({ locale: transformActiveLocales() });
    setLocale({ selectedRegion, selectedLocale, activeLocales });
    nextStep();
  };

  const handleBack = () => {
    setLocale({ selectedRegion, selectedLocale, activeLocales });
    prevStep();
  };

  const resetSelection = () => {
    setSelectedRegion({});
    setSelectedLocale([]);
    setActiveLocales({});
  };

  const toggleRegion = (region) => {
    const regionCountryCodes = region.value.split(',');
    if (selectedRegion[region.key]) {
      deselectRegion(region.key, regionCountryCodes);
    } else {
      selectRegion(region.key, regionCountryCodes);
    }
  };

  const selectRegion = (regionKey, regionCountryCodes) => {
    setSelectedRegion((prev) => ({
      ...prev,
      [regionKey]: regionCountryCodes.reduce((acc, locale) => {
        acc[locale] = true;
        return acc;
      }, {}),
    }));
    setSelectedLocale((prev) => [
      ...prev,
      ...regionCountryCodes.filter((code) => !prev.includes(code)),
    ]);
    updateActiveLocales(regionCountryCodes);
  };

  const deselectRegion = (regionKey, regionCountryCodes) => {
    setSelectedRegion((prev) => {
      const { [regionKey]: _, ...rest } = prev;
      return rest;
    });
    setSelectedLocale((prev) =>
      prev.filter((locale) => !regionCountryCodes.includes(locale))
    );
    removeLocalesFromActive(regionCountryCodes);
  };

  const selectLanguage = (lang) => {
    const languageCodes = lang.livecopies.split(',');
    const isDeselecting = languageCodes.some((code) =>
      selectedLocale.includes(code)
    );

    const updatedLocale = isDeselecting
      ? selectedLocale.filter((locale) => !languageCodes.includes(locale))
      : [...selectedLocale, ...languageCodes];

    setSelectedLocale(updatedLocale);
    updateActiveLocales(languageCodes, isDeselecting);
  };

  const toggleLocale = (locale) => {
    setActiveLocales((prev) => {
      const updatedActiveLocales = { ...prev };
      if (updatedActiveLocales[locale]) {
        delete updatedActiveLocales[locale];
      } else {
        const language = findLanguageForLocale(locale);
        if (language) updatedActiveLocales[locale] = language.language;
      }
      return updatedActiveLocales;
    });
  };

  const findLanguageForLocale = (locale) =>
    locales.value.find((lang) => lang.livecopies.split(',').includes(locale));

  const updateActiveLocales = (localesToUpdate, isDeselecting = false) => {
    setActiveLocales((prev) => {
      const updatedActiveLocales = { ...prev };
      localesToUpdate.forEach((locale) => {
        if (isDeselecting) {
          delete updatedActiveLocales[locale];
        } else {
          const language = findLanguageForLocale(locale);
          if (language) updatedActiveLocales[locale] = language.language;
        }
      });
      return updatedActiveLocales;
    });
  };

  const removeLocalesFromActive = (localesToRemove) => {
    setActiveLocales((prev) => {
      const updatedActiveLocales = { ...prev };
      localesToRemove.forEach((locale) => {
        delete updatedActiveLocales[locale];
      });
      return updatedActiveLocales;
    });
  };

  const transformActiveLocales = () => {
    const groupedLocales = {};
    Object.entries(activeLocales).forEach(([locale, language]) => {
      if (!groupedLocales[language]) {
        groupedLocales[language] = [];
      }
      groupedLocales[language].push(locale);
    });
    return Object.entries(groupedLocales).map(([language, locales]) => ({
      languages: language,
      locales,
      action: '',
      workflow: '',
    }));
  };

  return {
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
  };
}
