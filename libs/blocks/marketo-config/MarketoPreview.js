import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { Input } from '../../ui/controls/formControls.js';

const MarketoPreview = ({ section }) => {
  const [twoUp, setTwoUp] = useState(true);
  const [titleText, setTitleText] = useState('Download the report.');
  const [descriptionText, setDescriptionText] = useState('Please share some contact information to download the report.');

  const handleTwoUpChange = (value) => {
    setTwoUp(value);
  };

  const handleHeaderChange = (value) => {
    setTitleText(value);
  };

  const handleBodyChange = (value) => {
    setDescriptionText(value);
  };

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
  }, [twoUp, titleText, descriptionText]);

  return html`
    <div class="preview">
      <div class="preview-container">
      <section class="preview-options">
        <div class="preview-title"><h2>Configurator Preview</h2></div>
        <${Input} name="twoUp" class="preview-option" label="Two-Up" type="checkbox" value=${twoUp} onChange=${handleTwoUpChange} />
        <${Input} name="title" class="preview-option" label="Title" value=${titleText} onChange=${handleHeaderChange} />
        <${Input} name="description" class="preview-option" label="Description" value=${descriptionText} onChange=${handleBodyChange} />
        </section>
      </div>
    </div>
  `;
};

export default MarketoPreview;
