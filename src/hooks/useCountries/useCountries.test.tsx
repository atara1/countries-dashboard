import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useCountries } from "./useCountries";
import type { Country, SortState } from "../../models/country";

vi.mock("../../api/countriesApi/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));

vi.mock("../../utils/sortCountries/sortCountries", () => ({
  sortCountries: vi.fn(),
}));

import { fetchCountries } from "../../api/countriesApi/countriesApi";
import { sortCountries } from "../../utils/sortCountries/sortCountries";

type WrapperProps = { children: ReactNode };

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  function Wrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return Wrapper;
}

describe("useCountries", () => {
  const sort: SortState = { key: "name", direction: "asc" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads countries successfully", async () => {
    const mockCountries: Country[] = [
      { id: "1", name: "Israel", capital: "Jerusalem", population: 9000000, flagUrl: "", flagAlt: "" },
      { id: "2", name: "Italy", capital: "Rome", population: 59000000, flagUrl: "", flagAlt: "" },
    ];

    vi.mocked(fetchCountries).mockResolvedValue(mockCountries);
    vi.mocked(sortCountries).mockReturnValue(mockCountries);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useCountries({ query: "", sort }), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.total).toBe(2);
    expect(result.current.error).toBeNull();
  });
});
