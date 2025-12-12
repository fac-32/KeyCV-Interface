# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Development Environment

This project requires **Node.js version 20 or higher**. To ensure a consistent development environment, we have included an `.nvmrc` file.

If you are using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm), you can switch to the correct Node.js version by running the following command in the project root:

```bash
nvm use
```

This will automatically read the `.nvmrc` file and set your Node.js version accordingly.

## Containerized Development with Podman

For the most consistent development experience across all operating systems, you can use Podman to run the application in a container.

First, build the container image:

```bash
podman build -t keycv-interface .
```

Then, run the container:

```bash
podman run -p 5173:5173 -v ./src:/app/src keycv-interface
```

This will start the Vite development server, and you can access the application at `http://localhost:5173`. The `-v ./src:/app/src` flag mounts the `src` directory into the container, allowing for hot-reloading when you make changes to your code.

## Linting

To run the lint check in this project before pushing your repository, execute the following command:

```bash
npm run lint
```

This command will run both ESLint and Prettier, fixing issues where possible.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```text
    export default defineConfig([
      globalIgnores(['dist']),
      {
        files: ['**/*.{ts,tsx}'],
        extends: [
          // Other configs...

          // Remove tseslint.configs.recommended and replace with this
          tseslint.configs.recommendedTypeChecked,
          // Alternatively, use this for stricter rules
          tseslint.configs.strictTypeChecked,
          // Optionally, add this for stylistic rules
          tseslint.configs.stylisticTypeChecked,

          // Other configs...
        ],
        languageOptions: {
          parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
          },
          // other options...
        },
      },
    ])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```text
    // eslint.config.js
    import reactX from 'eslint-plugin-react-x'
    import reactDom from 'eslint-plugin-react-dom'

    export default defineConfig([
      globalIgnores(['dist']),
      {
        files: ['**/*.{ts,tsx}'],
        extends: [
          // Other configs...
          // Enable lint rules for React
          reactX.configs['recommended-typescript'],
          // Enable lint rules for React DOM
          reactDom.configs.recommended,
        ],
        languageOptions: {
          parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
          },
          // other options...
        },
      },
    ])
```
