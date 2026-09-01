import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "../../../src/components/ProtectedRoute";
import { useAuth } from "../../../src/context/AuthContext";
import type { AuthContextType } from "../../../src/types/auth";

// ProtectedRoute only cares about what useAuth() returns, so we mock the
// hook directly rather than exercising the real AuthProvider/axios stack.
vi.mock("../../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderProtected(adminOnly = false) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <div>Secret content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/user" element={<div>User home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function authState(overrides: Partial<AuthContextType>): AuthContextType {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    loadUser: vi.fn(),
    updateDetails: vi.fn(),
    AdminupdateDetails: vi.fn(),
    updatePassword: vi.fn(),
    setError: vi.fn(),
    ...overrides,
  } as AuthContextType;
}

describe("ProtectedRoute", () => {
  it("shows a loading spinner while auth state is resolving", () => {
    mockedUseAuth.mockReturnValue(authState({ loading: true }));

    const { container } = renderProtected();

    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("redirects to /login when the user is not authenticated", () => {
    mockedUseAuth.mockReturnValue(
      authState({ loading: false, isAuthenticated: false })
    );

    renderProtected();

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("renders the protected children when authenticated", () => {
    mockedUseAuth.mockReturnValue(
      authState({
        loading: false,
        isAuthenticated: true,
        user: { role: "user" } as AuthContextType["user"],
      })
    );

    renderProtected();

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });

  it("redirects a non-admin user away from an admin-only route", () => {
    mockedUseAuth.mockReturnValue(
      authState({
        loading: false,
        isAuthenticated: true,
        user: { role: "user" } as AuthContextType["user"],
      })
    );

    renderProtected(true);

    expect(screen.getByText("User home")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("allows an admin user through an admin-only route", () => {
    mockedUseAuth.mockReturnValue(
      authState({
        loading: false,
        isAuthenticated: true,
        user: { role: "admin" } as AuthContextType["user"],
      })
    );

    renderProtected(true);

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });
});
