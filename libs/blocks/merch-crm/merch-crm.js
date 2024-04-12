import '../../deps/merch-card.js';
import { createTag } from '../../utils/utils.js';

export default async function init(el) {
  console.log(el);
  const title = {
    text: '',
    icons: [{
      src: '',
      size: '',
    }],
  };
  const description = '';
  const includes = {
    title: '',
    items: [],
  };
  const extras = {
    title: '',
    items: [],
  };
  const recommended = {
    title: '',
    items: [],
  };
  const merchCrm = createTag('merch-crm', {
    title,
    description,
    includes,
    extras,
    recommended,
  });
  console.log('merchCrm', merchCrm);
  return merchCrm;
}
