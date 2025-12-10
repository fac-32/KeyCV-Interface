# KeyCV-Interface Audit for Test Readiness

This audit outlines critical issues to be addressed before implementing tests with `vitest`. The goal is to establish a robust, testable, and maintainable frontend architecture.

---

## 1. Missing Test Infrastructure [✅]

**Issue:** The project lacks any testing infrastructure. There are no test files, and `vitest` is not configured.

**Recommendation:**

* **Install Testing Libraries:** Add `@testing-library/react`, `jsdom` (or `happy-dom`), and `@testing-library/jest-dom` as `devDependencies`.

    ```bash
    npm install --save-dev @testing-library/react jsdom @testing-library/jest-dom
    ```

* **Configure Vitest:** Update `vite.config.ts` to configure the test environment.

    ```typescript
    // vite.config.ts
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import path from "path";
    import tailwindcss from "@tailwindcss/vite";

    export default defineConfig({
      base: "/KeyCV-Interface/",
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      // vitest config
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts", // Create this file
        css: true,
      },
    });
    ```

* **Create Setup File:** Create `src/test/setup.ts` to import necessary utilities like `@testing-library/jest-dom`.

## 2. Hardcoded API Endpoints & Credentials [✅]

**Issue:** Components like `JobForm.tsx` and `CV-Upload.tsx` contain hardcoded API URLs. The Supabase client is initialized with credentials from `.env.local`, which points to a live database. Tests should never run against live services.

**Recommendation:**

* **Use Environment Variables:** Centralize all external URLs in `.env` files. Use `VITE_API_BASE_URL` as suggested in `NEXT_STEPS.md`.
* **Create a Test Environment File:** Create a `.env.test` file with mock credentials and URLs for the testing environment. Vitest will pick this up automatically.

    ```text
    # .env.test
    VITE_SUPABASE_URL="https://mock.supabase.co"
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY="mock-key"
    VITE_API_BASE_URL="http://localhost:1234/api/ai"
    ```

## 3. Direct API and Database Calls in Components [✅]

**Issue:** Components directly use the `supabase` client and `fetch`. This tightly couples the UI to external services, making components difficult to test in isolation.

**Recommendation:**

* **Abstract Logic into Services/Hooks:** Move all Supabase and `fetch` calls into a dedicated service layer (e.g., `src/services/api.ts`) or custom hooks (e.g., `useAuth`, `useSubmitCV`).
* **Example (Service):**

    ```typescript
    // src/services/api.ts
    import supabase from "@/lib/supabaseClient";

    export const signUpUser = (email, password) => {
      return supabase.auth.signUp({ email, password });
    };

    export const analyzeResume = (formData) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL + '/analyze-resume';
      return fetch(apiUrl, { method: 'POST', body: formData });
    };
    ```

## 4. No Mocking Strategy [✅]

**Issue:** Without a mocking strategy, tests will be slow, flaky, and dependent on network conditions and backend stability.

**Recommendation:**

* **Implement Mocking:** Use `vitest.vi.mock()` to mock the service modules or custom hooks created in the previous step. This allows you to control the data and errors returned during tests without making real API calls.
* **Example (Test File):**

    ```tsx
    // src/components/Login-User.test.tsx
    import { render, screen, fireEvent } from "@testing-library/react";
    import { vi } from "vitest";
    import LoginUser from "./Login-User";

    // Mock the entire api service
    vi.mock("@/services/api", () => ({
      signInUser: vi.fn(),
    }));

    test("successfully logs in and displays success message", async () => {
      // Your test implementation here
    });
    ```

## 5. Dependency Management [✅]

**Issue:** `vitest` and `cypress` are currently listed under `dependencies` in `package.json`. These are development tools and should not be included in the production bundle.

**Recommendation:**

* Move all testing-related packages to `devDependencies`.

    ```bash
    # Example for one package
    npm uninstall vitest && npm install --save-dev vitest
    ```

## 6. Code Quality & Anti-Patterns [⚪ Pending]

**Issue:** The `CV-Upload.tsx` component uses `alert()`, which is a legacy practice and can interfere with automated testing environments.

**Recommendation:**

- Replace alert() calls with state-driven feedback mechanisms within the component's UI (e.g., displaying an error message in a `<p>` tag).
