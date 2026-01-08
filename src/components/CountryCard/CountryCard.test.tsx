import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { Country } from "../../models/country";
import { CountryCard } from "./CountryCard";

afterEach(() => {
  cleanup();
});

describe("CountryCard", () => {
  it("renders country name", () => {
    const country: Country = {
      id: "1",
      name: "Israel",
      capital: "Jerusalem",
      population: 9000000,
      flagUrl: "flag.png",
      flagAlt: "Flag of Israel",
    };

    render(<CountryCard country={country} />);

    expect(screen.getByText("Israel")).toBeInTheDocument();
  });

  it("renders capital when provided", () => {
    const country: Country = {
      id: "1",
      name: "Israel",
      capital: "Jerusalem",
      population: 9000000,
      flagUrl: "flag.png",
      flagAlt: "Flag of Israel",
    };

    render(<CountryCard country={country} />);

    expect(screen.getAllByText(/Capital:\s*Jerusalem/i)).toHaveLength(1);
  });
});
