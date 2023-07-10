import { ignore } from '../../src/utils.js';

// some referenced @pandora modules import `@pandora/fetch`
// but it never activates from tests and can be mocked

// eslint-disable-next-line import/prefer-default-export
export { ignore as fetch };
