import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { Input, Select } from '../../ui/controls/formControls.js';
import { setPreferences } from '../marketo/marketo.js';

const MarketoPreview = ({ section }) => {
  const [locale, setLocale] = useState('');
  const [twoUp, setTwoUp] = useState(true);
  const [titleText, setTitleText] = useState('Download the report.');
  const [descriptionText, setDescriptionText] = useState('Please share some contact information to download the report.');

  const localeOptions = {
    "": 'Choose an option...',
    "de": "Deutsch",
    "fr_fr": "Français",
    "zh_cn": "简体中文",
    "ja_jp": "日本語",
    "ko": "한국어",
    "zh_tw": "简体中文",
    "da": "Dansk",
    "sv": "Svenska",
    "it": "Italiano",
    "en_gb": "English (UK)",
    "nl": "Nederlands",
    "no": "Norsk",
    "pt": "Português",
    "fi": "Suomi",
    "ru": "русский",
    "tr": "Türk",
    "pl": "polski",
    "cs": "čeština",
  }

  const handleTwoUpChange = (value) => {
    setTwoUp(value);
  };

  const handleHeaderChange = (value) => {
    setTitleText(value);
  };

  const handleBodyChange = (value) => {
    setDescriptionText(value);
  };

  const handleLocaleChange = (value) =>{
    setLocale(value);
  }

  useEffect(() => {
    if (twoUp) {
      section.classList.add('two-up');
    } else {
      section.classList.remove('two-up');
    }

    const header = section.querySelector('div.marketo section > h3');
    if (header) header.textContent = titleText;

    const body = section.querySelector('div.marketo section > p');
    if (body) body.textContent = descriptionText;

    setPreferences({ 'profile.prefLanguage': locale })
  }, [twoUp, titleText, descriptionText]);

  return html`
    <div class="preview">
      <div class="preview-container">
      <section class="preview-options">
        <div class="preview-title"><h2>Configurator Preview</h2></div>
        <${Input} name="twoUp" class="preview-option" label="Two-Up" type="checkbox" value=${twoUp} onChange=${handleTwoUpChange} />
        <${Input} name="title" class="preview-option" label="Title" value=${titleText} onChange=${handleHeaderChange} />
        <${Input} name="description" class="preview-option" label="Description" value=${descriptionText} onChange=${handleBodyChange} />
        <${Select} name="locale" class="preview-option" label="Locale" options=${localeOptions} value=${locale} onChange=${handleLocaleChange} />
        </section>
      </div>
    </div>
  `;
};

export default MarketoPreview;
