import { ignore } from '../../src/utils.js';

// some referenced @pandora modules import `react`
// but it never activates from tests and can be mocked

// @ts-ignore
ignore.createContext = ignore;
export default ignore;
export {
  ignore as useContext,
  ignore as useMemo,
};
