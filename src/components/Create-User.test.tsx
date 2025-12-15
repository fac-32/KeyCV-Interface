// src/components/Create-User.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import type { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import { MemoryRouter } from "react-router-dom";
import CreateUser from "./Create-User";

// Mock the API service module
vi.mock("@/services/api", () => ({
  signUpUser: vi.fn(),
  getCurrentUser: vi.fn(),
  insertUser: vi.fn(),
}));

describe("CreateUser Component", () => {
  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>,
    );

  test("displays error message if email or password fields are empty", async () => {
    const { signUpUser } = await import("@/services/api");
    renderWithRouter();

    // Simulate form submission directly to bypass browser's native validation
    fireEvent.submit(screen.getByRole("form"));

    const errorMessage = await screen.findByText(
      /email and password fields are required/i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(signUpUser).not.toHaveBeenCalled(); // Ensure API is not called
  });

  test("displays error message if password is less than 8 characters", async () => {
    const { signUpUser } = await import("@/services/api");
    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    const errorMessage = await screen.findByText(
      /password must be at least 8 characters long/i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(signUpUser).not.toHaveBeenCalled(); // Ensure API is not called
  });

  test("successfully creates a user and displays success message", async () => {
    const api = await import("@/services/api");
    const mockUser = {
      id: "user-id-123",
      email: "newuser@example.com",
      aud: "authenticated",
      role: "authenticated",
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add other required properties for User type if necessary for strictness
    } as User;

    // Mock successful sign-up
    vi.mocked(api.signUpUser).mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null,
    });

    // Mock successful get current user
    vi.mocked(api.getCurrentUser).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    // Mock successful user insertion
    vi.mocked(api.insertUser).mockResolvedValueOnce({
      error: null,
      data: null,
      count: null,
      status: 201,
      statusText: "Created",
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "longenoughpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(api.signUpUser).toHaveBeenCalledWith(
        "newuser@example.com",
        "longenoughpassword",
      );
    });

    await waitFor(() => {
      expect(api.getCurrentUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(api.insertUser).toHaveBeenCalledWith(mockUser.id);
    });

    const successMessage = await screen.findByText(
      /Account created successfully/i,
    );
    expect(successMessage).toBeInTheDocument();
  });

  test("displays error message if sign-up fails because email is already in use", async () => {
    const { signUpUser } = await import("@/services/api");
    vi.mocked(signUpUser).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: {
        message: "User already registered",
        code: "user_already_exists",
        status: 400,
        name: "AuthApiError", // Added missing 'name' property
      } as AuthError,
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    const errorMessage = await screen.findByText(
      /This email is already in use/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays generic error message if sign-up fails for other reasons", async () => {
    const { signUpUser } = await import("@/services/api");
    vi.mocked(signUpUser).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: {
        message: "Network error",
        code: "500",
        status: 500,
        name: "AuthApiError", // Added missing 'name' property
      } as AuthError,
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "any@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    const errorMessage = await screen.findByText(
      /An error has occured while creating your account/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays error message if user insertion fails due to duplicate key (email already in use)", async () => {
    const api = await import("@/services/api");
    const mockUser = {
      id: "user-id-456",
      email: "duplicate@example.com",
      aud: "authenticated",
      role: "authenticated",
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;

    // Mock successful sign-up
    vi.mocked(api.signUpUser).mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null,
    });

    // Mock successful get current user
    vi.mocked(api.getCurrentUser).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    // Mock failed user insertion due to duplicate key
    vi.mocked(api.insertUser).mockResolvedValueOnce({
      error: {
        message: "Duplicate key",
        code: "23505",
        details: "some-details", // Added missing 'details' property
        hint: "some-hint", // Added missing 'hint' property
      } as PostgrestError,
      data: null,
      count: null,
      status: 409,
      statusText: "Conflict",
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "duplicate@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    const errorMessage = await screen.findByText(
      /This email is already in use/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
