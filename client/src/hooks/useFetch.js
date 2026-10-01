import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Minimal fetch-on-mount hook used by the public sections. Keeps each
 * section self-contained (loading + empty + error handled locally) without
 * pulling in a full data-fetching library for what is a small, mostly
 * read-only public site.
 */
const useFetch = (url, fallback = []) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(url)
      .then(({ data: body }) => {
        if (!cancelled) setData(body.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
