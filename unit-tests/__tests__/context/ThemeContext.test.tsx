import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { ThemeProvider, useTheme } from "../../../src/context/ThemeContext";

// ThemeContext only reaches the network to sync a signed-in user's theme
// preference. We stub axios so tests never hit a real server.
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    // ThemeContext mutates the real <html> element; reset it so one
    // test's DOM changes can't leak into the next.
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.removeAttribute("data-theme");
    // No token by default -> fetchUserTheme takes the "local only" path.
    mockedAxios.get.mockRejectedValue(new Error("no session"));
  });

  it("defaults to light theme and applies it to <html> when nothing is stored", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.theme).toBe("light"));

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(result.current.isDark).toBe(false);
  });

  it("restores a previously saved theme from localStorage when there is no token", async () => {
    window.localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.theme).toBe("dark"));

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("fetches and applies the signed-in user's theme from the API", async () => {
    window.localStorage.setItem("token", "some-token");
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, data: { theme: "dark" } },
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.theme).toBe("dark"));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/me"),
      expect.objectContaining({
        headers: { Authorization: "Bearer some-token" },
      })
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggleTheme() flips between light and dark and updates the DOM", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("light"));

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("does not call the update-theme API when the user has no token", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(() => expect(result.current.theme).toBe("light"));

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(mockedAxios.patch).not.toHaveBeenCalled();
  });
});
