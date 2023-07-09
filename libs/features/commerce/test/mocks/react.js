import { ignore } from '../../src/utils.js';

// @ts-ignore
ignore.createContext = ignore;
export default ignore;
export {
  ignore as useContext,
  ignore as useMemo,
};
