import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SearchAndSortBar } from "./SearchAndSortBar";
import type { SortDirection, SortKey } from "../../models/country";

afterEach(() => {
  cleanup();
});

function Harness(props: {
  onQueryChange: (v: string) => void;
  onSortKeyChange: (v: SortKey) => void;
  onSortDirectionChange: (v: SortDirection) => void;
  resultCount?: number;
  totalCount?: number;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  return (
    <SearchAndSortBar
      query={query}
      onQueryChange={(v) => {
        props.onQueryChange(v);
        setQuery(v);
      }}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSortKeyChange={(v) => {
        props.onSortKeyChange(v);
        setSortKey(v);
      }}
      onSortDirectionChange={(v) => {
        props.onSortDirectionChange(v);
        setSortDirection(v);
      }}
      resultCount={props.resultCount ?? 3}
      totalCount={props.totalCount ?? 10}
    />
  );
}

describe("SearchAndSortBar", () => {
  it("calls onQueryChange with the full value while typing", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();

    render(
      <Harness
        onQueryChange={onQueryChange}
        onSortKeyChange={() => {}}
        onSortDirectionChange={() => {}}
      />
    );

    const input = screen.getByLabelText(/Search by country name/i);
    await user.type(input, "isr");

    expect(onQueryChange).toHaveBeenCalledTimes(3);
    expect(onQueryChange).toHaveBeenLastCalledWith("isr");
  });

  it("renders helper text with result count", () => {
    render(
      <Harness
        onQueryChange={() => {}}
        onSortKeyChange={() => {}}
        onSortDirectionChange={() => {}}
        resultCount={5}
        totalCount={250}
      />
    );

    expect(screen.getByText("Showing 5 of 250")).toBeInTheDocument();
  });

  it("calls onSortKeyChange when selecting a sort key", async () => {
    const user = userEvent.setup();
    const onSortKeyChange = vi.fn();

    render(
      <Harness
        onQueryChange={() => {}}
        onSortKeyChange={onSortKeyChange}
        onSortDirectionChange={() => {}}
      />
    );

    const sortBy = screen.getByRole("combobox", { name: /Sort by/i });
    await user.click(sortBy);
    await user.click(screen.getByRole("option", { name: /Population/i }));

    expect(onSortKeyChange).toHaveBeenCalledWith("population");
  });

  it("calls onSortDirectionChange when selecting a direction", async () => {
    const user = userEvent.setup();
    const onSortDirectionChange = vi.fn();

    render(
      <Harness
        onQueryChange={() => {}}
        onSortKeyChange={() => {}}
        onSortDirectionChange={onSortDirectionChange}
      />
    );

    const dir = screen.getByRole("combobox", { name: /Direction/i });
    await user.click(dir);
    await user.click(screen.getByRole("option", { name: /Descending/i }));

    expect(onSortDirectionChange).toHaveBeenCalledWith("desc");
  });
});
