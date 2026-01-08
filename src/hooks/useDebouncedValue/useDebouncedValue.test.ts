import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useDebouncedValue("a", 200));
    expect(result.current).toBe("a");
  });

  it("updates the debounced value only after the delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 200 } }
    );

    expect(result.current).toBe("a");

    rerender({ value: "ab", delay: 200 });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");
  });

  it("debounces multiple rapid changes and keeps only the last one", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    rerender({ value: "abc" });
    rerender({ value: "abcd" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("abcd");
  });

  it("updates sooner when delay is reduced", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("b");
  });

  it("does not update to an intermediate value if value changes again before delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abc" });

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("abc");
  });
});
