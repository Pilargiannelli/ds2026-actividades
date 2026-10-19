import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      setError(null);

      try {
        const json = await apiFetch<T>(url); // apiFetch preserva el mensaje real del error
        if (!cancelado) setData(json);
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : "Error desconocido al cargar los datos.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [url]);

  return { data, loading, error };
}
