import { useState, useEffect } from '../../../deps/htm-preact.js';

export default function useGetData(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setIsError(false);
      const fetchAndSetState = async () => {
        try {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error('res not ok!');
          }
          const results = await res.json();
          if (!didCancel) setData(results);
        } catch (err) {
          if (!didCancel) {
            setIsError(true);
          }
        }
        if (!didCancel) setIsLoading(false);
      };
      setTimeout(fetchAndSetState, 2000);
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return { isLoading, isError, data };
}
