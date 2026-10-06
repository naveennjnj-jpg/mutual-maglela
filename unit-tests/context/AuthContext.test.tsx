import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "@/context/AuthContext";

vi.unmock("@/context/AuthContext");
vi.mock("axios", () => {
  const instance: any = {
    get: vi.fn(), post: vi.fn(), put: vi.fn(),
    defaults: {},
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { default: instance, ...instance };
});

const mocked = axios as unknown as { get: any; post: any; put: any; interceptors: any };
const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const user = { id: "1", name: "Ann", email: "a@b.com", role: "user", accountType: "individual", isVerified: true, createdAt: "" };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("useAuth outside provider", () => {
  it("throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/within an AuthProvider/);
    spy.mockRestore();
  });
});

describe("AuthProvider", () => {
  it("finishes loading unauthenticated when no token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(mocked.get).not.toHaveBeenCalled();
  });

  it("loads the user when a token exists", async () => {
    localStorage.setItem("token", "tok");
    mocked.get.mockResolvedValueOnce({ data: { success: true, data: user } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(result.current.user).toEqual(user);
    expect(mocked.get).toHaveBeenCalledWith("/api/auth/me", { headers: { Authorization: "Bearer tok" } });
  });

  it("clears an invalid token when /me fails", async () => {
    localStorage.setItem("token", "bad");
    mocked.get.mockRejectedValueOnce(new Error("401"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("login success stores token and user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.post.mockResolvedValueOnce({ data: { success: true, token: "t1", data: user } });
    let res: any;
    await act(async () => { res = await result.current.login("a@b.com", "pw"); });
    expect(res.success).toBe(true);
    expect(mocked.post).toHaveBeenCalledWith("/api/auth/login", { email: "a@b.com", password: "pw" });
    expect(localStorage.getItem("token")).toBe("t1");
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("login failure returns the API message and sets error", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
    let res: any;
    await act(async () => { res = await result.current.login("a@b.com", "x"); });
    expect(res).toEqual({ success: false, error: "Invalid credentials" });
    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("login failure falls back to a default message", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.post.mockRejectedValueOnce(new Error("network"));
    let res: any;
    await act(async () => { res = await result.current.login("a", "b"); });
    expect(res.error).toBe("Login failed");
  });

  it("register success stores token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.post.mockResolvedValueOnce({ data: { success: true, token: "r1", data: user } });
    let res: any;
    await act(async () => {
      res = await result.current.register({ name: "Ann", email: "a@b.com", password: "pw", accountType: "individual" });
    });
    expect(res.success).toBe(true);
    expect(localStorage.getItem("token")).toBe("r1");
  });

  it("register failure returns default message", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.post.mockRejectedValueOnce(new Error("x"));
    let res: any;
    await act(async () => {
      res = await result.current.register({ name: "A", email: "a", password: "p", accountType: "individual" });
    });
    expect(res).toEqual({ success: false, error: "Registration failed" });
  });

  it("logout clears state and token even if the API fails", async () => {
    localStorage.setItem("token", "tok");
    mocked.get.mockResolvedValueOnce({ data: { success: true, data: user } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    mocked.get.mockRejectedValueOnce(new Error("down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => { await result.current.logout(); });
    spy.mockRestore();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("updateDetails updates the user", async () => {
    localStorage.setItem("token", "tok");
    mocked.get.mockResolvedValueOnce({ data: { success: true, data: user } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    const updated = { ...user, name: "Bob" };
    mocked.put.mockResolvedValueOnce({ data: { success: true, data: updated } });
    let res: any;
    await act(async () => { res = await result.current.updateDetails({ name: "Bob" }); });
    expect(res.success).toBe(true);
    expect(result.current.user?.name).toBe("Bob");
  });

  it("updateDetails failure returns error", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.put.mockRejectedValueOnce({ response: { data: { message: "Nope" } } });
    let res: any;
    await act(async () => { res = await result.current.updateDetails({ name: "x" }); });
    expect(res).toEqual({ success: false, error: "Nope" });
  });

  it("updatePassword success / failure", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocked.put.mockResolvedValueOnce({ data: { success: true, data: user } });
    let ok: any, bad: any;
    await act(async () => { ok = await result.current.updatePassword("old", "new"); });
    expect(ok.success).toBe(true);
    expect(mocked.put).toHaveBeenCalledWith("/api/auth/updatepassword", { currentPassword: "old", newPassword: "new" }, expect.anything());
    mocked.put.mockRejectedValueOnce(new Error("x"));
    await act(async () => { bad = await result.current.updatePassword("old", "new"); });
    expect(bad).toEqual({ success: false, error: "Password update failed" });
  });
});
