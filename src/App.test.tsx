// src/App.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

const APP_BASENAME = "/KeyCV-Interface";

// Mock the child components to keep the test lightweight and focused on routing
vi.mock("./components/Create-User", () => ({
  default: () => <div>CreateUser Component</div>,
}));
vi.mock("./components/Login-User", () => ({
  default: () => <div>LoginUser Component</div>,
}));
vi.mock("./components/JobForm", () => ({
  default: () => <div>JobForm Component</div>,
}));

const renderApp = (initialPath = `${APP_BASENAME}/`) =>
  render(
    <MemoryRouter basename={APP_BASENAME} initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );

describe("App Component - Routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders JobForm component by default on the home route", () => {
    renderApp(APP_BASENAME); // Simulate home path

    expect(screen.getByText("KeyCV")).toBeInTheDocument();
    expect(screen.getByText("Join to us")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("JobForm Component")).toBeInTheDocument();
  });

  test("Links have correct href attributes", () => {
    renderApp(APP_BASENAME); // Simulate home path

    expect(screen.getByText("KeyCV")).toHaveAttribute("href", APP_BASENAME);
    expect(screen.getByText("Join to us")).toHaveAttribute(
      "href",
      `${APP_BASENAME}/create-user`,
    );
    expect(screen.getByText("Sign In")).toHaveAttribute(
      "href",
      `${APP_BASENAME}/login-user`,
    );
  });
});
