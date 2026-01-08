import type { Country, SortState } from "../../models/country";

export function sortCountries(items: Country[], sort: SortState): Country[] {
  const arr = [...items];

  arr.sort((countryA, countryB) => {
    let cmp = 0;

    if (sort.key === "name") {
      cmp = countryA.name.localeCompare(countryB.name);
    } else {
      cmp = countryA.population - countryB.population;
    }

    return sort.direction === "asc" ? cmp : -cmp;
  });

  return arr;
}
