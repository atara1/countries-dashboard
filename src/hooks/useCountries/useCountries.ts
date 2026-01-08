import { useEffect, useMemo, useState } from "react";
import type { Country, SortState } from "../../models/country";
import { fetchCountries } from "../../api/countriesApi/countriesApi";
import { sortCountries } from "../../utils/sortCountries/sortCountries";

export function useCountries(params: { query: string; sort: SortState }) {
  const { query, sort } = params;
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setCountries([]);

    fetchCountries(controller.signal)
      .then(setCountries)
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Something went wrong");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? countries.filter((c) => c.name.toLowerCase().includes(q))
      : countries;

    return sortCountries(filtered, sort);
  }, [countries, query, sort]);

  return {
    countries: filteredAndSorted,
    total: countries.length,
    loading,
    error,
  };
}
