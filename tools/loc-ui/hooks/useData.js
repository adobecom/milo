import { useState, useEffect, useRef } from '../../../libs/deps/htm-preact.js';

export const getData = async (url) => {
  const res = await fetch(url);
  const { ok, status, statusText } = res;
  if (!ok) {
    console.error(`${status}: ${statusText}`);
    throw new Error('res not ok!');
  }
  const results = await res.json();
  return results.data;
};

export function useData(fetchFunc) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await fetchFunc();
        if (!didCancel) setData(results);
      } catch (err) {
        console.error(err);
        if (!didCancel) {
          setError(err);
        }
      }
      if (!didCancel) setIsLoading(false);
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [fetchFunc]);
  return { isLoading, error, data };
}

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
