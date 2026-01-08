import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCountries } from "./useCountries";
import type { Country, SortState } from "../../models/country";
import { fetchCountries } from "../../api/countriesApi/countriesApi";
import { sortCountries } from "../../utils/sortCountries/sortCountries";

vi.mock("../../api/countriesApi/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));

vi.mock("../../utils/sortCountries/sortCountries", () => ({
  sortCountries: vi.fn(),
}));

const mockFetchCountries = vi.mocked(fetchCountries);
const mockSortCountries = vi.mocked(sortCountries);

const mockCountries: Country[] = [
  {
    id: "1",
    name: "Israel",
    capital: "Jerusalem",
    population: 9000000,
    flagUrl: "",
    flagAlt: "",
  },
  {
    id: "2",
    name: "Italy",
    capital: "Rome",
    population: 59000000,
    flagUrl: "",
    flagAlt: "",
  },
];

describe("useCountries", () => {
  const sort: SortState = { key: "name", direction: "asc" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads countries successfully", async () => {
    mockFetchCountries.mockResolvedValue(mockCountries);
    mockSortCountries.mockReturnValue(mockCountries);

    const { result } = renderHook(() => useCountries({ query: "", sort }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.total).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it("filters countries by query", async () => {
    mockFetchCountries.mockResolvedValue(mockCountries);
    mockSortCountries.mockImplementation((countries) => countries);

    const { result } = renderHook(() => useCountries({ query: "isr", sort }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toHaveLength(1);
    expect(result.current.countries[0].name).toBe("Israel");
  });

  it("calls sortCountries with filtered countries and sort state", async () => {
    mockFetchCountries.mockResolvedValue(mockCountries);
    mockSortCountries.mockReturnValue(mockCountries);

    renderHook(() => useCountries({ query: "", sort }));

    await waitFor(() => {
      expect(mockSortCountries).toHaveBeenCalled();
    });

    expect(mockSortCountries).toHaveBeenCalledWith(mockCountries, sort);
  });

  it("sets error when fetchCountries fails", async () => {
    mockFetchCountries.mockRejectedValue(new Error("Network error"));
    mockSortCountries.mockImplementation((countries) => countries);

    const { result } = renderHook(() => useCountries({ query: "", sort }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.countries).toEqual([]);
  });

  it("does not set error on AbortError", async () => {
    const abortError = new Error("aborted");
    (abortError as any).name = "AbortError";

    mockFetchCountries.mockRejectedValue(abortError);

    const { result } = renderHook(() => useCountries({ query: "", sort }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});
