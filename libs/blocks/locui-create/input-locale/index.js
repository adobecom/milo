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
  updateDraftProject,
} from '../store.js';
import { ENG_LANG_CODE, PROJECT_TYPES } from '../utils/constant.js';

function initialLanguageList() {
  if (
    project.value.type === PROJECT_TYPES.translation) {
    return locales.value.filter((locItem) => locItem.languagecode !== ENG_LANG_CODE);
  }
  return locales.value;
}

function initialRegions() {
  if (project.value.type === PROJECT_TYPES.translation) {
    const englishLocale = locales.value.filter((locItem) => locItem.languagecode === ENG_LANG_CODE);
    const { livecopies = '' } = englishLocale[0] || {};
    return localeRegion.value.reduce((acc, curr) => {
      const { key, value } = curr;
      const valueList = value.split(',');
      const valueWithoutEnglishLocale = valueList.reduce((localeList, locale) => {
        if (!livecopies.includes(locale)) {
          localeList.push(locale);
        }
        return localeList;
      }, []);

      acc.push({
        key,
        value: valueWithoutEnglishLocale.join(','),
      });

      return acc;
    }, []);
  }
  return localeRegion.value;
}

export default function useInputLocale() {
  const [selectedRegion, setSelectedRegion] = useState(
    locSelected.value?.selectedRegion || {},
  );
  const [selectedLocale, setSelectedLocale] = useState(
    locSelected.value?.selectedLocale || [],
  );
  const [activeLocales, setActiveLocales] = useState(
    locSelected.value?.activeLocales || {},
  );
  const [languagesList] = useState(initialLanguageList);

  const [localeRegionList] = useState(initialRegions);

  const [apiError, setApiError] = useState('');

  const findLanguageForLocale = (locale) => languagesList.find((lang) => lang.livecopies.split(',').includes(locale));

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
    return Object.entries(groupedLocales).map(([language, localeList]) => {
      const languageItem = {
        language,
        locales: project.value.type === PROJECT_TYPES.translation ? [] : localeList,
        langCode: languageCodes[language],
      };
      return languageItem;
    });
  };

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
    setSelectedLocale((prev) => prev.filter((locale) => !regionCountryCodes.includes(locale)));
    removeLocalesFromActive(regionCountryCodes);
  };

  const updateRegionStates = (localeList) => {
    const updatedRegionStates = {};
    localeRegionList.forEach((region) => {
      const regionLocales = region.value.split(',');
      const isRegionActive = regionLocales.every((locale) => localeList.includes(locale));
      updatedRegionStates[region.key] = isRegionActive;
    });
    return updatedRegionStates;
  };

  const selectAll = () => {
    const allRegions = {};
    const allLocales = [];
    const allActiveLocales = {};

    localeRegionList.forEach((region) => {
      const regionLocales = region.value.split(',');
      allRegions[region.key] = regionLocales.reduce((acc, locale) => {
        acc[locale] = true;
        return acc;
      }, {});
      allLocales.push(...regionLocales);
    });

    languagesList.forEach((lang) => {
      lang.livecopies.split(',').forEach((locale) => {
        allActiveLocales[locale] = lang.language;
      });
    });

    setSelectedRegion(allRegions);
    setSelectedLocale(allLocales);
    setActiveLocales(allActiveLocales);
  };

  useEffect(() => {
    setSelectedRegion((prevState) => ({
      ...prevState,
      ...updateRegionStates(selectedLocale),
    }));
  }, [selectedLocale]);

  const errorPresent = () => Object.keys(activeLocales).length > 0;

  const prefillActionAndWorkflow = (languages) => {
    const storedLanguages = project.value?.languages ?? [];
    if (storedLanguages.length < 1) {
      return languages.map((lang) => ({ ...lang, action: project.value.type === PROJECT_TYPES.translation ? 'Translate' : 'Rollout', workflow: '' }));
    }
    let iteratorIndex = 0;
    const prefilledLanguages = [];

    while (iteratorIndex < languages.length) {
      const { action, workflow } = storedLanguages[iteratorIndex] ?? {};
      const prefillLanguage = {
        ...languages[iteratorIndex],
        action,
        workflow: workflow || '',
      };
      if (!action) {
        prefillLanguage.action = project.value.type === PROJECT_TYPES.translation ? 'Translate' : 'Rollout';
      }
      prefilledLanguages.push(prefillLanguage);
      iteratorIndex += 1;
    }
    return prefilledLanguages;
  };

  const handleNext = async () => {
    if (!errorPresent()) return;
    const sortedLanguages = transformActiveLocales()
      .sort((a, b) => a.language.localeCompare(b.language));
    setProject({ languages: prefillActionAndWorkflow(sortedLanguages) });
    setLocale({ selectedRegion, selectedLocale, activeLocales });

    const error = await updateDraftProject();
    if (error) {
      setApiError(error);
    } else {
      nextStep();
    }
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

  const selectLanguage = (lang) => {
    const languageCodes = lang.livecopies.split(',');
    const isDeselecting = languageCodes.some((code) => selectedLocale.includes(code));
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

  return {
    selectedRegion,
    selectedLocale,
    activeLocales,
    localeRegionList,
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
    languagesList,
  };
}