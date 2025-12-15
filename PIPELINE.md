# CI/CD Pipeline Best Practices ⚙️

This document outlines the best practices for our CI/CD pipeline to ensure consistent, reliable, and efficient builds.

## Overview 🌎

The primary goal of our CI/CD pipeline is to automate the process of building, testing, and deploying our application. Adhering to these guidelines is crucial for maintaining a stable and predictable development workflow.

## Key Principles 🔑

- **Consistency:** Every build should be consistent, regardless of who triggers it or when.
- **Reproducibility:** We must be able to reproduce any build at any time. This is critical for debugging and for ensuring that what we test is what we deploy.
- **Speed:** A fast pipeline means faster feedback for developers.

## Dependency Management 🖇️

Proper dependency management is the foundation of a reliable CI/CD pipeline.

### The Role of `package.json` and `package-lock.json` 📦

- **`package.json`**: Lists the dependencies your project needs, often with a version range (e.g., `^1.2.3`). This file describes the _intended_ dependencies.
- **`package-lock.json`**: Records the _exact_ version of every dependency that was installed, including sub-dependencies. This file ensures that you get the same dependency tree every single time. **This file must be committed to the repository.**

### `npm install` vs. `npm ci`

This is the most important distinction for our workflow.

- **`npm install`**:
  - Use this command for **local development when you need to add or update dependencies**.
  - It may update your `package-lock.json` file based on the version ranges in `package.json`.
  - **NEVER use `npm install` (without arguments) in the CI/CD pipeline.**

- **`npm ci`** ("Clean Install"):
  - This is the **ONLY command that should be used to install dependencies in the CI/CD pipeline**.
  - It installs dependencies directly from `package-lock.json`, ignoring `package.json`.
  - It guarantees reproducible builds because it always installs the exact same dependency versions.
  - It's generally faster than `npm install`.
  - It starts by deleting the `node_modules` directory to ensure a clean installation.

## Workflow for Managing Dependencies

### Local Development Workflow

1. **To add a new dependency:**

   ```bash
   npm install <package-name>
   ```

   For a development dependency (e.g., a testing library):

   ```bash
   npm install <package-name> --save-dev
   ```

2.**Commit changes:** After adding or updating dependencies, commit both the `package.json` and the updated ``package-lock.json` files.

```bash
git add package.json package-lock.json
git commit -m "feat: Add <package-name> dependency"
```

### CI/CD Pipeline Workflow

1.**Checkout code:** The pipeline will check out the latest version of the code from the repository.

2.**Install dependencies:** The pipeline must use `npm ci` to install dependencies.

```yaml
# Example step in a GitHub Actions workflow
- name: Install Dependencies
  run: npm ci
```

This ensures that the pipeline uses the exact dependency versions that you tested with locally.

## Best Practices Summary

- **Always** commit your `package-lock.json` file.
- **Always** use `npm ci` in the CI/CD pipeline to install dependencies.
- **Only** use `npm install <package-name>` locally to add or update dependencies.
- **Regularly** update your dependencies locally to get the latest features and security patches, and commit the updated `package-lock.json`.
- Ensure your `package.json` and `package-lock.json` files are in sync before pushing your changes. `npm ci` will fail if they are not, which is a good thing.
