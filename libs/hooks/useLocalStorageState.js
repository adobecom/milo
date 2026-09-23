import { useState } from '../deps/htm-preact.js';

export default function useLocalStorageState(key, getDefault) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : getDefault();
  });

  const setPersistedState = (value) => {
    setState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return [state, setPersistedState];
}
