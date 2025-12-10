import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import LoginUser from "./Login-User";

// Mock the API service module
vi.mock("@/services/api", () => ({
  signInUser: vi.fn(),
}));

describe("LoginUser Component", () => {
  test("successfully logs in and displays success message", async () => {
    const mockData = {
      user: { email: "test@example.com" },
      session: {}, // Add other necessary properties
    };

    // Configure the mock to return a successful response
    vi.mocked(await import("@/services/api")).signInUser.mockResolvedValue({
      data: mockData,
      error: null,
    });

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
    vi.mocked(await import("@/services/api")).signInUser.mockResolvedValue({
      data: null,
      error: { message: "Invalid login credentials" },
    });

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
