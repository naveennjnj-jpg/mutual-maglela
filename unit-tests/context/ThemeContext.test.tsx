import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import axios from "axios";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

vi.unmock("@/context/ThemeContext");
vi.mock("axios", () => {
  const instance: any = { get: vi.fn(), patch: vi.fn() };
  return { default: instance, ...instance };
});
const mocked = axios as unknown as { get: any; patch: any };
const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;
const root = document.documentElement;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  root.className = "";
  root.removeAttribute("data-theme");
});

describe("useTheme outside provider", () => {
  it("throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(/within a ThemeProvider/);
    spy.mockRestore();
  });
});

describe("ThemeProvider", () => {
  it("defaults to light when nothing is saved", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(root.classList.contains("light")).toBe(true));
    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
  });

  it("uses saved theme from localStorage when there is no token", async () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("dark"));
    expect(root.classList.contains("dark")).toBe(true);
    expect(root.getAttribute("data-theme")).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("uses the theme returned by the API when a token exists", async () => {
    localStorage.setItem("token", "t");
    mocked.get.mockResolvedValueOnce({ data: { success: true, data: { theme: "dark" } } });
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("falls back to the saved theme when the API fails", async () => {
    localStorage.setItem("token", "t");
    localStorage.setItem("theme", "dark");
    mocked.get.mockRejectedValueOnce(new Error("x"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("dark"));
    spy.mockRestore();
  });

  it("setTheme applies the class, persists it, and skips the API without a token", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("light"));
    await act(async () => { await result.current.setTheme("dark"); });
    expect(result.current.theme).toBe("dark");
    expect(root.classList.contains("dark")).toBe(true);
    expect(root.classList.contains("light")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(mocked.patch).not.toHaveBeenCalled();
  });

  it("toggleTheme flips light <-> dark", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("light"));
    await act(async () => { result.current.toggleTheme(); });
    await waitFor(() => expect(result.current.theme).toBe("dark"));
    await act(async () => { result.current.toggleTheme(); });
    await waitFor(() => expect(result.current.theme).toBe("light"));
  });

  it("setTheme persists to the API when a token exists", async () => {
    localStorage.setItem("token", "t");
    mocked.get.mockResolvedValue({ data: { success: true, data: { theme: "dark" } } });
    mocked.patch.mockResolvedValue({ data: { success: true } });
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("dark"));
    await act(async () => { await result.current.setTheme("dark"); });
    expect(mocked.patch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/update-profile"),
      { theme: "dark" },
      expect.anything()
    );
  });
});
