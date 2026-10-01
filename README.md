# Sport Complex Reservation

React + Vite booking interface for the Sport Complex sports facilities.

## Run Locally

Requirements:

- Node.js 22 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173/
```

For a production-style local check:

```bash
npm run build
npm run preview
```

Then open the preview URL shown in the terminal.

## Checks

```bash
npm run lint
npm run build
```

## GitHub Pages

The deployed site is available at:

<https://rainbowmole.github.io/hci-sports-complex/>

Pushes to `main` build and deploy through `.github/workflows/deploy.yml`. The Vite repository base path is applied only during production builds, so local development stays at the root URL.# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
