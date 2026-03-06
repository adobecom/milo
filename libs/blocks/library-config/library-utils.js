import { getSearchTags } from './lists/blocks.js';
import { getTemplateSearchTags } from './lists/templates.js';

/* search utility */
export function isMatching(container, query, type, titleText) {
  let tagsString;

  switch (type) {
    case 'blocks':
      tagsString = getSearchTags(container);
      break;
    case 'templates':
      tagsString = getTemplateSearchTags(container, titleText);
      break;
    default:
  }
  if (!query || !tagsString) return false;
  const searchTokens = query.split(' ');
  return searchTokens.every((token) => tagsString.toLowerCase().includes(token.toLowerCase()));
}

export default function createCopy(blob) {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  navigator.clipboard.write(data);
}
