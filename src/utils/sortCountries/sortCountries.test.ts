import { describe, it, expect } from "vitest";
import { sortCountries } from "./sortCountries";
import type { Country, SortState } from "../../models/country";

const base: Country[] = [
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
  {
    id: "3",
    name: "Argentina",
    capital: "Buenos Aires",
    population: 45000000,
    flagUrl: "",
    flagAlt: "",
  },
];

describe("sortCountries", () => {
    describe("when sorting by name", () => {
      it("sorts ascending", () => {
        const sort: SortState = { key: "name", direction: "asc" };

        const result = sortCountries(base, sort);

        expect(result.map((c) => c.name)).toEqual([
          "Argentina",
          "Israel",
          "Italy",
        ]);
      });

      it("sorts descending", () => {
        const sort: SortState = { key: "name", direction: "desc" };

        const result = sortCountries(base, sort);

        expect(result.map((c) => c.name)).toEqual([
          "Italy",
          "Israel",
          "Argentina",
        ]);
      });
    });

    describe("when sorting by population", () => {
      it("sorts ascending", () => {
        const sort: SortState = { key: "population", direction: "asc" };

        const result = sortCountries(base, sort);

        expect(result.map((c) => c.population)).toEqual([
          9000000, 45000000, 59000000,
        ]);
      });

      it("sorts descending", () => {
        const sort: SortState = { key: "population", direction: "desc" };

        const result = sortCountries(base, sort);

        expect(result.map((c) => c.population)).toEqual([
          59000000, 45000000, 9000000,
        ]);
      });
    });

  it("does not mutate the input array", () => {
    const sort: SortState = { key: "name", direction: "asc" };
    const original = [...base];

    sortCountries(base, sort);

    expect(base).toEqual(original);
  });

  it("returns a new array instance even when already sorted", () => {
    const sort: SortState = { key: "name", direction: "asc" };
    const alreadySorted = [...base].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const result = sortCountries(alreadySorted, sort);

    expect(result).not.toBe(alreadySorted);
    expect(result).toEqual(alreadySorted);
  });

  it("returns empty array when input is empty", () => {
    const sort: SortState = { key: "name", direction: "asc" };

    const result = sortCountries([], sort);

    expect(result).toEqual([]);
  });

  it("handles ties in population without crashing", () => {
    const items: Country[] = [
      {
        id: "1",
        name: "A",
        capital: "—",
        population: 10,
        flagUrl: "",
        flagAlt: "",
      },
      {
        id: "2",
        name: "B",
        capital: "—",
        population: 10,
        flagUrl: "",
        flagAlt: "",
      },
      {
        id: "3",
        name: "C",
        capital: "—",
        population: 5,
        flagUrl: "",
        flagAlt: "",
      },
    ];

    const sort: SortState = { key: "population", direction: "asc" };

    const result = sortCountries(items, sort);

    expect(result.map((c) => c.population)).toEqual([5, 10, 10]);
    expect(result).toHaveLength(3);
  });
});
