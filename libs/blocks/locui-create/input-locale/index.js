import { useState, useEffect, useCallback } from '../../../deps/htm-preact.js';
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
  initByParams,
  userWorkflowType,
} from '../store.js';
import { ENG_LANG_CODE, PROJECT_ACTION, PROJECT_TYPES, WORKFLOW } from '../utils/constant.js';

function initialLanguageList() {
  if (
    project.value.type === PROJECT_TYPES.translation) {
    return locales.value.filter((locItem) => locItem.languagecode !== ENG_LANG_CODE);
  }
  return locales.value;
}

function initialRegions() {
  if (project.value.type === PROJECT_TYPES.translation) {
    const englishLocale = locales.value.find((locItem) => locItem.languagecode === ENG_LANG_CODE);
    const { livecopies = '' } = englishLocale || {};
    const livecopiesArr = livecopies.split(',');
    return localeRegion.value.reduce((acc, curr) => {
      const { key, value } = curr;
      const valueList = value.split(',');
      const valueWithoutEnglishLocale = valueList.reduce((localeList, locale) => {
        if (livecopiesArr.every((l) => l !== locale)) {
          localeList.push(locale);
        }
        return localeList;
      }, []);
      if (valueWithoutEnglishLocale.length > 0) {
        acc.push({
          key,
          value: valueWithoutEnglishLocale.join(','),
        });
      }

      return acc;
    }, []);
  }
  return localeRegion.value;
}

function prefillActionAndWorkflow(languages) {
  const storedLanguages = project.value?.languages ?? [];
  if (storedLanguages.length < 1) {
    return languages.map((lang) => ({
      ...lang,
      action: project.value.type === PROJECT_TYPES.translation
        ? PROJECT_ACTION.translate : PROJECT_ACTION.rollout,
      workflow: '',
    }));
  }

  const languageByCode = storedLanguages.reduce((acc, curr) => {
    const { langCode } = curr;
    acc[langCode] = curr;
    return acc;
  }, {});

  const prefilledLanguages = languages.map((lang) => {
    const { langCode } = lang;
    const { action, workflow = '' } = languageByCode[langCode] || {};
    const prefillLanguage = {
      ...lang,
      action,
      workflow,
    };
    if (!action) {
      prefillLanguage.action = project.value.type === PROJECT_TYPES.translation
        ? PROJECT_ACTION.translate : PROJECT_ACTION.rollout;
    }
    return prefillLanguage;
  });

  return prefilledLanguages;
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

  const getActualLocale = (locale) => locale.includes('|') ? locale.split('|')[1] : locale;
  
  const findLanguageForLocale = (locale) => languagesList.find(
    (lang) => lang.livecopies.split(',').includes(getActualLocale(locale)) &&
      (!locale.includes('|') || lang.languagecode === locale.split('|')[0])
  );

  const transformActiveLocales = () => {
    const groupedLocales = {};
    const languageCodes = {};
    Object.entries(activeLocales).forEach(([localeKey, language]) => {
      const locale = getActualLocale(localeKey);
      const langObj = findLanguageForLocale(localeKey);
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

  const updateActiveLocales = (localesToUpdate, isDeselecting = false, languageCode = null) => {
    setActiveLocales((prev) => {
      const updatedActiveLocales = { ...prev };
      localesToUpdate.forEach((locale) => {
        const language = findLanguageForLocale(locale)
        const localeKey = languageCode
          ? `${languageCode}|${locale}`
          : language
            ? `${language.languagecode}|${locale}`
            : locale
        if (isDeselecting) {
          delete updatedActiveLocales[localeKey];
        } else {
          if (language) updatedActiveLocales[localeKey] = language.language;
        }
      });
      return updatedActiveLocales;
    });
  };

  const removeLocalesFromActive = (localesToRemove, languageCode) => {
    setActiveLocales((prev) => {
      const updatedActiveLocales = { ...prev };
      localesToRemove.forEach((locale) => {
        const localeKey = `${languageCode}|${locale}`
        delete updatedActiveLocales[localeKey];
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
    const newLocalesWithLangCode = [];
    regionCountryCodes.forEach((locale) => {
      const language = findLanguageForLocale(locale);
      if (language) {
        newLocalesWithLangCode.push(`${language.languagecode}|${locale}`);
      }
    });
    setSelectedLocale((prev) => [
      ...prev,
      ...newLocalesWithLangCode.filter((code) => !prev.includes(code))
    ]);
    updateActiveLocales(regionCountryCodes);
  };

  const deselectRegion = (regionKey, regionCountryCodes) => {
    setSelectedRegion((prev) => {
      const { [regionKey]: _, ...rest } = prev;
      return rest;
    });
    setSelectedLocale((prev) => prev.filter((localeKey) => {
      const locale = getActualLocale(localeKey);
      return !regionCountryCodes.includes(locale);
    }));
    removeLocalesFromActive(regionCountryCodes);
  };

  const updateRegionStates = useCallback((localeList) => {
    const updatedRegionStates = {};
    localeRegionList.forEach((region) => {
      const regionLocales = region.value.split(',');
      const isRegionActive = regionLocales.every((locale) => localeList.includes(locale));
      updatedRegionStates[region.key] = isRegionActive;
    });
    return updatedRegionStates;
  }, [localeRegionList]);

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
    });

    languagesList.forEach((lang) => {
      const mappedLocales = lang.livecopies
        .split(',').map((locale) => `${lang.languagecode}|${locale}`);
      allLocales.push(...mappedLocales);
      lang.livecopies.split(',').forEach((locale) => {
        allActiveLocales[`${lang.languagecode}|${locale}`] = lang.language;
      });
    });

    setSelectedRegion(allRegions);
    setSelectedLocale(allLocales);
    setActiveLocales(allActiveLocales);
  };

  useEffect(() => {
    setSelectedRegion((prevState) => ({
      ...prevState,
      ...updateRegionStates(selectedLocale.map((locale) => locale.split('|')[1])),
    }));
  }, [selectedLocale, updateRegionStates]);

  const errorPresent = () => Object.keys(activeLocales).length > 0;

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
    const isDeselecting = languageCodes.every((code) => selectedLocale.includes(`${lang.languagecode}|${code}`))
    const updatedLocale = isDeselecting
    ? selectedLocale.filter((localeKey) => {
        const [langCode, locale] = localeKey.includes("|") ? localeKey.split("|") : [null, localeKey]
        return langCode !== lang.languagecode || !languageCodes.includes(locale)
      })
    : [...selectedLocale, ...languageCodes.map((code) => `${lang.languagecode}|${code}`)]
    setSelectedLocale(updatedLocale);
    updateActiveLocales(languageCodes, isDeselecting, lang.languagecode);
  };

  const toggleLocale = (localeKey) => {
    let isLangDeselecting = false;
    const lang = activeLocales[localeKey];
    const updatedActiveLocales = { ...activeLocales };
    if (updatedActiveLocales[localeKey]) {
      delete updatedActiveLocales[localeKey];
      isLangDeselecting = !Object.values(updatedActiveLocales)
        .some((val) => val.toLowerCase() === lang.toLowerCase());
    } else {
      const locale = getActualLocale(localeKey);
      const language = findLanguageForLocale(locale);
      if (language) {
        const newKey = localeKey.includes('|') ? localeKey : `${language.languagecode}|${localeKey}`;
        updatedActiveLocales[newKey] = language.language;
      }
    }
    setActiveLocales(updatedActiveLocales);
    if (isLangDeselecting && WORKFLOW[userWorkflowType.value]?.languages
      && !initByParams.value?.languages
        ?.some((val) => val.language.toLowerCase() === lang.toLowerCase())) {
      const languageLocales = languagesList
        .find((l) => l.language.toLowerCase() === lang.toLowerCase());
      const { livecopies = '' } = languageLocales;
      const updatedSelectedLocale = selectedLocale
        .filter((loc) => !livecopies.split(',').includes(getActualLocale(loc)));
      setSelectedLocale(updatedSelectedLocale);
    }
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
    getActualLocale,
  };
}
