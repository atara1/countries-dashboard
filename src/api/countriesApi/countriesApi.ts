import type { Country } from "../../models/country";

type RestCountriesResponseItem = {
  name?: { common?: string };
  capital?: string[];
  population?: number;
  flags?: { png?: string; svg?: string; alt?: string };
};

const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,capital,population,flags";

export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  const res = await fetch(API_URL, { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch countries (HTTP ${res.status})`);
  }

  const data = (await res.json()) as RestCountriesResponseItem[];

  return data
    .map<Country>((c) => ({
      id: `${c.name?.common ?? "unknown"}-${
        c.flags?.png ?? c.flags?.svg ?? ""
      }`,
      name: c.name?.common ?? "Unknown",
      capital: c.capital?.[0] ?? "—",
      population: typeof c.population === "number" ? c.population : 0,
      flagUrl: c.flags?.png ?? c.flags?.svg ?? "",
      flagAlt: c.flags?.alt ?? `Flag of ${c.name?.common ?? "Unknown"}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
