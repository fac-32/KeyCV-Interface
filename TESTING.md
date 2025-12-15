# Testing Guide

This document provides instructions and best practices for writing and running tests in this project.

## Testing Framework

This project is configured with the following tools for testing:

- **[Vitest](https://vitest.dev/):** A fast and modern testing framework.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro):** A library for testing React components in a way that resembles how a user interacts with them.
- **[jsdom](https://github.com/jsdom/jsdom):** A pure-JavaScript implementation of many web standards, allowing tests to be run in a Node.js environment without a browser.

## File Naming Convention

All test files should follow the naming convention `*.test.tsx`. For example, a test file for `MyComponent.tsx` should be named `MyComponent.test.tsx`.

## Writing Tests

Here is a basic example of a test for a React component:

```tsx
// src/components/MyComponent.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render the component with the correct text", () => {
    // 1. Render the component
    render(<MyComponent text="Hello, World!" />);

    // 2. Find an element by its text content
    const headingElement = screen.getByText(/Hello, World!/i);

    // 3. Assert that the element is in the document
    expect(headingElement).toBeInTheDocument();
  });
});
```

### Key Principles

- **`describe`**: Groups related tests together into a suite.
- **`it` or `test`**: Defines an individual test case. The description should clearly state what the test is asserting.
- **`render`**: Renders the React component into a virtual DOM provided by jsdom.
- **`screen`**: An object from React Testing Library that provides queries to find elements on the "screen" (the rendered component).
- **`expect`**: The assertion function from Vitest, used to check if a certain condition is met.

## How to Run Tests

You can run tests using the `npm test` script, which executes `vitest`.

- **Run all tests once:**

  ```bash
  npm test
  ```

- **Run tests in watch mode (re-runs on file changes):**

  ```bash
  npm test -- --watch
  ```

- **Run tests for a specific file:**

  ```bash
  npm test src/components/MyComponent.test.tsx
  ```

## Best Practices

- **Test User Behavior, Not Implementation:** Focus your tests on what the user sees and does, not on the internal state or methods of a component.
- **Accessibility:** Use queries that are accessible to users, such as `getByRole`, `getByLabelText`, or `getByText`. This helps ensure your application is more accessible.
- **Isolation:** Each test should be independent and not rely on the state or outcome of another test.
