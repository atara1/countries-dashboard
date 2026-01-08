import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Country, SortState } from "../../models/country";
import { cleanup } from "@testing-library/react";

vi.mock("../../hooks/useDebouncedValue/useDebouncedValue", () => ({
  useDebouncedValue: vi.fn(),
}));

vi.mock("../../hooks/useCountries/useCountries", () => ({
  useCountries: vi.fn(),
}));

vi.mock("../../components/LoadingState", () => ({
  LoadingState: () => <div data-testid="loading">loading</div>,
}));

vi.mock("../../components/ErrorState", () => ({
  ErrorState: (props: { message: string }) => (
    <div data-testid="error">{props.message}</div>
  ),
}));

vi.mock("../../components/CountriesGrid/CountriesGrid", () => ({
  CountriesGrid: (props: { countries: Country[] }) => (
    <div data-testid="grid">{props.countries.length}</div>
  ),
}));

vi.mock("../../components/SearchAndSortBar/SearchAndSortBar", () => ({
  SearchAndSortBar: (props: {
    query: string;
    onQueryChange: (v: string) => void;
    sortKey: SortState["key"];
    sortDirection: SortState["direction"];
    onSortKeyChange: (v: SortState["key"]) => void;
    onSortDirectionChange: (v: SortState["direction"]) => void;
    resultCount: number;
    totalCount: number;
  }) => (
    <div>
      <input
        aria-label="search"
        value={props.query}
        onChange={(e) =>
          props.onQueryChange((e.target as HTMLInputElement).value)
        }
      />
      <div data-testid="counts">
        {props.resultCount}/{props.totalCount}
      </div>
      <button onClick={() => props.onSortKeyChange("population")}>
        sortKey
      </button>
      <button onClick={() => props.onSortDirectionChange("desc")}>
        sortDir
      </button>
    </div>
  ),
}));

import { useDebouncedValue } from "../../hooks/useDebouncedValue/useDebouncedValue";
import { useCountries } from "../../hooks/useCountries/useCountries";
import { CountriesDashboardPage } from "./CountriesDashboardPage";

const mockUseDebouncedValue = vi.mocked(useDebouncedValue);
const mockUseCountries = vi.mocked(useCountries);

afterEach(() => {
  cleanup();
});

describe("CountriesDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows LoadingState when loading and no error", () => {
    mockUseDebouncedValue.mockImplementation((v) => v);

    mockUseCountries.mockReturnValue({
      countries: [],
      total: 0,
      loading: true,
      error: null,
    });

    render(<CountriesDashboardPage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("shows ErrorState when error exists", () => {
    mockUseDebouncedValue.mockImplementation((v) => v);

    mockUseCountries.mockReturnValue({
      countries: [],
      total: 0,
      loading: false,
      error: "Boom",
    });

    render(<CountriesDashboardPage />);

    expect(screen.getByTestId("error")).toHaveTextContent("Boom");
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("shows CountriesGrid when not loading and no error", () => {
    mockUseDebouncedValue.mockImplementation((v) => v);

    const countries: Country[] = [
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

    mockUseCountries.mockReturnValue({
      countries,
      total: 2,
      loading: false,
      error: null,
    });

    render(<CountriesDashboardPage />);

    expect(screen.getByTestId("grid")).toHaveTextContent("2");
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  it("passes debounced query and sort state into useCountries", async () => {
    const user = userEvent.setup();

    mockUseDebouncedValue.mockReturnValue("isr");

    mockUseCountries.mockReturnValue({
      countries: [],
      total: 0,
      loading: false,
      error: null,
    });

    render(<CountriesDashboardPage />);

    expect(mockUseCountries).toHaveBeenCalledWith({
      query: "isr",
      sort: { key: "name", direction: "asc" },
    });

    const input = screen.getByLabelText("search");
    await user.type(input, "abc");

    expect(mockUseDebouncedValue).toHaveBeenLastCalledWith("abc", 150);
  });

  it("updates sort via SearchAndSortBar callbacks", async () => {
    const user = userEvent.setup();

    mockUseDebouncedValue.mockImplementation((v) => v);

    mockUseCountries.mockReturnValue({
      countries: [],
      total: 0,
      loading: false,
      error: null,
    });

    render(<CountriesDashboardPage />);

    await user.click(screen.getByText("sortKey"));
    await user.click(screen.getByText("sortDir"));

    const lastCall = mockUseCountries.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual({
      query: "",
      sort: { key: "population", direction: "desc" },
    });
  });
});
