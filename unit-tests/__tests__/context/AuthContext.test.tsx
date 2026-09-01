import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { AuthProvider, useAuth } from "../../../src/context/AuthContext";
import type { User } from "../../../src/types/auth";

// AuthContext talks to the backend exclusively through axios, so we mock
// the whole module. No real network calls are made.
vi.mock("axios", () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    defaults: { baseURL: "", withCredentials: false },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: instance };
});

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockUser: User = {
  id: "u1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "user",
  accountType: "individual",
  isVerified: true,
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    // Default: no session on the backend unless a test overrides it.
    mockedAxios.get.mockRejectedValue({ response: { status: 401 } });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("useAuth throws when used outside of an AuthProvider", () => {
    // Suppress the expected React error log for this negative test.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });

  it("starts unauthenticated with no token in localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    // No token was present, so /api/auth/me should never have been called.
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("loads the user on mount when a token already exists", async () => {
    window.localStorage.setItem("token", "existing-token");
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, data: mockUser },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer existing-token" },
      })
    );
  });

  it("clears a stale token if loading the user fails", async () => {
    window.localStorage.setItem("token", "stale-token");
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem("token")).toBeNull();
  });

  it("login() stores the token and user on success", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, token: "new-token", data: mockUser },
    });

    let outcome: Awaited<ReturnType<typeof result.current.login>>;
    await act(async () => {
      outcome = await result.current.login("jane@example.com", "secret");
    });

    expect(outcome!.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(window.localStorage.getItem("token")).toBe("new-token");
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "jane@example.com",
      password: "secret",
    });
  });

  it("login() surfaces the server error message on failure", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    let outcome: Awaited<ReturnType<typeof result.current.login>>;
    await act(async () => {
      outcome = await result.current.login("jane@example.com", "wrong");
    });

    expect(outcome!.success).toBe(false);
    expect(outcome!.error).toBe("Invalid credentials");
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Invalid credentials");
  });

  it("login() falls back to a generic message when the server gives none", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedAxios.post.mockRejectedValueOnce(new Error("network down"));

    let outcome: Awaited<ReturnType<typeof result.current.login>>;
    await act(async () => {
      outcome = await result.current.login("jane@example.com", "secret");
    });

    expect(outcome!.success).toBe(false);
    expect(outcome!.error).toBe("Login failed");
  });

  it("register() stores the token and marks the user authenticated", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, token: "reg-token", data: mockUser },
    });

    let outcome: Awaited<ReturnType<typeof result.current.register>>;
    await act(async () => {
      outcome = await result.current.register({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "secret",
        accountType: "individual",
      });
    });

    expect(outcome!.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(window.localStorage.getItem("token")).toBe("reg-token");
  });

  it("logout() clears the user, auth flag, and token even if the API call fails", async () => {
    window.localStorage.setItem("token", "existing-token");
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, data: mockUser },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    mockedAxios.get.mockRejectedValueOnce(new Error("logout endpoint down"));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem("token")).toBeNull();
  });

  it("updateDetails() updates the local user on success", async () => {
    window.localStorage.setItem("token", "existing-token");
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, data: mockUser },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    const updatedUser = { ...mockUser, name: "Jane Updated" };
    mockedAxios.put.mockResolvedValueOnce({
      data: { success: true, data: updatedUser },
    });

    let outcome: Awaited<ReturnType<typeof result.current.updateDetails>>;
    await act(async () => {
      outcome = await result.current.updateDetails({ name: "Jane Updated" });
    });

    expect(outcome!.success).toBe(true);
    expect(result.current.user?.name).toBe("Jane Updated");
  });

  it("updatePassword() reports failure with the server's message", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedAxios.put.mockRejectedValueOnce({
      response: { data: { message: "Current password is incorrect" } },
    });

    let outcome: Awaited<ReturnType<typeof result.current.updatePassword>>;
    await act(async () => {
      outcome = await result.current.updatePassword("wrong", "newpass");
    });

    expect(outcome!.success).toBe(false);
    expect(outcome!.error).toBe("Current password is incorrect");
  });

  it("setError() lets a consumer clear or set the error manually", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setError("Something went wrong");
    });
    expect(result.current.error).toBe("Something went wrong");

    act(() => {
      result.current.setError(null);
    });
    expect(result.current.error).toBeNull();
  });
});
