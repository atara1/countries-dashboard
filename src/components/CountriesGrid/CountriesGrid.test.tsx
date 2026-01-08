import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import type { Country } from "../../models/country";
import { CountriesGrid } from "./CountriesGrid";
const countryCardMock = vi.fn();

vi.mock("../CountryCard/CountryCard", () => ({
  CountryCard: (props: { country: Country }) => {
    countryCardMock(props.country);
    return null;
  },
}));

describe("CountriesGrid", () => {
  beforeEach(() => {
    countryCardMock.mockClear();
  });

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

  it("renders a CountryCard for each country", () => {
    render(<CountriesGrid countries={countries} />);
    expect(countryCardMock).toHaveBeenCalledTimes(2);
  });

  it("passes the correct country object to each CountryCard", () => {
    render(<CountriesGrid countries={countries} />);
    expect(countryCardMock).toHaveBeenNthCalledWith(1, countries[0]);
    expect(countryCardMock).toHaveBeenNthCalledWith(2, countries[1]);
  });

  it("renders nothing when countries array is empty", () => {
    render(<CountriesGrid countries={[]} />);
    expect(countryCardMock).not.toHaveBeenCalled();
  });
});
