import { ignore } from './utils.js';

// some referenced @pandora modules import `react`
// but it never activates from released bundle and can be mocked

const React = ignore;
const useContext = ignore;
const useMemo = ignore;

export default React;
export { useContext, useMemo };
