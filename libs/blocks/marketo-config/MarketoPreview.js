import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { Input, Select } from '../../ui/controls/formControls.js';
import { setPreferences } from '../marketo/marketo.js';

const MarketoPreview = ({ section }) => {
  const [locale, setLocale] = useState('');
  const [twoUp, setTwoUp] = useState(true);
  const [resource, setResource] = useState(true);
  const [titleText, setTitleText] = useState('Download the report.');
  const [descriptionText, setDescriptionText] = useState('Please share some contact information to download the report.');

  const localeOptions = {
    "": 'Choose an option...',
    "en_us": "English (United States)",
    "en_gb": "English (United Kingdom)",
    "es_es": "Spanish (Spain)",
    "fr_fr": "French (France)",
    "ja_jp": "Japanese (Japan)",
    "zh_tw": "Chinese (Traditional, Taiwan)",
    "zh_cn": "Chinese (Simplified, China)",
    "ko": "Korean",
    "de": "German",
    "da": "Danish",
    "sv": "Swedish",
    "it": "Italian",
    "nl": "Dutch",
    "no": "Norwegian",
    "pt": "Portuguese",
    "fi": "Finnish",
    "ru": "Russian",
    "tr": "Turkish",
    "pl": "Polish",
    "cs": "Czech"
  }

  const handleTwoUpChange = (value) => {
    setTwoUp(value);
  };

  const handleResourceChange = (value) => {
    setResource(value);
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
    if (resource) {
      section.classList.add('resource-form');
    } else {
      section.classList.remove('resource-form');
    }

    const header = section.querySelector('div.marketo section > h3');
    if (header) header.textContent = titleText;

    const body = section.querySelector('div.marketo section > p');
    if (body) body.textContent = descriptionText;

    setPreferences({ 'profile.prefLanguage': locale });
  
  }, [twoUp, resource, titleText, descriptionText, locale]);

  return html`
    <div class="preview">
      <div class="preview-container">
      <section class="preview-options">
        <div class="preview-title"><h2>Page Preview</h2></div>
        <div class="layout-options">
          <p>Page Layout</p>
          <${Input} name="twoUp" class="preview-option" label="Section Two-Up" type="checkbox" value=${twoUp} onChange=${handleTwoUpChange} />
          <${Input} name="resource" class="preview-option" label="Section Resource Form" type="checkbox" value=${resource} onChange=${handleResourceChange} />
        </div>
        <div class="content-options">
          <p>Page Content</p>
          <${Select} name="locale" class="preview-option" label="Page Locale" options=${localeOptions} value=${locale} onChange=${handleLocaleChange} />
          <${Input} name="title" class="preview-option" label="Form Title" value=${titleText} onChange=${handleHeaderChange} />
          <${Input} name="description" class="preview-option" label="Form Description" value=${descriptionText} onChange=${handleBodyChange} />
        </div>
        </section>
      </div>
    </div>
  `;
};

export default MarketoPreview;
