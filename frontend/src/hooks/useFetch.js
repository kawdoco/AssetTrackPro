// Custom hook for fetching data
import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const memoizedFetchFunction = useCallback(fetchFunction, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await memoizedFetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoizedFetchFunction]);

  return { data, loading, error };
};

export default useFetch;
