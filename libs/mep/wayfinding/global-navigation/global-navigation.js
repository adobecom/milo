import {
  toFragment,
  fetchAndProcessPlainHtml,
} from "../../../blocks/global-navigation/utilities/utilities.js";
import { getMetadata } from '../../../utils/utils.js';

// class Gnav {
//   constructor({ content, block } = {}) {
//     this.content = content;
//     this.block = block;
//   }

//   init = () => {
//     this.block.append('Hello world')
//   }
// }

export default async function init(block) {
  // const { mep } = getConfig();
  const sourceUrl = getMetadata('gnav-source');
  const content = await fetchAndProcessPlainHtml({ url: sourceUrl });
  const test = toFragment`<div>Hello World</div>`;
  block.innerHTML = content.innerHTML;
  // if (!content) {
  //   const error = new Error('Could not create global navigation. Content not found!');
  //   error.tags = 'gnav';
  //   error.url = url;
  //   error.errorType = 'error';
  //   lanaLog({ message: error.message, ...error });
  //   throw error;
  // }
  // const gnav = new Gnav({
  //   content,
  //   block,
  //   newMobileNav,
  // });
  // await gnav.init();
  // return gnav;
}
