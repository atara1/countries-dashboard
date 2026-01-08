import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchCountries } from "./countriesApi";

function mockFetchOnce(response: {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    response as unknown as Response
  );
}

describe("fetchCountries", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws a helpful error when response is not ok", async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "server error" }),
    });

    await expect(fetchCountries()).rejects.toThrow(
      "Failed to fetch countries (HTTP 500)"
    );
  });

  it("passes AbortSignal to fetch when provided", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    } as unknown as Response);

    const controller = new AbortController();
    await fetchCountries(controller.signal);

    expect(spy).toHaveBeenCalledTimes(1);
    const [url, options] = spy.mock.calls[0];

    expect(url).toContain("restcountries.com/v3.1/all");
    expect(options).toMatchObject({ signal: controller.signal });
  });
});
