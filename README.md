# WebAssembly IDE Frontend

This repository contains the source code for the [Next.js](https://nextjs.org) app used for my dissertation project. The app is a web-based IDE designed to make building projects that utilise WebAssembly easier. This app uses two different IDEs that use very different approaches to how they run and compile WebAssembly projects:

* **The Projects IDE** - a client-server IDE that allows users to create, edit and run WebAssembly projects using an API for managing compilation and storage.
* **The WebContainer Playground** - a client-side IDE that allows users to create web applications that utilise WebAssembly (using AssemblyScript as the source language for compilation) within a Node.js environment running entirely in the browser via a [WebContainer](https://webcontainers.io).

This application is deployed to Vercel at [https://wasm-web-ide-client.vercel.app](https://wasm-web-ide-client.vercel.app).

## Setup

This project uses [pnpm](https://pnpm.io/) for package management. To install pnpm, run:

```bash
npm install -g pnpm
```

Then, to install the project dependencies, run:

```bash
pnpm install
```

### Running the app

In order to run the server, you must specify the required environment variables in a `.env` file in the root of the project. The following variables are required:

* `NEXT_PUBLIC_API_URL` - URL of the deployed API server (used by the 'Projects IDE')
* `REDIS_URL` - URL of a running Redis instance (used by the 'WebContainer Playground')

The app can then be run in development mode using:

```bash
pnpm dev
```

The application will then be available at [http://localhost:3000](http://localhost:3000) - note that the app will not be able to connect to the API server at this URL due to CORS restrictions, thus the 'Projects IDE' will not work in development mode. However, the app will still be able to connect to the Redis instance so the 'WebContainer Playground' will work.

## Testing

In order to run the tests you must specify the following environment variables:

* `TEST_URL` - URL of the deployed app. This should be [https://wasm-web-ide-client.vercel.app](https://wasm-web-ide-client.vercel.app) when running the tests against the production app.
* `TEST_USER_EMAIL` - Email address of an *existing* user of the 'Projects IDE'
* `TEST_USER_PASSWORD` - Password of an *existing* user of the 'Projects IDE'

To run the tests, run:

```bash
pnpm test
```

The tests use the [Playwright](https://playwright.dev/) test runner and a test report is generated and published upon each completed test run.

End-to-end tests are run upon each push to the GitHub repository and every 24 hours using GitHub Actions (see the [`.github/workflows/e2e-test.yml`](.github/workflows/e2e-test.yml) file). The generated report is published to GitHub pages at [https://sammyhass.github.io/wasm-web-ide-client/](https://sammyhass.github.io/wasm-web-ide-client/).
