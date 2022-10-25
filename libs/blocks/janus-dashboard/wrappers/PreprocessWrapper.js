import { html, createContext, useContext } from '../../../deps/htm-preact.js';
import { DataContext } from './FetchDataWrapper.js';
import { preprocessTestResults } from '../components/utils.js';

export const PreprocessContext = createContext({
  mapByConsumer: null,
  mapByFeature: null,
  cntMapByConsumer: null,
  cntMapByFeature: null,
  totalCnt: 0,
  totalPassedCnt: 0,
  totalFailedCnt: 0,
  flattened: [],
});

export function PreprocessWrapper({ children }) {
  const results = useContext(DataContext);
  const preprocessed = preprocessTestResults(results);
  return html`<${PreprocessContext.Provider} value=${preprocessed}>${children}<//>`;
}
