import { createTag, getConfig } from '../../utils/utils.js';

const init = () => {
  const config = getConfig();
  const { contentRoot } = config.locale;
  console.log(contentRoot);
}

export default init;
