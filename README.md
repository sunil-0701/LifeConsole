# LifeConsole

LifeConsole is a personal data, productivity, and analytics platform for managing journals, goals, finances, projects, and career development. Built with React, JavaScript, Vite, Tailwind CSS, Spring Boot, Java 21, Maven, and PostgreSQL.

## Frontend location

The React frontend lives in `lifeconsole-facade/facade`. Run the npm commands below from that directory.

## Install dependencies

Install Node.js and npm, then prepare the frontend:

```sh
cd lifeconsole-facade/facade
npm install
```

## Start development

```sh
npm run dev
```

Open the local URL printed by Vite in your terminal.

Stop the development server with `Ctrl+C` in the same terminal.

## Build and preview

Create a production build, then serve it locally for review:

```sh
npm run build
npm run preview
```

After changing source files, run `npm run build` again to refresh the previewed build.

## Lint

Check the frontend with ESLint before submitting changes:

```sh
npm run lint
```

## Tests

Run the frontend test suite once with Vitest:

```sh
npm test
```

For an interactive watch session during development, run `npx vitest`.
