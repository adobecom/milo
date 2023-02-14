import { html, signal, createContext, useContext, useCallback } from '../../../libs/deps/htm-preact.js';
import { initialProjectState } from '../components/fake.js';
import { useData } from '../hooks/useData.js';
import SmallLoader from '../components/SmallLoader.js';

const ProgressStateContext = createContext();

// states.value will store the entire projectState
// might lose fine-graned controls doing this way, as an update will rerender many things
// TODO: try: the other option is to build a tree with each leaf node being a signal
// but then the context might still rerender many things without memoization
// try: build zustand store using signals?
const states = signal(null);

// FIXME: temporary using fake data
async function getInitialData() {
  return new Promise((resolve) =>
    setTimeout(() => {
      states.value = initialProjectState;
      return resolve(initialProjectState);
    }, 1000),
  );
}

export default function ProgressStateWrapper({ children }) {
  const { isLoading, error } = useData(getInitialData);
  if (isLoading) return html`<${SmallLoader} color='blue' />`;
  if (error) return 'error loading data!';

  return html`<${ProgressStateContext.Provider} value=${{ states }}>${children}</${ProgressStateContext.Provider}>`;
}

export function useProgressState() {
  const context = useContext(ProgressStateContext);
  if (context === undefined) {
    throw new Error('useProgressState must be used within ProgressStateWrapper');
  }
  const { states } = context;
  const { allItems, projectName, subprojectStates } = states.value;

  // FIXME: separate states from children
  return { allItems, projectName, subprojectStates, states };
}
