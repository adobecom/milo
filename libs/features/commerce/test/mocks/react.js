import { ignore } from '../../utils.js';

// @ts-ignore
ignore.createContext = ignore;
export default ignore;
export {
  ignore as useContext,
  ignore as useMemo,
};
