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

Pushes to `main` build and publish the generated `dist` folder to the `gh-pages` branch through `.github/workflows/deploy.yml`. Set GitHub Pages to deploy from the `gh-pages` branch root. The Vite repository base path is applied only during production builds, so local development stays at the root URL.
