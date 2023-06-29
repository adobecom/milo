import columns from '../columns/columns.js';

// TODO: add support for displaying personalization in fragment previews

export default function init(el) {
  el.classList.add('columns', 'contained');
  columns(el);
  el.insertAdjacentHTML('afterbegin', '<h3>Fragment Personalization (info only):</h3>');
}
