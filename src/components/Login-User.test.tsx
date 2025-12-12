import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import {
  AuthError,
  type AuthTokenResponsePassword,
  type Session,
  type User,
} from "@supabase/auth-js";
import LoginUser from "./Login-User";

// Mock the API service module
vi.mock("@/services/api", () => ({
  signInUser: vi.fn(),
}));

const mockUser: User = {
  id: "mock-user-id",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "test@example.com",
};

const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: mockUser,
};

describe("LoginUser Component", () => {
  test("successfully logs in and displays success message", async () => {
    const successfulResponse: AuthTokenResponsePassword = {
      data: { user: mockUser, session: mockSession },
      error: null,
    };

    const { signInUser } = await import("@/services/api");
    vi.mocked(signInUser).mockResolvedValue(successfulResponse);

    render(<LoginUser />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    // Wait for and assert that the success message is displayed
    const successMessage = await screen.findByText(
      /Logged in as test@example.com/i,
    );
    expect(successMessage).toBeInTheDocument();
  });

  test("displays an error message on failed login", async () => {
    // Configure the mock to return an error
    const failedResponse: AuthTokenResponsePassword = {
      data: { user: null, session: null, weakPassword: null },
      error: new AuthError(
        "Invalid login credentials",
        400,
        "invalid_login_credentials",
      ),
    };

    const { signInUser } = await import("@/services/api");
    vi.mocked(signInUser).mockResolvedValue(failedResponse);

    render(<LoginUser />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    // Wait for and assert that the error message is displayed
    const errorMessage = await screen.findByText(
      /Email or password is incorrect/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
