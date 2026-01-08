import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SortState } from "../../models/country";
import { fetchCountries } from "../../api/countriesApi/countriesApi";
import { sortCountries } from "../../utils/sortCountries/sortCountries";

export function useCountries(params: { query: string; sort: SortState }) {
  const { query, sort } = params;

  const queryResult = useQuery({
    queryKey: ["countries"],
    queryFn: ({ signal }) => fetchCountries(signal),
  });

  const filteredAndSorted = useMemo(() => {
    const countries = queryResult.data ?? [];
    const q = query.trim().toLowerCase();

    const filtered = q
      ? countries.filter((c) => c.name.toLowerCase().includes(q))
      : countries;

    return sortCountries(filtered, sort);
  }, [queryResult.data, query, sort]);

  return {
    countries: filteredAndSorted,
    total: queryResult.data?.length ?? 0,
    loading: queryResult.isLoading,
    error: queryResult.error instanceof Error ? queryResult.error.message : null,
  };
}
