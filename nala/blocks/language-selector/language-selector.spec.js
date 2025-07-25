module.exports = {
  name: 'Language Selector',
  features: [
    {
      tcid: '0',
      name: 'language_selector_regionPicker',
      path: '/drafts/nala/blocks/language-selector/language-selector-regionpicker?autoConsent',
      data: {
        selectedLanguage: 'English(US)',
        languageOption1: 'English(UK)',
        languageOption2: 'English(APAC)',
        languageOption3: 'Français',
        languageOption4: '日本語',
        languageOption5: 'Deutsch',
        languageOption6: '한국인',
      },
      tags: '@language-selector @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: 'language_selector',
      path: '/drafts/nala/blocks/language-selector/marquee-standard-page?autoConsent',
      data: {
        h2Text: 'Heading XL Marquee standard small light',
        bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        outlineButtonText: 'Lorem ipsum',
        blueButtonText: 'Call to action',
        selectedLanguage: 'English(US)',
        languageOption1: 'English(UK)',
        languageOption2: 'English(APAC)',
        languageOption3: 'Français',
        languageOption4: '日本語',
        languageOption5: 'Deutsch',
        languageOption6: '한국인',
      },
      tags: '@language-selector @smoke @regression @milo',
    },
  ],
};
