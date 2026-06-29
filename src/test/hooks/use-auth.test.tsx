import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => {
  const mockAuth = {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  };

  // Mock supabase.from().select().eq() chain
  const eqMock = vi.fn();
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });

  return {
    supabase: {
      auth: mockAuth,
      from: fromMock,
    },
  };
});

// A dummy component to consume useAuth
function DummyComponent() {
  const { session, roles, loading, rolesLoaded, isAuthenticated, isStaff } = useAuth();

  if (loading) return <div data-testid="loading">Loading Auth...</div>;
  if (!rolesLoaded) return <div data-testid="roles-loading">Roles Loading...</div>;

  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? "YES" : "NO"}</div>
      <div data-testid="is-staff">{isStaff ? "YES" : "NO"}</div>
      <div data-testid="user-id">{session?.user?.id || "NONE"}</div>
      <div data-testid="roles">{roles.join(", ")}</div>
    </div>
  );
}

describe("AuthProvider & useAuth Integration Tests", () => {
  let authChangeCallback: any;
  const mockUserRolesQuery = supabase.from as any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation for getSession (no active session)
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    // Capture the callback registered in onAuthStateChange
    (supabase.auth.onAuthStateChange as any).mockImplementation((callback: any) => {
      authChangeCallback = callback;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      } as any;
    });

    // Default mock response for fetching roles
    const eqMock = vi.fn().mockResolvedValue({
      data: [{ role: "staff" }],
      error: null,
    });
    mockUserRolesQuery.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: eqMock }),
    } as any);
  });

  it("should initialize as loading and resolve to unauthenticated when no session exists", async () => {
    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>,
    );

    // Verify initial loading state
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Verify resolving to unauthenticated
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("authenticated")).toHaveTextContent("NO");
    expect(screen.getByTestId("user-id")).toHaveTextContent("NONE");
  });

  it("should load user roles and authenticate when session is retrieved from getSession", async () => {
    const mockSession = {
      user: { id: "user-123", email: "staff@example.com" },
    } as any;

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock query database roles result
    const eqMock = vi.fn().mockResolvedValue({
      data: [{ role: "staff" }, { role: "viewer" }],
      error: null,
    });
    mockUserRolesQuery.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: eqMock }),
    } as any);

    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>,
    );

    // Verify resolving authentication and loading roles
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("roles-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("authenticated")).toHaveTextContent("YES");
    expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
    expect(screen.getByTestId("is-staff")).toHaveTextContent("YES");
    expect(screen.getByTestId("roles")).toHaveTextContent("staff, viewer");

    // Verified that supabase database query for user roles was made
    expect(mockUserRolesQuery).toHaveBeenCalledWith("user_roles");
  });

  it("should handle focus session refresh events and CACHE user roles to prevent redundant queries and UI loading flashes", async () => {
    const mockSession = {
      user: { id: "user-123", email: "staff@example.com" },
    } as any;

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const eqMock = vi.fn().mockResolvedValue({
      data: [{ role: "admin" }],
      error: null,
    });
    mockUserRolesQuery.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: eqMock }),
    } as any);

    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>,
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("roles-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("authenticated")).toHaveTextContent("YES");
    expect(screen.getByTestId("roles")).toHaveTextContent("admin");
    expect(eqMock).toHaveBeenCalledTimes(1);

    // --- SIMULATE TAB FOCUS SESSION CHECK ---
    // Trigger onAuthStateChange with same session (representing background tab focus / validation)
    act(() => {
      authChangeCallback("SIGNED_IN", mockSession);
    });

    // Critical Assertions for the bug fix:
    // 1. rolesLoaded should remain true, meaning no "roles-loading" spinner is flashed!
    expect(screen.queryByTestId("roles-loading")).not.toBeInTheDocument();
    expect(screen.getByTestId("authenticated")).toHaveTextContent("YES");

    // 2. The DB query is NOT triggered again because of the cache ref
    expect(eqMock).toHaveBeenCalledTimes(1);
  });

  it("should load new roles and trigger loading transition when a DIFFERENT user logs in", async () => {
    const mockSession1 = {
      user: { id: "user-123", email: "user1@example.com" },
    } as any;

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession1 },
      error: null,
    });

    const eqMock1 = vi.fn().mockResolvedValue({
      data: [{ role: "viewer" }],
      error: null,
    });
    mockUserRolesQuery.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: eqMock1 }),
    } as any);

    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>,
    );

    // Wait for user 1 load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("roles-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
    expect(screen.getByTestId("roles")).toHaveTextContent("viewer");

    // Setup user 2 roles response
    const mockSession2 = {
      user: { id: "user-456", email: "user2@example.com" },
    } as any;

    const eqMock2 = vi.fn().mockResolvedValue({
      data: [{ role: "admin" }],
      error: null,
    });
    mockUserRolesQuery.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: eqMock2 }),
    } as any);

    // Trigger onAuthStateChange with new session (simulating a sign-in or session switch)
    act(() => {
      authChangeCallback("SIGNED_IN", mockSession2);
    });

    // Verify it triggers a loading transition
    expect(screen.getByTestId("roles-loading")).toBeInTheDocument();

    // Verify it resolves to user 2
    await waitFor(() => {
      expect(screen.queryByTestId("roles-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("user-id")).toHaveTextContent("user-456");
    expect(screen.getByTestId("roles")).toHaveTextContent("admin");
  });

  it("should clear roles and session state on sign out", async () => {
    const mockSession = {
      user: { id: "user-123", email: "staff@example.com" },
    } as any;

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <DummyComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("authenticated")).toHaveTextContent("YES");

    // Trigger onAuthStateChange sign-out
    act(() => {
      authChangeCallback("SIGNED_OUT", null);
    });

    expect(screen.getByTestId("authenticated")).toHaveTextContent("NO");
    expect(screen.getByTestId("user-id")).toHaveTextContent("NONE");
    expect(screen.getByTestId("roles")).toHaveTextContent("");
  });
});
